import { logger } from './logger';
import { tmdb, tmdbApi } from './clients';
import { Cast, Crew } from 'moviedb-promise';
import { broadcast } from './index'; // Importar a função de broadcast
import { Prisma, PrismaClient } from '@prisma/client';

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


async function fetchChangedMovieIds(startDate: string): Promise<number[]> {
  logger.info(`Buscando IDs de filmes alterados desde ${startDate}...`);
  const movieIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApi.get('/movie/changes', {
        params: { start_date: startDate, page },
      });

      if (response.data.results) {
        for (const movie of response.data.results) {
          if (movie.id && !movie.adult) { // Ignorar conteúdo adulto por enquanto
            movieIds.add(movie.id);
          }
        }
      }

      totalPages = response.data.total_pages || 1;
      page++;
      await delay(250); // Pausa para respeitar o rate limit
    } while (page <= totalPages);
    
    logger.info(`Total de ${movieIds.size} IDs de filmes alterados encontrados.`);
    return Array.from(movieIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de filmes alterados: ${error}`);
    return [];
  }
}

async function processMovieBatch(movieIds: number[], prisma: PrismaClient): Promise<void> {
  for (const id of movieIds) {
    try {
      const movieDetails = await tmdbApiWithRetry(() => tmdb.movieInfo({
        id,
        language: 'pt-BR',
        append_to_response: 'credits,videos,watch/providers',
      })) as any;

      const existingMovie = await prisma.filme.findUnique({ where: { tmdbId: id } });

      const data: Prisma.FilmeCreateInput = {
        tmdbId: movieDetails.id,
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
        imdbId: movieDetails.imdb_id,
      };

      let savedFilme;

      if (existingMovie) {
        savedFilme = await prisma.filme.update({
          where: { tmdbId: id },
          data,
        });
        logger.info(`🔄 Filme [${id}] "${savedFilme.title}" atualizado.`);
        broadcast({ type: 'UPDATED_ITEM', mediaType: 'filme', data: savedFilme });
      } else {
        savedFilme = await prisma.filme.create({ data });
        logger.info(`✅ Filme [${id}] "${savedFilme.title}" criado.`);
        broadcast({ type: 'NEW_ITEM', mediaType: 'filme', data: savedFilme });
      }

    } catch (error) {
      logger.error(`❌ Erro ao processar o filme ID ${id}. Pulando: ${error}`);
    }
  }
}

export async function syncMovies() {
  const prisma = new PrismaClient();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const startDate = threeDaysAgo.toISOString().split('T')[0];

  const changedMovieIds = await fetchChangedMovieIds(startDate);
  const batchSize = 10;

  if (changedMovieIds.length === 0) {
    logger.info('Nenhum filme para atualizar.');
    return;
  }

  for (let i = 0; i < changedMovieIds.length; i += batchSize) {
    const batch = changedMovieIds.slice(i, i + batchSize);
    logger.info(`Processando lote de filmes: ${i + 1}-${Math.min(i + batchSize, changedMovieIds.length)} de ${changedMovieIds.length}`);
    await processMovieBatch(batch, prisma);
  }
}