import { logger } from './logger';
import { tmdb, tmdbApi } from './clients';
import { Cast, Crew } from 'moviedb-promise';
import { broadcast } from './index';
import { Prisma } from '@prisma/client';

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

async function fetchChangedTvIds(startDate: string): Promise<number[]> {
  logger.info(`Buscando IDs de séries alteradas desde ${startDate}...`);
  const serieIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApi.get('/tv/changes', {
        params: { start_date: startDate, page },
      });

      if (response.data.results) {
        for (const serie of response.data.results) {
          if (serie.id && !serie.adult) {
            serieIds.add(serie.id);
          }
        }
      }

      totalPages = response.data.total_pages || 1;
      page++;
      await delay(250);
    } while (page <= totalPages);
    
    logger.info(`Total de ${serieIds.size} IDs de séries alteradas encontrados.`);
    return Array.from(serieIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de séries alteradas: ${error}`);
    return [];
  }
}

async function processSerieBatch(serieIds: number[], prisma: any): Promise<void> {
  for (const id of serieIds) {
    try {
      const serieDetails = await tmdbApiWithRetry(() => tmdb.tvInfo({
        id,
        language: 'pt-BR',
        append_to_response: 'credits,videos,watch/providers',
      })) as any;

      const existingSerie = await prisma.serie.findUnique({ where: { tmdbId: id } });

      const data: Prisma.SerieCreateInput = {
        tmdbId: serieDetails.id,
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
        type: serieDetails.type,
        inProduction: serieDetails.in_production,
        tagline: serieDetails.tagline,
      };

      if (existingSerie) {
        const updatedSerie = await prisma.serie.update({
          where: { tmdbId: id },
          data,
        });
        logger.info(`🔄 Série [${id}] "${updatedSerie.name}" atualizada.`);
        broadcast({ type: 'UPDATED_ITEM', mediaType: 'serie', data: updatedSerie });
      } else {
        const newSerie = await prisma.serie.create({ data });
        logger.info(`✅ Série [${id}] "${newSerie.name}" criada.`);
        broadcast({ type: 'NEW_ITEM', mediaType: 'serie', data: newSerie });
      }

    } catch (error) {
      logger.error(`❌ Erro ao processar a série ID ${id}. Pulando: ${error}`);
    }
  }
}

export async function syncSeries() {
  const prisma = new PrismaClient();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const startDate = threeDaysAgo.toISOString().split('T')[0];

  const changedSerieIds = await fetchChangedTvIds(startDate);
  const batchSize = 10;

  if (changedSerieIds.length === 0) {
    logger.info('Nenhuma série para atualizar.');
    return;
  }

  for (let i = 0; i < changedSerieIds.length; i += batchSize) {
    const batch = changedSerieIds.slice(i, i + batchSize);
    logger.info(`Processando lote de séries: ${i + 1}-${Math.min(i + batchSize, changedSerieIds.length)} de ${changedSerieIds.length}`);
    await processSerieBatch(batch, prisma);
  }
}