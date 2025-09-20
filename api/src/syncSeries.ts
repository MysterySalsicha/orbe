import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

export const syncSeries = async (year: number) => {
  try {
    let totalSeriesSyncedOverall = 0;
    for (let month = 1; month <= 12; month++) {
      let page = 1;
      let totalSeriesSyncedThisMonth = 0;
      let hasMorePages = true;

      logger.info(`Iniciando sincronização de séries para ${month}/${year}...`);

      while (hasMorePages) {
        const response = await tmdbApi.get('/discover/tv', {
          params: {
            first_air_date_year: year,
            'first_air_date.gte': `${year}-${String(month).padStart(2, '0')}-01`,
            'first_air_date.lte': `${year}-${String(month).padStart(2, '0')}-31`,
            page: page,
            per_page: 100,
          },
        });

        const series = response.data.results;

        if (series.length === 0) {
          hasMorePages = false;
          break;
        }

        for (const serie of series) {
          await prisma.serie.upsert({
            where: { id: serie.id },
            update: {
              titulo_curado: serie.name,
              titulo_api: serie.original_name,
              sinopse: serie.overview,
              poster_url_api: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null,
              data_lancamento_api: serie.first_air_date,
              avaliacao: serie.vote_average,
              generos: serie.genre_ids.map(String),
            },
            create: {
              id: serie.id,
              titulo_curado: serie.name,
              titulo_api: serie.original_name,
              sinopse: serie.overview,
              poster_url_api: serie.poster_path ? `https://image.tmdb.org/t/p/w500${serie.poster_path}` : null,
              data_lancamento_api: serie.first_air_date,
              avaliacao: serie.vote_average,
              generos: serie.genre_ids.map(String),
              plataformas_curadas: [],
            },
          });
        }
        totalSeriesSyncedThisMonth += series.length;
        logger.info(`  Página ${page}/${response.data.total_pages}: ${series.length} séries sincronizadas. Datas: ${series.map((s: any) => s.first_air_date).join(', ')}`);

        page++;
        if (response.data.total_pages && page > response.data.total_pages) {
          hasMorePages = false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre as páginas
      }

      if (totalSeriesSyncedThisMonth > 0) {
        logger.info(`${totalSeriesSyncedThisMonth} séries de ${month}/${year} sincronizadas com sucesso.`);
        totalSeriesSyncedOverall += totalSeriesSyncedThisMonth;
      } else {
        logger.info(`Nenhuma série encontrada para ${month}/${year}.`);
      }
    }
    logger.info(`Total de ${totalSeriesSyncedOverall} séries sincronizadas para o ano ${year}.`);
  } catch (error: any) {
    logger.error(`Erro ao sincronizar séries para o ano ${year}: ${error.message || error}`);
  }
};