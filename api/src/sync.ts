import 'dotenv/config';
import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { syncEvents } from './syncEvents';
import { logger } from './logger';

const syncAllData = async () => {
  const currentYear = new Date().getFullYear();
  const monthsToSync = [9, 10, 11, 12];

  for (const month of monthsToSync) {
    logger.info(`--- INICIANDO SINCRONIZAÇÃO PARA O MÊS ${month}/${currentYear} ---`);

    // A sincronização de eventos não depende do mês/ano, mas vamos mantê-la no loop por enquanto.
    logger.info(`[Mês ${month}] Sincronizando Eventos...`);
    await syncEvents();
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`[Mês ${month}] Sincronizando Filmes...`);
    await syncMovies(currentYear, month);
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`[Mês ${month}] Sincronizando Séries...`);
    await syncSeries(currentYear, month);
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`[Mês ${month}] Sincronizando Animes...`);
    await syncAnimes(currentYear, month);
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`[Mês ${month}] Sincronizando Jogos...`);
    await syncGames(currentYear, month);
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info(`--- SINCRONIZAÇÃO CONCLUÍDA PARA O MÊS ${month}/${currentYear} ---\n`);
  }
};

syncAllData().catch(logger.error);