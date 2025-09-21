import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const parseDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date);
};

export const syncMovies = async (year: number) => {
  logger.info(`Iniciando sincronização de filmes para o ano ${year}...`);
  let totalMoviesSyncedOverall = 0;

  for (let month = 1; month <= 12; month++) {
    let page = 1;
    let totalMoviesSyncedThisMonth = 0;
    let hasMorePages = true;

    logger.info(`Buscando filmes para ${month}/${year}...`);

    while (hasMorePages) {
      try {
        const discoverResponse = await tmdbApi.get('/discover/movie', {
          params: {
            primary_release_year: year,
            'primary_release_date.gte': `${year}-${String(month).padStart(2, '0')}-01`,
            'primary_release_date.lte': `${year}-${String(month).padStart(2, '0')}-31`,
            page: page,
          },
        });

        const moviesToSync = discoverResponse.data.results;

        if (moviesToSync.length === 0) {
          hasMorePages = false;
          break;
        }

        for (const basicMovie of moviesToSync) {
          try {
            // Get detailed info for each movie
            const detailedResponse = await tmdbApi.get(`/movie/${basicMovie.id}`, {
              params: {
                append_to_response: 'credits,videos,watch/providers',
              },
            });
            const movie = detailedResponse.data;

            const payload = {
              title_api: movie.title,
              original_title_api: movie.original_title,
              overview_api: movie.overview,
              poster_path_api: movie.poster_path,
              backdrop_path_api: movie.backdrop_path,
              release_date_api: parseDate(movie.release_date),
              status_api: movie.status,
              runtime_api: movie.runtime,
              avaliacao_api: movie.vote_average ? movie.vote_average * 10 : null,
              vote_count_api: movie.vote_count,
              popularity_api: movie.popularity,
              genres_api: movie.genres,
              spoken_languages_api: movie.spoken_languages,
              production_countries_api: movie.production_countries,
              production_companies_api: movie.production_companies,
              videos_api: movie.videos?.results,
              watch_providers_api: movie['watch/providers']?.results,
              cast_api: movie.credits?.cast,
              crew_api: movie.credits?.crew,
            };

            await prisma.filme.upsert({
              where: { id: movie.id },
              update: payload,
              create: {
                id: movie.id,
                ...payload,
              },
            });
            logger.info(`  Filme [${movie.id}] "${movie.title}" sincronizado.`);
            totalMoviesSyncedThisMonth++;
          } catch (detailError: any) {
            logger.error(`  Erro ao buscar detalhes para o filme ID ${basicMovie.id}: ${detailError.message}`);
          }
           await new Promise(resolve => setTimeout(resolve, 250)); // Rate limit between detail calls
        }

        page++;
        if (page > discoverResponse.data.total_pages) {
          hasMorePages = false;
        }
      } catch (discoverError: any) {
        logger.error(`Erro ao buscar página ${page} de filmes: ${discoverError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
      }
    }

    if (totalMoviesSyncedThisMonth > 0) {
        logger.info(`${totalMoviesSyncedThisMonth} filmes de ${month}/${year} sincronizados com sucesso.`);
        totalMoviesSyncedOverall += totalMoviesSyncedThisMonth;
    } else {
        logger.info(`Nenhum filme novo encontrado para ${month}/${year}.`);
    }
  }
  logger.info(`Total de ${totalMoviesSyncedOverall} filmes sincronizados para o ano ${year}.`);
};