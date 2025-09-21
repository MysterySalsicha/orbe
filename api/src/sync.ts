import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { syncEvents } from './syncEvents';
import { logger } from './logger';

const syncAllData = async () => {
  const currentYear = new Date().getFullYear();
  logger.info(`Iniciando sincronização de dados completa...`);

  logger.info(`--- Sincronizando Eventos ---`);
  await syncEvents();
  await new Promise(resolve => setTimeout(resolve, 1000));

  logger.info(`--- Sincronizando Mídias para o ano de ${currentYear} ---`);
  await syncMovies(currentYear);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncSeries(currentYear);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncAnimes(currentYear);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncGames(currentYear);

  logger.info(`Sincronização de dados completa concluída.`);
};

syncAllData().catch(logger.error);