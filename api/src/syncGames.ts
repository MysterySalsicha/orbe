process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { PrismaClient } from '@prisma/client';
import { igdbApi, getIgdbAccessToken } from './clients';
import { logger } from './logger';
import { broadcast } from './index';

const prisma = new PrismaClient();

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

async function fetchAndSyncEvents(prisma: PrismaClient): Promise<void> {
    logger.info('Buscando e sincronizando eventos da IGDB...');
    const query = `
        fields name, description, start_time, end_time, url;
        where start_time > ${Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30}; // Eventos do último mês
        limit 50;
    `;
    try {
        const response = await igdbApiWithRetry(() => igdbApi.post('/events', query));
        const events = response.data;

        for (const event of events) {
            await prisma.event.upsert({
                where: { igdbId: event.id },
                update: {
                    name: event.name,
                    description: event.description,
                    start_time: event.start_time ? new Date(event.start_time * 1000) : null,
                    end_time: event.end_time ? new Date(event.end_time * 1000) : null,
                    url: event.url,
                },
                create: {
                    igdbId: event.id,
                    name: event.name,
                    description: event.description,
                    start_time: event.start_time ? new Date(event.start_time * 1000) : null,
                    end_time: event.end_time ? new Date(event.end_time * 1000) : null,
                    url: event.url,
                },
            });
            logger.info(`✅ Evento [${event.id}] "${event.name}" sincronizado.`);
        }
    } catch (error: any) {
        logger.error(`Erro ao buscar e sincronizar eventos: ${error.message || error}`);
    }
}

async function processGameBatch(gameIds: number[], prisma: PrismaClient, eventId: number | null = null): Promise<void> {
    if (gameIds.length === 0) return;

    const query = `
        fields name, summary, cover.url, first_release_date, rating, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, platforms.name, themes.name, player_perspectives.name, screenshots.url, artworks.url, websites.url, websites.category, release_dates.date, release_dates.region;
        where id = (${gameIds.join(',')});
        limit ${gameIds.length};
    `;

    try {
        const response = await igdbApiWithRetry(() => igdbApi.post('/games', query));
        const games = response.data;

        for (const game of games) {
            try {
                const brReleaseDate = game.release_dates?.find((rd: any) => rd.region === 2)?.date; // Região 2 é Brasil
                const firstReleaseDate = brReleaseDate ? new Date(brReleaseDate * 1000) : (game.first_release_date ? new Date(game.first_release_date * 1000) : null);
                const coverUrl = game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : null;

                const updateData = {
                    name: game.name,
                    summary: game.summary,
                    cover: coverUrl,
                    firstReleaseDate: firstReleaseDate,
                    rating: game.rating,
                    eventId: eventId, // Associar ao evento
                };

                const createData = {
                    ...updateData,
                    igdbId: game.id,
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
                };

                const existingGame = await prisma.jogo.findUnique({ where: { igdbId: game.id } });
                let savedGame;

                if (existingGame) {
                    savedGame = await prisma.jogo.update({ where: { igdbId: game.id }, data: updateData });
                    logger.info(`🔄 Jogo [${game.id}] "${savedGame.name}" atualizado.`);
                    broadcast({ type: 'UPDATED_ITEM', mediaType: 'jogo', data: savedGame });
                } else {
                    savedGame = await prisma.jogo.create({ data: createData });
                    logger.info(`✅ Jogo [${game.id}] "${savedGame.name}" criado.`);
                    broadcast({ type: 'NEW_ITEM', mediaType: 'jogo', data: savedGame });
                }

            } catch (error) {
                logger.error(`❌ Erro ao processar o jogo ID ${game.id}. Pulando: ${error}`);
            }
        }
    } catch (error: any) {
        logger.error(`❌ Erro ao processar o lote de jogos IDs ${gameIds.join(',')}. Pulando: ${error.message || error}`);
    }
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

export async function syncGames() {
    const prisma = new PrismaClient();
    try {
        await getIgdbAccessToken();
        await fetchAndSyncEvents(prisma);

        const events = await prisma.event.findMany({ select: { igdbId: true } });
        const eventIds = events.map(e => e.igdbId);

        // Buscar jogos associados a eventos
        for (const eventId of eventIds) {
            logger.info(`Buscando jogos para o evento IGDB ID: ${eventId}...`);
            const query = `
                fields game.id;
                where event = ${eventId};
                limit 500;
            `;
            const response = await igdbApiWithRetry(() => igdbApi.post('/event_logos', query));
            const gameIds = response.data.map((item: any) => item.game.id);

            if (gameIds.length > 0) {
                const batchSize = 100;
                for (let i = 0; i < gameIds.length; i += batchSize) {
                    const batch = gameIds.slice(i, i + batchSize);
                    logger.info(`Processando lote de jogos do evento ${eventId}: ${i + 1}-${Math.min(i + batchSize, gameIds.length)} de ${gameIds.length}`);
                    await processGameBatch(batch, prisma, eventId);
                    await delay(250);
                }
            }
            await delay(250);
        }

        // Buscar jogos não associados a eventos específicos (sincronização geral)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const startDate = threeDaysAgo.toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];

        const allGameIds = await fetchAllGameIdsForPeriod(startDate, today);
        const batchSize = 100;

        if (allGameIds.length === 0) {
            logger.info('Nenhum jogo geral para atualizar.');
            return;
        }

        for (let i = 0; i < allGameIds.length; i += batchSize) {
            const batch = allGameIds.slice(i, i + batchSize);
            logger.info(`Processando lote de jogos gerais: ${i + 1}-${Math.min(i + batchSize, allGameIds.length)} de ${allGameIds.length}`);
            await processGameBatch(batch, prisma);
            await delay(250);
        }
        
    } catch (error: any) {
        logger.error(`Erro ao sincronizar jogos: ${error.message || error}`);
    }
}