import { igdbApi, getIgdbAccessToken } from './clients';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

const parseTimestamp = (timestamp: number | null) => {
  if (!timestamp) return null;
  return new Date(timestamp * 1000);
};

export const syncEvents = async () => {
  logger.info('Iniciando sincronização de eventos...');
  try {
    await getIgdbAccessToken();

    const limit = 100;
    let offset = 0;
    let totalEventsSynced = 0;
    let hasMore = true;

    // Sync events from the last year and in the future
    const oneYearAgo = Math.floor(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime() / 1000);

    const queryFields = `
      fields name, description, start_time, end_time, logo.*, games;
      where start_time > ${oneYearAgo};
      sort start_time desc;
    `;

    while (hasMore) {
      try {
        const response = await igdbApi.post('/events', `${queryFields} limit ${limit}; offset ${offset};`);
        const events = response.data;

        if (events.length === 0) {
          hasMore = false;
          break;
        }

        for (const event of events) {
          // Find which of the event's games already exist in our DB
          const existingGameIds = await prisma.jogo.findMany({
            where: {
              id: { in: event.games || [] },
            },
            select: {
              id: true,
            },
          });

          const payload = {
            name_api: event.name,
            description_api: event.description,
            start_time_api: parseTimestamp(event.start_time),
            end_time_api: parseTimestamp(event.end_time),
            logo_api: event.logo,
          };

          await prisma.eventoAnuncio.upsert({
            where: { id: event.id },
            update: {
                ...payload,
                jogos: {
                    connect: existingGameIds,
                }
            },
            create: {
              id: event.id,
              ...payload,
              name_curado: event.name,
              jogos: {
                connect: existingGameIds,
              },
            },
          });
          logger.info(`  Evento [${event.id}] "${event.name}" sincronizado.`);
        }

        totalEventsSynced += events.length;
        offset += limit;
        hasMore = events.length === limit;

        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 250)); // Rate limit
        }
      } catch (apiError: any) {
        logger.error(`Erro ao buscar eventos com offset ${offset}: ${apiError.message}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait longer on API error
      }
    }

    logger.info(`Total de ${totalEventsSynced} eventos sincronizados.`);
  } catch (error: any) {
    logger.error(`Erro fatal ao sincronizar eventos: ${error.message}`);
  }
};
