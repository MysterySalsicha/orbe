import { logger } from './logger';
import { tmdb } from './clients';
import { MovieDb, Cast, Crew } from 'moviedb-promise';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tmdbApiWithRetry<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error: any) {
            const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNRESET';
            if (isNetworkError) {
                attempt++;
                if (attempt >= maxRetries) {
                    throw error;
                }
                const delayTime = initialDelay * Math.pow(2, attempt);
                logger.info(`Tentativa ${attempt} falhou com erro de rede. Tentando novamente em ${delayTime}ms...`);
                await delay(delayTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error("Número máximo de tentativas atingido");
}

async function fetchAllMovieIdsForPeriod(startDate: string, endDate: string): Promise<number[]> {
  logger.info(`Buscando todos os IDs de filmes para o período de ${startDate} a ${endDate}...`);
  const movieIds = new Set<number>();
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApiWithRetry(() => tmdb.discoverMovie({
        'primary_release_date.gte': startDate,
        'primary_release_date.lte': endDate,
        page: currentPage,
      }));

      if (response.results) {
        for (const movie of response.results) {
          if (movie.id) {
            movieIds.add(movie.id);
          }
        }
      }

      totalPages = response.total_pages || 1;
      currentPage++;
      await delay(100);
    } while (currentPage <= totalPages);
    
    logger.info(`Total de ${movieIds.size} IDs de filmes únicos encontrados para o período.`);
    return Array.from(movieIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de filmes: ${error}`);
    return [];
  }
}

async function processMovieBatch(movieIds: number[], prisma: any): Promise<void> {
  for (const id of movieIds) {
    try {
      const movieDetailsResponse = await tmdbApiWithRetry(() => tmdb.movieInfo({
        id,
        append_to_response: 'credits,videos',
      }));
      const movieDetails = movieDetailsResponse as any;

      if (movieDetails.imdb_id) {
        const existingMovie = await prisma.filme.findUnique({
          where: { imdbId: movieDetails.imdb_id },
        });

        if (existingMovie) {
          // Se o filme já existe com este imdbId, atualize-o
          await prisma.filme.update({
            where: { id: existingMovie.id },
            data: {
              tmdbId: id,
              title: movieDetails.title!,
              originalTitle: movieDetails.original_title,
              overview: movieDetails.overview,
              releaseDate: movieDetails.release_date ? new Date(movieDetails.release_date) : null,
              runtime: movieDetails.runtime,
              budget: BigInt(movieDetails.budget || 0),
              revenue: BigInt(movieDetails.revenue || 0),
              popularity: movieDetails.popularity,
              voteAverage: movieDetails.vote_average,
              voteCount: movieDetails.vote_count,
              status: movieDetails.status,
              tagline: movieDetails.tagline,
              homepage: movieDetails.homepage,
              posterPath: movieDetails.poster_path,
              backdropPath: movieDetails.backdrop_path,
            },
          });
          logger.info(`🔄 Filme [${id}] "${movieDetails.title}" atualizado pelo imdbId.`);
          return; // Pula para o próximo filme
        }
      }

      const castData = movieDetails.credits?.cast?.filter((p: Cast) => p.id && p.name) ?? [];
      const crewData = movieDetails.credits?.crew?.filter((p: Crew) => p.id && p.name && p.job) ?? [];
      
      const uniqueCast = castData.reduce((acc: Cast[], current: Cast) => {
        if (!acc.find(item => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, [] as Cast[]);

      const uniqueCrew = crewData.reduce((acc: Crew[], current: Crew) => {
        if (!acc.find(item => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, [] as Crew[]);

      await prisma.filme.upsert({
        where: { tmdbId: id },
        update: {
            title: movieDetails.title,
            posterPath: movieDetails.poster_path,
        },
        create: {
            tmdbId: id,
            imdbId: movieDetails.imdb_id,
            title: movieDetails.title!,
            originalTitle: movieDetails.original_title,
            overview: movieDetails.overview,
            releaseDate: movieDetails.release_date ? new Date(movieDetails.release_date) : null,
            runtime: movieDetails.runtime,
            budget: BigInt(movieDetails.budget || 0),
            revenue: BigInt(movieDetails.revenue || 0),
            popularity: movieDetails.popularity,
            voteAverage: movieDetails.vote_average,
            voteCount: movieDetails.vote_count,
            status: movieDetails.status,
            tagline: movieDetails.tagline,
            homepage: movieDetails.homepage,
            posterPath: movieDetails.poster_path,
            backdropPath: movieDetails.backdrop_path,
            
            cast: {
              create: uniqueCast.map((ator: Cast) => ({
                character: ator.character ?? 'N/A',
                order: ator.order,
                pessoa: {
                  connectOrCreate: {
                    where: { tmdbId: ator.id! },
                    create: { tmdbId: ator.id!, name: ator.name!, profilePath: ator.profile_path },
                  },
                },
              })),
            },
            crew: {
              create: uniqueCrew.map((membro: Crew) => ({
                job: membro.job!,
                department: membro.department,
                pessoa: {
                  connectOrCreate: {
                    where: { tmdbId: membro.id! },
                    create: { tmdbId: membro.id!, name: membro.name!, profilePath: membro.profile_path },
                  },
                },
              })),
            },
            videos: {
              create: movieDetails.videos?.results?.map((video: any) => ({
                tmdbId: video.id,
                key: video.key!,
                name: video.name!,
                site: video.site!,
                type: video.type!,
                official: video.official!,
              })) ?? [],
            }
        },
      });
      logger.info(`✅ Filme [${id}] "${movieDetails.title}" sincronizado.`);
    } catch (error) {
      logger.error(`❌ Erro ao processar o filme ID ${id}. Pulando: ${error}`);
    }
  }
}

export async function syncMovies(startDate: string, endDate: string, prisma: any) {
  const allMovieIds = await fetchAllMovieIdsForPeriod(startDate, endDate);
  const batchSize = 10;

  for (let i = 0; i < allMovieIds.length; i += batchSize) {
    const batch = allMovieIds.slice(i, i + batchSize);
    logger.info(`Processando lote de filmes: ${i + 1}-${Math.min(i + batchSize, allMovieIds.length)} de ${allMovieIds.length}`);
    await processMovieBatch(batch, prisma);
  }
}