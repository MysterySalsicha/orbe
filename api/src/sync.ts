import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { logger } from './logger';

const syncData = async (year: number) => {
  logger.info(`Iniciando sincronização de dados para o ano ${year}...`);

  await syncMovies(year);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncSeries(year);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncAnimes(year);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await syncGames(year);

  logger.info(`Sincronização de dados para o ano ${year} concluída.`);
};

syncData(2025).catch(logger.error);