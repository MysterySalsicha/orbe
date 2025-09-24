import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { mapFilmeToMidia, mapSerieToMidia, mapAnimeToMidia, mapJogoToMidia } from './mappers';
import { logger } from './logger';

const prisma = new PrismaClient();
const router = Router();

// Rota para Filmes
router.get('/filmes', async (req, res) => {
  const { filtro, genero } = req.query;
  try {
    const where: any = {};
    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }

    const now = new Date();
    if (filtro === 'em_cartaz') {
      where.releaseDate = { lte: now };
    } else if (filtro === 'em_breve') {
      where.releaseDate = { gte: now };
    }

    const orderBy: Prisma.FilmeOrderByWithRelationInput = filtro === 'populares' ? { popularity: 'desc' } : { title: 'asc' };

    const filmes = await prisma.filme.findMany({
      where,
      orderBy,
    });
    res.json({ results: filmes.map(mapFilmeToMidia), total: filmes.length });
  } catch (error) {
    logger.error(`Erro ao buscar filmes: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar filmes.' });
  }
});

// Rota de Detalhes do Filme
router.get('/filmes/:id/details', async (req, res) => {
  const { id } = req.params;
  logger.info(`Buscando detalhes para o filme com ID: ${id}`);
  try {
    const filme = await prisma.filme.findUnique({
      where: { tmdbId: Number(id) },
      include: {
        genres: { include: { genero: true } },
        cast: { include: { pessoa: true } },
        crew: { include: { pessoa: true } },
        videos: true,
      },
    });

    logger.info(`Resultado da busca no banco: ${filme ? 'Encontrado' : 'Não Encontrado'}`);

    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }
    res.json(mapFilmeToMidia(filme));
  } catch (error) {
    logger.error(`Erro ao buscar detalhes do filme: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar detalhes do filme.' });
  }
});

// Rota para Séries
router.get('/series', async (req, res) => {
  const { filtro, genero } = req.query;
  try {
    const where: any = {};
    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }

    const orderBy: Prisma.SerieOrderByWithRelationInput = filtro === 'populares' ? { popularity: 'desc' } : { name: 'asc' };

    const series = await prisma.serie.findMany({
      where,
      orderBy,
    });
    res.json({ results: series.map(mapSerieToMidia), total: series.length });
  } catch (error) {
    logger.error(`Erro ao buscar séries: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar séries.' });
  }
});

// Rota de Detalhes da Série
router.get('/series/:id/details', async (req, res) => {
  const { id } = req.params;
  try {
    const serie = await prisma.serie.findUnique({
      where: { tmdbId: Number(id) },
      include: {
        genres: { include: { genero: true } },
        cast: { include: { pessoa: true } },
        crew: { include: { pessoa: true } },
        createdBy: { include: { pessoa: true } },
        videos: true,
        seasons: true,
      },
    });
    if (!serie) {
      return res.status(404).json({ error: 'Série não encontrada.' });
    }
    res.json(mapSerieToMidia(serie));
  } catch (error) {
    logger.error(`Erro ao buscar detalhes da série: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar detalhes da série.' });
  }
});

// Rota para Animes
router.get('/animes', async (req, res) => {
  const { filtro, genero } = req.query;
  try {
    const where: any = {};
    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }

    const orderBy: Prisma.AnimeOrderByWithRelationInput = filtro === 'populares' ? { popularity: 'desc' } : { titleRomaji: 'asc' };

    const animes = await prisma.anime.findMany({
      where,
      orderBy,
    });
    res.json({ results: animes.map(mapAnimeToMidia), total: animes.length });
  } catch (error) {
    logger.error(`Erro ao buscar animes: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar animes.' });
  }
});

// Rota de Detalhes do Anime
router.get('/animes/:id/details', async (req, res) => {
  const { id } = req.params;
  try {
    const anime = await prisma.anime.findUnique({
      where: { anilistId: Number(id) },
      include: {
        genres: { include: { genero: true } },
        studios: { include: { studio: true } },
        characters: { include: { character: true, dublador: true } },
        staff: { include: { staff: true } },
        streamingLinks: true,
      },
    });
    if (!anime) {
      return res.status(404).json({ error: 'Anime não encontrado.' });
    }
    res.json(mapAnimeToMidia(anime));
  } catch (error) {
    logger.error(`Erro ao buscar detalhes do anime: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar detalhes do anime.' });
  }
});

// Rota para Jogos
router.get('/jogos', async (req, res) => {
  const { filtro, genero } = req.query;
  try {
    const where: any = {};
    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }

    const orderBy: Prisma.JogoOrderByWithRelationInput = filtro === 'populares' ? { rating: 'desc' } : { name: 'asc' };

    const jogos = await prisma.jogo.findMany({
      where,
      orderBy,
    });
    res.json({ results: jogos.map(mapJogoToMidia), total: jogos.length });
  } catch (error) {
    logger.error(`Erro ao buscar jogos: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar jogos.' });
  }
});

// Rota de Detalhes do Jogo
router.get('/jogos/:id/details', async (req, res) => {
  const { id } = req.params;
  try {
    const jogo = await prisma.jogo.findUnique({
      where: { igdbId: Number(id) },
      include: {
        genres: { include: { genero: true } },
        platforms: { include: { plataforma: true } },
        companies: { include: { company: true } },
        themes: { include: { theme: true } },
        playerPerspectives: { include: { perspective: true } },
        screenshots: true,
        artworks: true,
        videos: true,
        websites: true,
      },
    });
    if (!jogo) {
      return res.status(404).json({ error: 'Jogo não encontrado.' });
    }
    res.json(mapJogoToMidia(jogo));
  } catch (error) {
    logger.error(`Erro ao buscar detalhes do jogo: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar detalhes do jogo.' });
  }
});

export default router;
