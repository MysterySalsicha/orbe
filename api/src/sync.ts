

import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { syncMovies } from './syncMovies';
import { syncSeries } from './syncSeries';
import { syncAnimes } from './syncAnimes';
import { syncGames } from './syncGames';
import { logger } from './logger';

const main = async () => {
  const startDate = process.argv[2];
  const endDate = process.argv[3];
  const limit = process.argv[4] ? parseInt(process.argv[4]) : undefined;

  if (!startDate || !endDate) {
    logger.error('Uso: ts-node src/sync.ts <startDate> <endDate> [limit]');
    process.exit(1);
  }

  logger.info(`Iniciando sincronização de dados de ${startDate} a ${endDate}...`);

  try {
    logger.info(`--- Iniciando sincronização de FILMES ---`);
<<<<<<< HEAD
    await syncMovies(prisma, startDate, endDate, limit);
    logger.info(`--- Sincronização de FILMES concluída ---`);

    logger.info(`--- Iniciando sincronização de SÉRIES ---`);
    await syncSeries(prisma, startDate, endDate, limit);
    logger.info(`--- Sincronização de SÉRIES concluída ---`);

    logger.info(`--- Iniciando sincronização de ANIMES ---`);
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    for (let year = startYear; year <= endYear; year++) {
        logger.info(`Sincronizando animes para o ano ${year}...`);
        await syncAnimes(year, ['WINTER', 'SPRING', 'SUMMER', 'FALL'], limit);
    }
    logger.info(`--- Sincronização de ANIMES concluída ---`);

    logger.info(`--- Iniciando sincronização de JOGOS ---`);
<<<<<<< HEAD
    await syncGames(prisma, limit);
    logger.info(`--- Sincronização de JOGOS concluída ---`);

    logger.info(`✅ Sincronização de dados completa.`);
  } catch (error) {
    logger.error(`❌ Erro fatal durante o processo de sincronização: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    logger.info('Processo de sincronização finalizado.');
  }
};

if (require.main === module) {
  main();
}
