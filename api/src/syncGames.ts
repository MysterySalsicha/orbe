import { igdbApi, getIgdbAccessToken } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const parseTimestamp = (timestamp: number | null) => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000);
};

// Enum mapping from IGDB integer to Prisma Enum string
const GAME_CATEGORY_MAP: { [key: number]: string } = {
  0: 'MAIN_GAME', 1: 'DLC_ADDON', 2: 'EXPANSION', 3: 'BUNDLE', 4: 'STANDALONE_EXPANSION',
  5: 'MOD', 6: 'EPISODE', 7: 'SEASON', 8: 'REMAKE', 9: 'REMASTER', 10: 'EXPANDED_GAME',
  11: 'PORT', 12: 'FORK',
};

const GAME_STATUS_MAP: { [key: number]: string } = {
  0: 'RELEASED', 2: 'ALPHA', 3: 'BETA', 4: 'EARLY_ACCESS',
  5: 'OFFLINE', 6: 'CANCELLED', 7: 'RUMORED', 8: 'DELISTED',
};

export const syncGames = async (year: number) => {
  logger.info(`Iniciando sincronização de jogos para o ano ${year}...`);
  try {
    await getIgdbAccessToken();

    const limit = 100;
    let offset = 0;
    let totalGamesSynced = 0;
    let hasMore = true;

    const initialTimestamp = Math.floor(new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(`${year + 1}-01-01T00:00:00Z`).getTime() / 1000);

    const queryFields = `
      fields
        name, slug, summary, storyline, first_release_date, category, status, rating,
        cover.*, screenshots.*, artworks.*, videos.*, genres.name, themes.name,
        player_perspectives.name, platforms.name, involved_companies.company.name,
        involved_companies.developer, involved_companies.publisher, involved_companies.supporting,
        websites.*;
      where
        first_release_date >= ${initialTimestamp} & first_release_date < ${endTimestamp} & category = (0, 8, 9);
      sort first_release_date asc;
    `;

    while (hasMore) {
      try {
        const response = await igdbApi.post('/games', `${queryFields} limit ${limit}; offset ${offset};`);
        const games = response.data;

        if (games.length === 0) {
          hasMore = false;
          break;
        }

        for (const game of games) {
          const payload = {
            name_api: game.name,
            slug_api: game.slug,
            summary_api: game.summary,
            storyline_api: game.storyline,
            first_release_date_api: parseTimestamp(game.first_release_date),
            category_api: game.category !== undefined ? GAME_CATEGORY_MAP[game.category] : null,
            status_api: game.status !== undefined ? GAME_STATUS_MAP[game.status] : null,
            avaliacao_api: game.rating,
            cover_api: game.cover,
            screenshots_api: game.screenshots,
            artworks_api: game.artworks,
            videos_api: game.videos,
            genres_api: game.genres,
            themes_api: game.themes,
            player_perspectives_api: game.player_perspectives,
            platforms_api: game.platforms,
            involved_companies_api: game.involved_companies,
            websites_api: game.websites,
          };

          await prisma.jogo.upsert({
            where: { id: game.id },
            update: payload,
            create: {
              id: game.id,
              ...payload,
              name_curado: game.name,
            },
          });
          logger.info(`  Jogo [${game.id}] "${game.name}" sincronizado.`);
        }

        totalGamesSynced += games.length;
        offset += limit;
        hasMore = games.length === limit;

        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 250)); // Rate limit
        }
      } catch (apiError: any) {
        logger.error(`Erro ao buscar jogos com offset ${offset}: ${apiError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
      }
    }

    logger.info(`Total de ${totalGamesSynced} jogos sincronizados para o ano ${year}.`);
  } catch (error: any) {
    logger.error(`Erro fatal ao sincronizar jogos de ${year}: ${error.message}`);
  }
};