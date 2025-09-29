import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { logger } from './logger';
import { tmdb, tmdbApi } from './clients';
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

async function fetchSeriesIdsForPeriod(startDate: string, endDate: string): Promise<number[]> {
  logger.info(`Buscando IDs de séries com primeira exibição entre ${startDate} e ${endDate}...`);
  const seriesIds = new Set<number>();
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await tmdbApi.get('/discover/tv', {
        params: {
          'first_air_date.gte': startDate,
          'first_air_date.lte': endDate,
          page,
          region: 'BR',
          sort_by: 'first_air_date.asc',
        },
      });

      if (response.data.results) {
        for (const serie of response.data.results) {
          if (serie.id && !serie.adult) {
            seriesIds.add(serie.id);
          }
        }
      }

      totalPages = response.data.total_pages || 1;
      if (totalPages > 500) totalPages = 500; // Respect TMDB's 500 page limit

      page++;
      await delay(250);
    } while (page <= totalPages);
    
    logger.info(`Total de ${seriesIds.size} IDs de séries encontrados para o período.`);
    return Array.from(seriesIds);
  } catch (error) {
    logger.error(`Erro ao buscar IDs de séries para o período: ${error}`);
    return [];
  }
}

async function processSerieBatch(serieIds: number[], prisma: any): Promise<void> {
  for (const id of serieIds) {
    try {
      const serieDetails = await tmdbApiWithRetry(() => tmdb.tvInfo({
        id,
        language: 'pt-BR',
        append_to_response: 'credits,videos,watch/providers,release_dates',
      })) as any;

      const brProviders = serieDetails['watch/providers']?.results?.BR;
      if (!brProviders) {
        logger.info(`Série ID ${id} "${serieDetails.name}" não possui provedores de streaming no Brasil. Pulando.`);
        continue;
      }

      const firstAirDate: Date | null = serieDetails.first_air_date ? new Date(serieDetails.first_air_date) : null;
      if (!firstAirDate) {
        logger.info(`Série ID ${id} "${serieDetails.name}" não possui data de primeira exibição. Pulando.`);
        continue;
      }

      const scalarData = {
        tmdbId: serieDetails.id,
        name: serieDetails.name!,
        originalName: serieDetails.original_name,
        overview: serieDetails.overview,
        firstAirDate: firstAirDate,
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

      const relationalData = {
        genres: {
          create: serieDetails.genres?.map((genre: any) => ({ genero: { connectOrCreate: { where: { tmdbId: genre.id }, create: { tmdbId: genre.id, name: genre.name } } } }))
        },
        networks: {
          create: serieDetails.networks?.map((network: any) => ({ network: { connectOrCreate: { where: { tmdbId: network.id }, create: { tmdbId: network.id, name: network.name, logoPath: network.logo_path } } } }))
        },
        languages: {
            create: serieDetails.spoken_languages?.map((lang: any) => ({ language: { connectOrCreate: { where: { iso: lang.iso_639_1 }, create: { iso: lang.iso_639_1, name: lang.english_name } } } }))
        },
        seasons: {
          create: serieDetails.seasons?.map((season: any) => ({
            tmdbId: season.id,
            name: season.name,
            overview: season.overview,
            airDate: season.air_date ? new Date(season.air_date) : null,
            episodeCount: season.episode_count,
            seasonNumber: season.season_number,
            posterPath: season.poster_path,
          }))
        },
        createdBy: {
            create: serieDetails.created_by?.map((creator: any) => ({ pessoa: { connectOrCreate: { where: { tmdbId: creator.id }, create: { tmdbId: creator.id, name: creator.name, profilePath: creator.profile_path } } } }))
        },
        cast: {
          create: serieDetails.credits?.cast?.slice(0, 20).map((person: any) => ({ character: person.character, order: person.order, pessoa: { connectOrCreate: { where: { tmdbId: person.id }, create: { tmdbId: person.id, name: person.name, profilePath: person.profile_path } } } }))
        },
        crew: {
          create: serieDetails.credits?.crew?.filter((p: any) => ['Creator', 'Director', 'Screenplay', 'Writer'].includes(p.job || '')).map((person: any) => ({ job: person.job, department: person.department, pessoa: { connectOrCreate: { where: { tmdbId: person.id }, create: { tmdbId: person.id, name: person.name, profilePath: person.profile_path } } } }))
        },
        videos: {
            create: serieDetails.videos?.results?.filter((v: any) => v.site === 'YouTube').map((video: any) => ({ tmdbId: video.id, key: video.key, name: video.name, site: video.site, type: video.type, official: video.official }))
        },
        streamingProviders: {
            create: brProviders.flatrate?.map((provider: any) => ({
                provider: { connectOrCreate: { where: { tmdbId: provider.provider_id }, create: { tmdbId: provider.provider_id, name: provider.provider_name, logoPath: provider.logo_path } } }
            }))
        }
      };

      await prisma.serie.upsert({
        where: { tmdbId: id },
        update: scalarData,
        create: { ...scalarData, ...relationalData },
      });

      logger.info(`✅ Série [${id}] "${serieDetails.name}" sincronizada.`);

    } catch (error) {
      logger.error(`❌ Erro ao processar a série ID ${id}. Pulando: ${error}`);
    }
  }
}

export async function syncSeries(prisma: PrismaClient, startDate: string, endDate: string, limit?: number) {
  let currentStartDate = new Date(startDate);
  const finalEndDate = new Date(endDate);

  logger.info(`Iniciando busca e sincronização de séries por mês, de ${startDate} a ${endDate}.`);

  if (limit) {
    logger.warn(`O parâmetro limit (${limit}) será aplicado para cada mês, não para o total.`);
  }

  while (currentStartDate <= finalEndDate) {
    const currentEndDate = new Date(currentStartDate);
    currentEndDate.setMonth(currentEndDate.getMonth() + 1);
    currentEndDate.setDate(0);

    const startStr = currentStartDate.toISOString().split('T')[0];
    const endStr = (currentEndDate > finalEndDate ? finalEndDate : currentEndDate).toISOString().split('T')[0];
    
    let monthlyIds = await fetchSeriesIdsForPeriod(startStr, endStr);
    
    if (monthlyIds.length > 0) {
        if (limit) {
            monthlyIds = monthlyIds.slice(0, limit);
            logger.info(`Limitando a sincronização deste mês a ${limit} itens.`);
        }

        const batchSize = 10;
        for (let i = 0; i < monthlyIds.length; i += batchSize) {
            const batch = monthlyIds.slice(i, i + batchSize);
            logger.info(`Processando lote de séries do período ${startStr} a ${endStr}: ${i + 1}-${Math.min(i + batchSize, monthlyIds.length)} de ${monthlyIds.length}`);
            await processSerieBatch(batch, prisma);
        }
    }

    currentStartDate.setMonth(currentStartDate.getMonth() + 1);
    currentStartDate.setDate(1);
  }
  
  logger.info(`Sincronização de séries concluída para o período de ${startDate} a ${endDate}.`);
}

const main = async () => {
  const prisma = new PrismaClient();
  const startDate = process.argv[2];
  const endDate = process.argv[3];
  const limit = process.argv[4] ? parseInt(process.argv[4]) : undefined;

  if (!startDate || !endDate) {
    console.error('Uso: ts-node src/syncSeries.ts <startDate> <endDate> [limit]');
    process.exit(1);
  }

  try {
    await syncSeries(prisma, startDate, endDate, limit);
  } catch (error) {
    logger.error(`Erro fatal na sincronização de séries: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

if (require.main === module) {
  main();
}