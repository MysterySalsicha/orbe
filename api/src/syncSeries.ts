import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

// Helper to avoid hitting TMDB rate limits too hard.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const syncSeries = async (year: number) => {
  try {
    let totalSeriesSyncedOverall = 0;

    const discoverParams = {
      first_air_date_year: year,
      page: 1,
      'vote_count.gte': 100, // Only get series with a minimum number of votes
      sort_by: 'popularity.desc',
    };

    let hasMorePages = true;

    while (hasMorePages) {
      logger.info(`Buscando séries para ${year}, página ${discoverParams.page}...`);
      const response = await tmdbApi.get('/discover/tv', { params: discoverParams });
      const series = response.data.results;

      if (series.length === 0) {
        hasMorePages = false;
        break;
      }

      logger.info(`Encontradas ${series.length} séries. Processando detalhes...`);

      for (const serie of series) {
        try {
          // Get full series details, including aggregate_credits
          const { data: seriesDetails } = await tmdbApi.get(`/tv/${serie.id}`, {
            params: { append_to_response: 'aggregate_credits' },
          });
          await sleep(350); // Pause between each detailed fetch

          const firstAirDate = seriesDetails.first_air_date ? new Date(seriesDetails.first_air_date) : null;

          // For series, TMDB uses 'aggregate_credits' which is better
          const cast = seriesDetails.aggregate_credits.cast.slice(0, 20); // Limit to top 20 cast members
          const crew = seriesDetails.aggregate_credits.crew;
          const creators = seriesDetails.created_by.map((c: any) => c.name);

          await prisma.serie.upsert({
            where: { id: seriesDetails.id },
            update: {
              titulo_api: seriesDetails.original_name,
              titulo_curado: seriesDetails.name,
              sinopse_api: seriesDetails.overview,
              poster_url_api: seriesDetails.poster_path ? `https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}` : null,
              data_lancamento_api: firstAirDate,
              generos_api: seriesDetails.genres.map((g: any) => g.id),
              numero_temporadas: seriesDetails.number_of_seasons,
              numero_episodios: seriesDetails.number_of_episodes,
              criadores: creators,
              avaliacao_api: seriesDetails.vote_average ? seriesDetails.vote_average * 10 : null,
            },
            create: {
              id: seriesDetails.id,
              titulo_api: seriesDetails.original_name,
              titulo_curado: seriesDetails.name,
              sinopse_api: seriesDetails.overview,
              sinopse_curada: seriesDetails.overview,
              poster_url_api: seriesDetails.poster_path ? `https://image.tmdb.org/t/p/w500${seriesDetails.poster_path}` : null,
              data_lancamento_api: firstAirDate,
              data_lancamento_curada: firstAirDate,
              generos_api: seriesDetails.genres.map((g: any) => g.id),
              plataformas_api: [],
              plataformas_curadas: [],
              numero_temporadas: seriesDetails.number_of_seasons,
              numero_episodios: seriesDetails.number_of_episodes,
              criadores: creators,
              avaliacao_api: seriesDetails.vote_average ? seriesDetails.vote_average * 10 : null,
              elenco: {
                create: cast.map((person: any) => ({
                  // 'roles' is an array for series, we'll take the first one's character name
                  personagem: person.roles?.[0]?.character || 'Unknown',
                  pessoa: {
                    connectOrCreate: {
                      where: { id: person.id },
                      create: {
                        id: person.id,
                        nome: person.name,
                        foto_url: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : undefined,
                      },
                    },
                  },
                })),
              },
              equipe: {
                // 'jobs' is an array for series, we need to flatten it
                create: crew.flatMap((person: any) =>
                    person.jobs.map((job: any) => ({
                        funcao: job.job,
                        pessoa: {
                            connectOrCreate: {
                                where: { id: person.id },
                                create: {
                                    id: person.id,
                                    nome: person.name,
                                    foto_url: person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : undefined,
                                },
                            },
                        },
                    }))
                ),
              },
            },
          });
          logger.info(`  - Sincronizada: ${seriesDetails.name}`);
          totalSeriesSyncedOverall++;
        } catch (detailError: any) {
            logger.error(`Erro ao processar detalhes da série ID ${serie.id}: ${detailError.message}`);
        }
      }

      discoverParams.page++;
      if (response.data.total_pages && discoverParams.page > response.data.total_pages) {
        hasMorePages = false;
      }
    }
    logger.info(`Total de ${totalSeriesSyncedOverall} séries sincronizadas para o ano ${year}.`);
  } catch (error: any) {
    logger.error(`Erro ao sincronizar séries para o ano ${year}: ${error.message || error}`);
  }
};