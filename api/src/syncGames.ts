process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { igdbApi, getIgdbAccessToken } from './clients';
import { logger } from './logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function igdbApiWithRetry<T>(fn: () => Promise<T>, maxRetries = 5, initialDelay = 1000): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await fn();
        } catch (error: any) {
            const isNetworkError = error.code === 'ENOTFOUND' || error.code === 'ECONNRESET';
            const isRateLimitError = error.response && error.response.status === 429;
            if (isNetworkError || isRateLimitError) {
                attempt++;
                if (attempt >= maxRetries) {
                    throw error;
                }
                const delayTime = initialDelay * Math.pow(2, attempt);
                logger.info(`Tentativa ${attempt} falhou com erro ${isRateLimitError ? '429' : 'de rede'}. Tentando novamente em ${delayTime}ms...`);
                await delay(delayTime);
            } else {
                throw error;
            }
        }
    }
    throw new Error("Número máximo de tentativas atingido");
}

async function fetchAllGameIdsForPeriod(startDateStr: string, endDateStr: string): Promise<number[]> {
    logger.info(`Buscando todos os IDs de jogos para o período de ${startDateStr} a ${endDateStr}...`);
    const gameIds = new Set<number>();
    const limit = 500; // Max limit for IGDB
    let offset = 0;
    let hasMore = true;

    const startDate = Math.floor(new Date(startDateStr).getTime() / 1000);
    const endDate = Math.floor(new Date(endDateStr).getTime() / 1000);

    try {
        while (hasMore) {
            const response = await igdbApiWithRetry(() => igdbApi.post(
                '/games',
                `fields id; where first_release_date >= ${startDate} & first_release_date <= ${endDate}; limit ${limit}; offset ${offset}; sort id asc;`
            ));

            const games = response.data;

            if (games && games.length > 0) {
                for (const game of games) {
                    if (game.id) {
                        gameIds.add(game.id);
                    }
                }
                offset += games.length;
                hasMore = games.length === limit;
            } else {
                hasMore = false;
            }
            await delay(250); // Respect IGDB rate limit (4 req/sec)
        }
        logger.info(`Total de ${gameIds.size} IDs de jogos únicos encontrados para o período.`);
        return Array.from(gameIds);
    } catch (error: any) {
        logger.error(`Erro ao buscar IDs de jogos: ${error.message || error}`);
        return [];
    }
}

async function processGameBatch(gameIds: number[]): Promise<void> {
    if (gameIds.length === 0) return;

    const query = `
        fields name, summary, cover.url, first_release_date, rating, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, platforms.name, themes.name, player_perspectives.name, screenshots.url, artworks.url, websites.url, websites.category;
        where id = (${gameIds.join(',')});
        limit ${gameIds.length};
    `;

    try {
        const response = await igdbApiWithRetry(() => igdbApi.post('/games', query));
        const games = response.data;

        for (const game of games) {
            try {
                const releaseDate = game.first_release_date ? new Date(game.first_release_date * 1000) : null;
                const coverUrl = game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null;

                await prisma.jogo.upsert({
                    where: { igdbId: game.id },
                    update: {
                        name: game.name,
                        cover: coverUrl,
                        rating: game.rating,
                    },
                    create: {
                        igdbId: game.id,
                        name: game.name,
                        summary: game.summary,
                        cover: coverUrl,
                        firstReleaseDate: releaseDate,
                        rating: game.rating,
                        genres: {
                            create: game.genres?.map((genre: any) => ({
                                genero: { connectOrCreate: { where: { name: genre.name }, create: { name: genre.name } } }
                            })) ?? []
                        },
                        companies: {
                            create: game.involved_companies?.map((inv: any) => ({
                                developer: inv.developer,
                                publisher: inv.publisher,
                                company: {
                                    connectOrCreate: {
                                        where: { name: inv.company.name },
                                        create: { name: inv.company.name }
                                    }
                                }
                            })) ?? []
                        },
                        platforms: {
                            create: game.platforms?.map((platform: any) => ({
                                plataforma: { connectOrCreate: { where: { name: platform.name }, create: { name: platform.name } } }
                            })) ?? []
                        },
                        themes: {
                            create: game.themes?.map((theme: any) => ({
                                theme: { connectOrCreate: { where: { name: theme.name }, create: { name: theme.name } } }
                            })) ?? []
                        },
                        playerPerspectives: {
                            create: game.player_perspectives?.map((persp: any) => ({
                                perspective: { connectOrCreate: { where: { name: persp.name }, create: { name: persp.name } } }
                            })) ?? []
                        },
                        screenshots: {
                            create: game.screenshots?.map((ss: any) => ({ url: `https:${ss.url.replace('t_thumb', 't_screenshot_huge')}` })) ?? []
                        },
                        artworks: {
                            create: game.artworks?.map((art: any) => ({ url: `https:${art.url.replace('t_thumb', 't_1080p')}` })) ?? []
                        },
                        websites: {
                            create: game.websites?.map((web: any) => ({ url: web.url, category: web.category })) ?? []
                        }
                    }
                });
                logger.info(`✅ Jogo [${game.id}] "${game.name}" sincronizado.`);
            } catch (error) {
                logger.error(`❌ Erro ao processar o jogo ID ${game.id}. Pulando: ${error}`);
            }
        }
    } catch (error: any) {
        logger.error(`❌ Erro ao processar o lote de jogos IDs ${gameIds.join(',')}. Pulando: ${error.message || error}`);
    }
}

export async function syncGames(startDate: string, endDate: string) {
    try {
        await getIgdbAccessToken();
        const allGameIds = await fetchAllGameIdsForPeriod(startDate, endDate);
        const batchSize = 100;

        for (let i = 0; i < allGameIds.length; i += batchSize) {
            const batch = allGameIds.slice(i, i + batchSize);
            logger.info(`Processando lote de jogos: ${i + 1}-${Math.min(i + batchSize, allGameIds.length)} de ${allGameIds.length}`);
            await processGameBatch(batch);
            await delay(250); // Delay between batches to respect rate limit
        }
        
    } catch (error: any) {
        logger.error(`Erro ao sincronizar jogos: ${error.message || error}`);
    }
}