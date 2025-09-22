import { igdbApi, getIgdbAccessToken } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

export const syncGames = async (year: number) => {
  try {
    await getIgdbAccessToken();

    const limit = 50;
    let offset = 0;
    let totalGamesSynced = 0;
    let hasMore = true;

    // Define the fields for the IGDB query
    const fields = [
      'name',
      'summary',
      'cover.url',
      'first_release_date',
      'rating',
      'genres.name',
      'involved_companies.company.id',
      'involved_companies.company.name',
      'involved_companies.company.logo.url',
      'involved_companies.developer',
      'involved_companies.publisher',
    ].join(',');

    const baseQuery = `fields ${fields}; where first_release_date >= ${new Date(`${year}-01-01`).getTime() / 1000} & first_release_date < ${new Date(`${year + 1}-01-01`).getTime() / 1000}; sort popularity desc;`;

    while (hasMore) {
      const query = `${baseQuery} limit ${limit}; offset ${offset};`;
      const response = await igdbApi.post('/games', query);
      const games = response.data;

      if (games.length === 0) {
        hasMore = false;
        break;
      }

      for (const game of games) {
        if (!game.involved_companies) {
            logger.warn(`Jogo ID ${game.id} (${game.name}) não possui empresas associadas. Pulando.`);
            continue;
        }

        const releaseDate = game.first_release_date ? new Date(game.first_release_date * 1000) : null;
        const genres = game.genres ? game.genres.map((g: any) => g.name) : [];

        await prisma.jogo.upsert({
          where: { id: game.id },
          update: {
            titulo_api: game.name,
            titulo_curado: game.name,
            sinopse_api: game.summary,
            poster_url_api: game.cover ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
            data_lancamento_api: releaseDate,
            generos_api: genres,
            avaliacao_api: game.rating,
          },
          create: {
            id: game.id,
            titulo_api: game.name,
            titulo_curado: game.name,
            sinopse_api: game.summary,
            sinopse_curada: game.summary,
            poster_url_api: game.cover ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null,
            data_lancamento_api: releaseDate,
            data_lancamento_curada: releaseDate,
            generos_api: genres,
            generos_curados: [],
            plataformas_api: [],
            plataformas_curadas: [],
            avaliacao_api: game.rating,
            empresas: {
              create: game.involved_companies.flatMap((comp: any) => {
                const relations = [];
                const company = comp.company;
                if (!company) return []; // Skip if company data is missing

                const createPayload = {
                  id: company.id,
                  nome: company.name,
                  logo_url: comp.company.logo ? `https:${comp.company.logo.url.replace('t_thumb', 't_logo_med')}` : null,
                };

                if (comp.developer) {
                  relations.push({
                    funcao: 'Developer',
                    empresa: {
                      connectOrCreate: {
                        where: { id: company.id },
                        create: createPayload,
                      },
                    },
                  });
                }
                if (comp.publisher) {
                  relations.push({
                    funcao: 'Publisher',
                    empresa: {
                      connectOrCreate: {
                        where: { id: company.id },
                        create: createPayload,
                      },
                    },
                  });
                }
                return relations;
              }),
            },
          },
        });
      }
      totalGamesSynced += games.length;
      logger.info(`  Página com offset ${offset}: ${games.length} jogos sincronizados.`);

      offset += limit;
      hasMore = games.length === limit;

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 250)); // IGDB is less strict with rate limits
      }
    }

    if (totalGamesSynced > 0) {
      logger.info(`${totalGamesSynced} jogos de ${year} sincronizados com sucesso.`);
    } else {
      logger.info(`Nenhum jogo encontrado para ${year}.`);
    }
  } catch (error: any) {
    const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
    logger.error(`Erro ao sincronizar jogos de ${year}: ${errorMessage}`);
    if (!error.response) {
      console.error(error);
    }
  }
};