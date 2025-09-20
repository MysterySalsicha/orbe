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

    while (hasMore) {
      const response = await igdbApi.post(
        '/games',
        `fields name, summary, cover.url, first_release_date, rating, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; where first_release_date >= ${new Date(`${year}-01-01`).getTime() / 1000} & first_release_date < ${new Date(`${year + 1}-01-01`).getTime() / 1000}; sort first_release_date asc; limit ${limit}; offset ${offset};`
      );

      const games = response.data;

      if (games.length === 0) {
        hasMore = false;
        break;
      }

      for (const game of games) {
        const releaseDate = game.first_release_date ? new Date(game.first_release_date * 1000) : null;
        const developers = game.involved_companies ? game.involved_companies.filter((c: any) => c.developer).map((c: any) => c.company.name) : [];
        const publishers = game.involved_companies ? game.involved_companies.filter((c: any) => c.publisher).map((c: any) => c.company.name) : [];
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
            desenvolvedores: developers,
            publicadoras: publishers,
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
            desenvolvedores: developers,
            publicadoras: publishers,
            avaliacao_api: game.rating,
          },
        });
      }
      totalGamesSynced += games.length;
      logger.info(`  Página com offset ${offset}: ${games.length} jogos sincronizados. Datas: ${games.map((g: any) => g.first_release_date ? new Date(g.first_release_date * 1000).toISOString().split('T')[0] : 'N/A').join(', ')}`);

      offset += limit;
      hasMore = games.length === limit;

      if (hasMore) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (totalGamesSynced > 0) {
      logger.info(`${totalGamesSynced} jogos de ${year} sincronizados com sucesso.`);
    } else {
      logger.info(`Nenhum jogo encontrado para ${year}.`);
    }
  } catch (error: any) {
    logger.error(`Erro ao sincronizar jogos de ${year}: ${error.message || error}`);
  }
};