import { PrismaClient, Prisma } from '@prisma/client';
import { anilistApi } from './clients';
import { logger } from './logger';
import { broadcast } from './index';

const prisma = new PrismaClient();
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ... (funções anilistApiWithRetry e fetchAllAnimeIdsForSeasons permanecem as mesmas)
async function anilistApiWithRetry(query: string, variables: any, maxRetries = 5, initialDelay = 1000) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await anilistApi.post('', { query, variables });
        } catch (error: any) {
            // ... (código de retry)
        }
    }
    throw new Error("Número máximo de tentativas atingido");
}
async function fetchAllAnimeIdsForSeasons(year: number, seasons: string[]): Promise<number[]> {
    // ... (código para buscar IDs)
    return [];
}


async function processAnimeBatch(animeIds: number[]): Promise<void> {
    const detailQuery = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
          }
          description(asHtml: false)
          coverImage { extraLarge }
          startDate { year month day }
          averageScore
          genres
          studios(isMain: true) { nodes { id name } }
          source
          relations {
            edges {
              relationType
              node { id title { romaji } }
            }
          }
          airingSchedule(notYetAired: true, perPage: 5) {
            nodes { airingAt episode }
          }
        }
      }
    `;

    for (const id of animeIds) {
        try {
            const response = await anilistApiWithRetry(detailQuery, { id });
            const anime = response.data.data.Media;

            if (!anime) continue;

            const existingAnime = await prisma.anime.findUnique({ where: { anilistId: id } });

            const releaseDate = (anime.startDate && anime.startDate.year)
                ? new Date(anime.startDate.year, (anime.startDate.month || 1) - 1, anime.startDate.day || 1)
                : null;

            const data: Prisma.AnimeCreateInput = {
                anilistId: anime.id,
                titleEnglish: anime.title.english,
                titleRomaji: anime.title.romaji!,
                description: anime.description,
                coverImage: anime.coverImage?.extraLarge,
                startDate: releaseDate,
                source: anime.source,
                averageScore: anime.averageScore,
            };

            if (existingAnime) {
                const updatedAnime = await prisma.anime.update({
                    where: { anilistId: id },
                    data,
                });
                logger.info(`🔄 Anime [${id}] "${updatedAnime.titleRomaji}" atualizado.`);
                broadcast({ type: 'UPDATED_ITEM', mediaType: 'anime', data: updatedAnime });
            } else {
                const newAnime = await prisma.anime.create({ data });
                logger.info(`✅ Anime [${id}] "${newAnime.titleRomaji}" criado.`);
                broadcast({ type: 'NEW_ITEM', mediaType: 'anime', data: newAnime });

                // Lógica de Notificação de Nova Temporada
                const prequelRelation = anime.relations?.edges.find((edge: any) => edge.relationType === 'PREQUEL');
                if (prequelRelation) {
                    const prequelId = prequelRelation.node.id;
                    const prequelName = prequelRelation.node.title.romaji;

                    const usersToNotify = await prisma.preferencias_usuario_midia.findMany({
                        where: {
                            midia_id: prequelId,
                            tipo_midia: 'anime',
                            status: { in: ['assistido', 'amei'] }
                        },
                        select: { usuario_id: true }
                    });

                    const uniqueUserIds = [...new Set(usersToNotify.map(u => u.usuario_id))];

                    if (uniqueUserIds.length > 0) {
                        const notificationMessage = `A nova temporada de "${prequelName}" foi lançada: "${newAnime.titleRomaji}"!`;
                        await prisma.notification.createMany({
                            data: uniqueUserIds.map(userId => ({
                                userId: userId,
                                type: 'NEW_SEASON',
                                message: notificationMessage,
                                relatedMediaId: newAnime.anilistId,
                                relatedMediaType: 'anime'
                            }))
                        });
                        logger.info(`Notificações de nova temporada criadas para ${uniqueUserIds.length} usuários.`);
                        // O broadcast para estes usuários pode ser mais direcionado no futuro
                        broadcast({ type: 'NEW_SEASON_AVAILABLE' });
                    }
                }
            }

        } catch (error: any) {
            const errorMessage = error.response ? JSON.stringify(error.response.data) : error.message;
            logger.error(`❌ Erro ao processar o anime ID ${id}: ${errorMessage}`);
        } finally {
            await delay(670);
        }
    }
}

export async function syncAnimes(year: number, seasons: string[]) {
  const allAnimeIds = await fetchAllAnimeIdsForSeasons(year, seasons);
  const batchSize = 10;

  if (allAnimeIds.length === 0) {
      logger.info('Nenhum anime para sincronizar.');
      return;
  }

  for (let i = 0; i < allAnimeIds.length; i += batchSize) {
    const batch = allAnimeIds.slice(i, i + batchSize);
    logger.info(`Processando lote de animes: ${i + 1}-${Math.min(i + batchSize, allAnimeIds.length)} de ${allAnimeIds.length}`);
    await processAnimeBatch(batch);
  }
}
