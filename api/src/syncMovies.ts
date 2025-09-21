import { tmdbApi } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

// Helper to avoid hitting TMDB rate limits too hard.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const syncMovies = async (year: number) => {
  try {
    let totalMoviesSyncedOverall = 0;

    // We can discover more movies per page, but process them with delays.
    const discoverParams = {
      primary_release_year: year,
      page: 1,
      'vote_count.gte': 100, // Only get movies with a minimum number of votes to filter out noise
      sort_by: 'popularity.desc',
    };

    let hasMorePages = true;

    while (hasMorePages) {
      logger.info(`Buscando filmes para ${year}, página ${discoverParams.page}...`);
      const response = await tmdbApi.get('/discover/movie', { params: discoverParams });
      const movies = response.data.results;

      if (movies.length === 0) {
        hasMorePages = false;
        break;
      }

      logger.info(`Encontrados ${movies.length} filmes. Processando detalhes...`);

      for (const movie of movies) {
        try {
          // Get full movie details, including credits
          const { data: movieDetails } = await tmdbApi.get(`/movie/${movie.id}`, {
            params: { append_to_response: 'credits' },
          });
          await sleep(350); // Pause between each detailed fetch

          const releaseDate = movieDetails.release_date ? new Date(movieDetails.release_date) : null;

          // Filter crew to get unique individuals, as one person can have multiple roles.
          // We use connectOrCreate for Pessoa, so the person is created only once.
          // The relation table EquipeEmFilme has a composite key that includes the 'funcao' (job),
          // so multiple roles for the same person are stored correctly.
          const cast = movieDetails.credits.cast.slice(0, 20); // Limit to top 20 cast members
          const crew = movieDetails.credits.crew;

          await prisma.filme.upsert({
            where: { id: movieDetails.id },
            update: {
              titulo_api: movieDetails.original_title,
              titulo_curado: movieDetails.title,
              sinopse_api: movieDetails.overview,
              poster_url_api: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
              data_lancamento_api: releaseDate,
              generos_api: movieDetails.genres.map((g: any) => g.id),
              duracao: movieDetails.runtime,
              avaliacao_api: movieDetails.vote_average ? movieDetails.vote_average * 10 : null,
            },
            create: {
              id: movieDetails.id,
              titulo_api: movieDetails.original_title,
              titulo_curado: movieDetails.title,
              sinopse_api: movieDetails.overview,
              sinopse_curada: movieDetails.overview,
              poster_url_api: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
              data_lancamento_api: releaseDate,
              data_lancamento_curada: releaseDate,
              generos_api: movieDetails.genres.map((g: any) => g.id),
              plataformas_api: [],
              plataformas_curadas: [],
              duracao: movieDetails.runtime,
              avaliacao_api: movieDetails.vote_average ? movieDetails.vote_average * 10 : null,
              elenco: {
                create: cast.map((person: any) => ({
                  personagem: person.character,
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
                create: crew.map((person: any) => ({
                  funcao: person.job,
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
            },
          });
          logger.info(`  - Sincronizado: ${movieDetails.title}`);
          totalMoviesSyncedOverall++;
        } catch (detailError: any) {
            logger.error(`Erro ao processar detalhes do filme ID ${movie.id}: ${detailError.message}`);
        }
      }

      discoverParams.page++;
      if (response.data.total_pages && discoverParams.page > response.data.total_pages) {
        hasMorePages = false;
      }
    }
    logger.info(`Total de ${totalMoviesSyncedOverall} filmes sincronizados para o ano ${year}.`);
  } catch (error: any) {
    logger.error(`Erro ao sincronizar filmes para o ano ${year}: ${error.message || error}`);
  }
};