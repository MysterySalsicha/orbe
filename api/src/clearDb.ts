import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function clearDatabase() {
  try {
    logger.info('Iniciando limpeza do banco de dados...');

    // Fase 1: Deletar registros de TODAS as tabelas de junção e modelos com dependências.
    await prisma.preferencias_usuario_midia.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.filmeOnStreamingProvider.deleteMany({});
    await prisma.serieOnStreamingProvider.deleteMany({});
    await prisma.filmeGenero.deleteMany({});
    await prisma.filmeCompany.deleteMany({});
    await prisma.serieGenero.deleteMany({});
    await prisma.animeOnGenero.deleteMany({});
    await prisma.jogoOnGenero.deleteMany({});
    await prisma.filmeCast.deleteMany({});
    await prisma.serieCast.deleteMany({});
    await prisma.filmeCrew.deleteMany({});
    await prisma.serieCrew.deleteMany({});
    await prisma.serieCreator.deleteMany({});
    await prisma.video.deleteMany({});
    await prisma.animeOnStudio.deleteMany({});
    await prisma.animeCharacter.deleteMany({});
    await prisma.animeStaff.deleteMany({});
    await prisma.animeStreamingLink.deleteMany({});
    await prisma.animeRelation.deleteMany({});
    await prisma.airingSchedule.deleteMany({});
    await prisma.jogoOnCompany.deleteMany({});
    await prisma.jogoOnPlataforma.deleteMany({});
    await prisma.jogoOnTheme.deleteMany({});
    await prisma.jogoOnPlayerPerspective.deleteMany({});
    await prisma.screenshot.deleteMany({});
    await prisma.artwork.deleteMany({});
    await prisma.website.deleteMany({});
    await prisma.jogoOnAgeRating.deleteMany({});
    await prisma.jogoOnGameMode.deleteMany({});
    await prisma.jogoOnGameEngine.deleteMany({});
    await prisma.gameRelation.deleteMany({});
    await prisma.filmeCountry.deleteMany({});
    await prisma.filmeLanguage.deleteMany({});
    await prisma.serieLanguage.deleteMany({});
    await prisma.serieNetwork.deleteMany({});
    await prisma.temporada.deleteMany({});
    await prisma.animeOnTag.deleteMany({});
    await prisma.animeRank.deleteMany({});
    await prisma.animeExternalLink.deleteMany({});

    // Fase 2: Deletar os modelos de mídia principais e eventos.
    await prisma.jogo.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.filme.deleteMany({});
    await prisma.serie.deleteMany({});
    await prisma.anime.deleteMany({});
    
    // Fase 3: Deletar as "entidades" ou "dicionários".
    await prisma.user.deleteMany({});
    await prisma.pessoa.deleteMany({});
    await prisma.genero.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.jogoCompany.deleteMany({});
    await prisma.country.deleteMany({});
    await prisma.language.deleteMany({});
    await prisma.collection.deleteMany({});
    await prisma.streamingProvider.deleteMany({});
    await prisma.network.deleteMany({});
    await prisma.animeStudio.deleteMany({});
    await prisma.personagem.deleteMany({});
    await prisma.dublador.deleteMany({});
    await prisma.membroStaff.deleteMany({});
    await prisma.animeTag.deleteMany({});
    await prisma.jogoPlataforma.deleteMany({});
    await prisma.jogoTheme.deleteMany({});
    await prisma.jogoPlayerPerspective.deleteMany({});
    await prisma.ageRating.deleteMany({});
    await prisma.gameMode.deleteMany({});
    await prisma.gameEngine.deleteMany({});

    logger.info('Banco de dados limpo com sucesso!');
  } catch (error) {
    logger.error(`Erro ao limpar o banco de dados: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
