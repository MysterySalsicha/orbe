import { Router } from 'express';
import { logger } from './logger';
import { prisma } from './clients';
import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';

const router = Router();

const SYNC_SECRET = process.env.SYNC_SECRET || 'super-secret-sync-key';

// Middleware to protect the sync endpoint
router.use('/run-sync', (req, res, next) => {
  const secret = req.headers['x-sync-secret'] || req.body.secret;
  if (secret !== SYNC_SECRET) {
    logger.warn('Tentativa de sincronização não autorizada.');
    return res.status(403).json({ error: 'Não autorizado.' });
  }
  next();
});

router.post('/run-sync', async (req, res) => {
  const { mediaType, startDate, endDate, startYear, endYear } = req.body;

  if (!mediaType || !((startDate && endDate) || (startYear && endYear))) {
    return res.status(400).json({ error: 'Parâmetros inválidos. Forneça mediaType e (startDate/endDate ou startYear/endYear).' });
  }

  logger.info(`Sincronização manual iniciada para ${mediaType} de ${startDate || startYear} a ${endDate || endYear}`);
  
  // Respond immediately to avoid timeout issues with long-running syncs
  res.status(202).json({ message: `Sincronização para ${mediaType} iniciada. Verifique os logs para o progresso.` });

  // Run the sync in the background (Vercel will still enforce a timeout, but this lets the HTTP request finish)
  try {
    switch (mediaType) {
      case 'movies':
        await syncMovies(prisma, startDate, endDate);
        break;
      case 'series':
        await syncSeries(prisma, startDate, endDate);
        break;
      case 'animes':
        const start = parseInt(startYear);
        const end = parseInt(endYear);
        for (let year = start; year <= end; year++) {
          await syncAnimes(year, ['WINTER', 'SPRING', 'SUMMER', 'FALL']);
        }
        break;
      case 'games':
        await syncGames(prisma, startDate, endDate);
        break;
      default:
        logger.warn(`Tipo de mídia desconhecido para sincronização: ${mediaType}`);
    }
    logger.info(`Sincronização manual para ${mediaType} concluída.`);
  } catch (error) {
    logger.error(`Erro durante a sincronização manual de ${mediaType}:`, error);
  }
});

export default router;
