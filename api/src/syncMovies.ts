import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

export const syncMovies = async (year: number) => {
  try {
    let totalMoviesSyncedOverall = 0;
    for (let month = 1; month <= 12; month++) {
      let page = 1;
      let totalMoviesSyncedThisMonth = 0;
      let hasMorePages = true;

      logger.info(`Iniciando sincronização de filmes para ${month}/${year}...`);

      while (hasMorePages) {
        const response = await tmdbApi.get('/discover/movie', {
          params: {
            primary_release_year: year,
            'primary_release_date.gte': `${year}-${String(month).padStart(2, '0')}-01`,
            'primary_release_date.lte': `${year}-${String(month).padStart(2, '0')}-31`,
            page: page,
            per_page: 100,
          },
        });

        const movies = response.data.results;

        if (movies.length === 0) {
          hasMorePages = false;
          break;
        }

        for (const movie of movies) {
          await prisma.filme.upsert({
            where: { id: movie.id },
            update: {
              titulo_curado: movie.title,
              titulo_api: movie.original_title,
              sinopse: movie.overview,
              poster_url_api: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              data_lancamento_api: movie.release_date,
              avaliacao: movie.vote_average,
              generos: movie.genre_ids.map(String),
            },
            create: {
              id: movie.id,
              titulo_curado: movie.title,
              titulo_api: movie.original_title,
              sinopse: movie.overview,
              poster_url_api: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              data_lancamento_api: movie.release_date,
              avaliacao: movie.vote_average,
              generos: movie.genre_ids.map(String),
              plataformas_curadas: [],
            },
          });
        }
        totalMoviesSyncedThisMonth += movies.length;
        logger.info(`  Página ${page}/${response.data.total_pages}: ${movies.length} filmes sincronizados. Datas: ${movies.map((m: any) => m.release_date).join(', ')}`);

        page++;
        if (response.data.total_pages && page > response.data.total_pages) {
          hasMorePages = false;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre as páginas
      }

      if (totalMoviesSyncedThisMonth > 0) {
        logger.info(`${totalMoviesSyncedThisMonth} filmes de ${month}/${year} sincronizados com sucesso.`);
        totalMoviesSyncedOverall += totalMoviesSyncedThisMonth;
      } else {
        logger.info(`Nenhum filme encontrado para ${month}/${year}.`);
      }
    }
    logger.info(`Total de ${totalMoviesSyncedOverall} filmes sincronizados para o ano ${year}.`);
  } catch (error: any) {
    logger.error(`Erro ao sincronizar filmes para o ano ${year}: ${error.message || error}`);
  }
};