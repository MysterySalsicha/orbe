import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

async function checkReleaseDates() {
  logger.info('Iniciando verificação de lançamentos próximos...');

  const notificationDays = [7, 1]; // Notificar 7 dias antes e 1 dia antes

  for (const days of notificationDays) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const targetDateStart = new Date(targetDate.setHours(0, 0, 0, 0));
    const targetDateEnd = new Date(targetDate.setHours(23, 59, 59, 999));

    logger.info(`Verificando mídias com lançamento em ${days} dia(s) (data alvo: ${targetDateStart.toISOString().split('T')[0]})`);

    try {
      // Buscar todas as preferências relevantes
      const preferences = await prisma.preferencias_usuario_midia.findMany({
        where: {
          status: { in: ['favorito', 'quero_assistir'] },
        },
        select: {
          usuario_id: true,
          midia_id: true,
          tipo_midia: true,
        },
      });

      const mediaIdsByType = preferences.reduce((acc, pref) => {
        if (!acc[pref.tipo_midia]) {
          acc[pref.tipo_midia] = new Set<number>();
        }
        acc[pref.tipo_midia].add(pref.midia_id);
        return acc;
      }, {} as Record<string, Set<number>>);

      const notificationsToCreate: any[] = [];

      // Verificar Filmes
      if (mediaIdsByType.filme) {
        const filmes = await prisma.filme.findMany({
          where: {
            tmdbId: { in: [...mediaIdsByType.filme] },
            releaseDate: {
              gte: targetDateStart,
              lte: targetDateEnd,
            },
          },
        });
        filmes.forEach(filme => {
          const users = preferences.filter(p => p.tipo_midia === 'filme' && p.midia_id === filme.tmdbId);
          users.forEach(user => {
            notificationsToCreate.push({
              userId: user.usuario_id,
              type: 'RELEASE_SOON',
              message: `Falta${days > 1 ? 'm' : ''} ${days} dia${days > 1 ? 's' : ''} para a estreia de "${filme.title}"!`,
              relatedMediaId: filme.tmdbId,
              relatedMediaType: 'filme',
            });
          });
        });
      }

      // Verificar Séries
      if (mediaIdsByType.serie) {
        const series = await prisma.serie.findMany({
          where: {
            tmdbId: { in: [...mediaIdsByType.serie] },
            firstAirDate: {
              gte: targetDateStart,
              lte: targetDateEnd,
            },
          },
        });
        series.forEach(serie => {
          const users = preferences.filter(p => p.tipo_midia === 'serie' && p.midia_id === serie.tmdbId);
          users.forEach(user => {
            notificationsToCreate.push({
              userId: user.usuario_id,
              type: 'RELEASE_SOON',
              message: `Falta${days > 1 ? 'm' : ''} ${days} dia${days > 1 ? 's' : ''} para a estreia de "${serie.name}"!`,
              relatedMediaId: serie.tmdbId,
              relatedMediaType: 'serie',
            });
          });
        });
      }

      // Verificar Animes
      if (mediaIdsByType.anime) {
        const animes = await prisma.anime.findMany({
          where: {
            anilistId: { in: [...mediaIdsByType.anime] },
            startDate: {
              gte: targetDateStart,
              lte: targetDateEnd,
            },
          },
        });
        animes.forEach(anime => {
          const users = preferences.filter(p => p.tipo_midia === 'anime' && p.midia_id === anime.anilistId);
          users.forEach(user => {
            notificationsToCreate.push({
              userId: user.usuario_id,
              type: 'RELEASE_SOON',
              message: `Falta${days > 1 ? 'm' : ''} ${days} dia${days > 1 ? 's' : ''} para a estreia de "${anime.titleRomaji}"!`,
              relatedMediaId: anime.anilistId,
              relatedMediaType: 'anime',
            });
          });
        });
      }

      // Verificar Jogos
      if (mediaIdsByType.jogo) {
        const jogos = await prisma.jogo.findMany({
          where: {
            igdbId: { in: [...mediaIdsByType.jogo] },
            firstReleaseDate: {
              gte: targetDateStart,
              lte: targetDateEnd,
            },
          },
        });
        jogos.forEach(jogo => {
          const users = preferences.filter(p => p.tipo_midia === 'jogo' && p.midia_id === jogo.igdbId);
          users.forEach(user => {
            notificationsToCreate.push({
              userId: user.usuario_id,
              type: 'RELEASE_SOON',
              message: `Falta${days > 1 ? 'm' : ''} ${days} dia${days > 1 ? 's' : ''} para o lançamento de "${jogo.name}"!`,
              relatedMediaId: jogo.igdbId,
              relatedMediaType: 'jogo',
            });
          });
        });
      }

      if (notificationsToCreate.length > 0) {
        await prisma.notification.createMany({ data: notificationsToCreate });
        logger.info(`${notificationsToCreate.length} notificações de lançamento próximo foram criadas.`);
      }

    } catch (error) {
      logger.error('Erro durante a verificação de lançamentos:', error);
    }
  }

  logger.info('Verificação de lançamentos próximos concluída.');
}

checkReleaseDates().finally(async () => {
  await prisma.$disconnect();
});
