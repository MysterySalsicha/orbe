import { logger } from './logger';
import { tmdb } from './clients';
import { Cast, Crew } from 'moviedb-promise';

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

async function fetchAllSerieIdsForPeriod(startDate: string, endDate: string): Promise<number[]> {
  logger.info(`Buscando todos os IDs de séries para o período de ${startDate} a ${endDate}...`);
  const serieIds = new Set<number>();
  let currentPage = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApiWithRetry(() => tmdb.discoverTv({
        'first_air_date.gte': startDate,
        'first_air_date.lte': endDate,
        page: currentPage,
      }));

      if (response.results) {
        for (const serie of response.results) {
          if (serie.id) {
            serieIds.add(serie.id);
          }
        }
      }

      totalPages = response.total_pages || 1;
      currentPage++;
      await delay(100);
    } while (currentPage <= totalPages);
    
    logger.info(`Total de ${serieIds.size} IDs de séries únicos encontrados para o período.`);
    return Array.from(serieIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de séries: ${error}`);
    return [];
  }
}

async function processSerieBatch(serieIds: number[], prisma: any): Promise<void> {
  for (const id of serieIds) {
    try {
      const serieDetailsResponse = await tmdbApiWithRetry(() => tmdb.tvInfo({
        id,
        append_to_response: 'credits,videos',
      }));
      const serieDetails = serieDetailsResponse as any;

      const castData = serieDetails.credits?.cast?.filter((p: Cast) => p.id && p.name) ?? [];
      const crewData = serieDetails.credits?.crew?.filter((p: Crew) => p.id && p.name && p.job) ?? [];
      
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
      
      const creators = serieDetails.created_by?.filter((p: any) => p.id && p.name) ?? [];

      await prisma.serie.upsert({
        where: { tmdbId: id },
        update: {
            name: serieDetails.name,
            posterPath: serieDetails.poster_path,
        },
        create: {
            tmdbId: id,
            name: serieDetails.name!,
            originalName: serieDetails.original_name,
            overview: serieDetails.overview,
            firstAirDate: serieDetails.first_air_date ? new Date(serieDetails.first_air_date) : null,
            lastAirDate: serieDetails.last_air_date ? new Date(serieDetails.last_air_date) : null,
            numberOfEpisodes: serieDetails.number_of_episodes,
            numberOfSeasons: serieDetails.number_of_seasons,
            status: serieDetails.status,
            homepage: serieDetails.homepage,
            posterPath: serieDetails.poster_path,
            backdropPath: serieDetails.backdrop_path,
            voteAverage: serieDetails.vote_average,
            voteCount: serieDetails.vote_count,
            popularity: serieDetails.popularity,
            // Relações
            createdBy: { create: creators.map((creator: any) => ({ pessoa: { connectOrCreate: { where: { tmdbId: creator.id! }, create: { tmdbId: creator.id!, name: creator.name, profilePath: creator.profile_path } } } })) },
            cast: { create: uniqueCast.map((ator: Cast) => ({ character: ator.character ?? 'N/A', order: ator.order, pessoa: { connectOrCreate: { where: { tmdbId: ator.id! }, create: { tmdbId: ator.id!, name: ator.name, profilePath: ator.profile_path } } } })) },
            crew: { create: uniqueCrew.map((membro: Crew) => ({ job: membro.job!, department: membro.department, pessoa: { connectOrCreate: { where: { tmdbId: membro.id! }, create: { tmdbId: membro.id!, name: membro.name, profilePath: membro.profile_path } } } })) },
            videos: { create: serieDetails.videos?.results?.map((video: any) => ({ tmdbId: video.id, key: video.key, name: video.name, site: video.site, type: video.type, official: video.official })) },
            genres: { create: serieDetails.genres?.map((genre: any) => ({ genero: { connectOrCreate: { where: { tmdbId: genre.id! }, create: { tmdbId: genre.id!, name: genre.name! } } } })) },
        },
      });
      logger.info(`✅ Série [${id}] "${serieDetails.name}" sincronizada.`);
    } catch (error) {
      logger.error(`❌ Erro ao processar a série ID ${id}. Pulando: ${error}`);
    }
  }
}

export async function syncSeries(startDate: string, endDate: string, prisma: any) {
  const allSerieIds = await fetchAllSerieIdsForPeriod(startDate, endDate);
  const batchSize = 10;

  for (let i = 0; i < allSerieIds.length; i += batchSize) {
    const batch = allSerieIds.slice(i, i + batchSize);
    logger.info(`Processando lote de séries: ${i + 1}-${Math.min(i + batchSize, allSerieIds.length)} de ${allSerieIds.length}`);
    await processSerieBatch(batch, prisma);
  }
}