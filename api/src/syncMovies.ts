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
          const releaseDate = movie.release_date ? new Date(movie.release_date) : null;

          await prisma.filme.upsert({
            where: { id: movie.id },
            update: {
              titulo_api: movie.original_title,
              titulo_curado: movie.title,
              sinopse_api: movie.overview,
              poster_url_api: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              data_lancamento_api: releaseDate,
              generos_api: movie.genre_ids,
              avaliacao_api: movie.vote_average ? movie.vote_average * 10 : null,
            },
            create: {
              id: movie.id,
              titulo_api: movie.original_title,
              titulo_curado: movie.title,
              sinopse_api: movie.overview,
              sinopse_curada: movie.overview,
              poster_url_api: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              data_lancamento_api: releaseDate,
              data_lancamento_curada: releaseDate,
              generos_api: movie.genre_ids,
              plataformas_api: [],
              plataformas_curadas: [],
              avaliacao_api: movie.vote_average ? movie.vote_average * 10 : null,
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