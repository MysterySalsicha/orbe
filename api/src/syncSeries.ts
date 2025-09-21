import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const parseDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date);
};

export const syncSeries = async (year: number) => {
  logger.info(`Iniciando sincronização de séries para o ano ${year}...`);
  let totalSeriesSyncedOverall = 0;

  for (let month = 1; month <= 12; month++) {
    let page = 1;
    let totalSeriesSyncedThisMonth = 0;
    let hasMorePages = true;

    logger.info(`Buscando séries para ${month}/${year}...`);

    while (hasMorePages) {
      try {
        const discoverResponse = await tmdbApi.get('/discover/tv', {
          params: {
            first_air_date_year: year,
            'first_air_date.gte': `${year}-${String(month).padStart(2, '0')}-01`,
            'first_air_date.lte': `${year}-${String(month).padStart(2, '0')}-31`,
            page: page,
          },
        });

        const seriesToSync = discoverResponse.data.results;

        if (seriesToSync.length === 0) {
          hasMorePages = false;
          break;
        }

        for (const basicSerie of seriesToSync) {
          try {
            // Get detailed info for each series
            const detailedResponse = await tmdbApi.get(`/tv/${basicSerie.id}`, {
              params: {
                append_to_response: 'credits,videos,watch/providers',
              },
            });
            const serie = detailedResponse.data;

            const payload = {
              name_api: serie.name,
              original_name_api: serie.original_name,
              overview_api: serie.overview,
              poster_path_api: serie.poster_path,
              backdrop_path_api: serie.backdrop_path,
              first_air_date_api: parseDate(serie.first_air_date),
              last_air_date_api: parseDate(serie.last_air_date),
              number_of_seasons_api: serie.number_of_seasons,
              number_of_episodes_api: serie.number_of_episodes,
              episode_run_time_api: serie.episode_run_time,
              avaliacao_api: serie.vote_average ? serie.vote_average * 10 : null,
              vote_count_api: serie.vote_count,
              popularity_api: serie.popularity,
              genres_api: serie.genres,
              created_by_api: serie.created_by,
              networks_api: serie.networks,
              seasons_api: serie.seasons,
              videos_api: serie.videos?.results,
              watch_providers_api: serie['watch/providers']?.results,
              cast_api: serie.credits?.cast,
              crew_api: serie.credits?.crew,
            };

            await prisma.serie.upsert({
              where: { id: serie.id },
              update: payload,
              create: {
                id: serie.id,
                ...payload,
              },
            });
            logger.info(`  Série [${serie.id}] "${serie.name}" sincronizada.`);
            totalSeriesSyncedThisMonth++;
          } catch (detailError: any) {
            logger.error(`  Erro ao buscar detalhes para a série ID ${basicSerie.id}: ${detailError.message}`);
          }
           await new Promise(resolve => setTimeout(resolve, 250)); // Rate limit between detail calls
        }

        page++;
        if (page > discoverResponse.data.total_pages) {
          hasMorePages = false;
        }
      } catch (discoverError: any) {
        logger.error(`Erro ao buscar página ${page} de séries: ${discoverError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
      }
    }

    if (totalSeriesSyncedThisMonth > 0) {
        logger.info(`${totalSeriesSyncedThisMonth} séries de ${month}/${year} sincronizadas com sucesso.`);
        totalSeriesSyncedOverall += totalSeriesSyncedThisMonth;
    } else {
        logger.info(`Nenhuma série nova encontrada para ${month}/${year}.`);
    }
  }
  logger.info(`Total de ${totalSeriesSyncedOverall} séries sincronizadas para o ano ${year}.`);
};