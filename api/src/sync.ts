process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { logger } from './logger';

const main = async () => {
  const year = 2025;
  const startDate = '2025-09-01';
  const endDate = '2025-12-31';

  logger.info(`Iniciando sincronização de dados...`);

  try {
    logger.info(`--- Iniciando sincronização de FILMES ---`);
    await syncMovies(startDate, endDate);
    logger.info(`--- Sincronização de FILMES concluída ---`);

    logger.info(`--- Iniciando sincronização de SÉRIES ---`);
    await syncSeries(startDate, endDate);
    logger.info(`--- Sincronização de SÉRIES concluída ---`);

    // logger.info(`--- Iniciando sincronização de ANIMES ---`);
    // await syncAnimes(year, ['SUMMER', 'FALL']);
    // logger.info(`--- Sincronização de ANIMES concluída ---`);

    logger.info(`--- Iniciando sincronização de JOGOS ---`);
    await syncGames(startDate, endDate);
    logger.info(`--- Sincronização de JOGOS concluída ---`);

    logger.info(`✅ Sincronização de dados completa.`);
  } catch (error) {
    logger.error(`❌ Erro fatal durante o processo de sincronização: ${error}`);
    process.exit(1);
  } finally {
    logger.info('Processo de sincronização finalizado.');
  }
};

main();
