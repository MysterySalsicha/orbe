import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { mapFilmeToMidia, mapSerieToMidia, mapAnimeToMidia, mapJogoToMidia } from './mappers';
import { logger } from './logger';
import cacheMiddleware from './cacheMiddleware';
import adminMiddleware from './adminMiddleware';
import redisClient from './redisClient';


const prisma = new PrismaClient();
const router = Router();

const TWELVE_HOURS = 43200;
const TWENTY_FOUR_HOURS = 86400;
const MIN_VOTE_COUNT = 50;
const MIN_POPULARITY = 20;

// Rota para Filmes
router.get('/filmes', cacheMiddleware(TWELVE_HOURS), async (req, res) => {
  const { filtro, genero, ano, status } = req.query;
  try {
    const allConditions: Prisma.FilmeWhereInput[] = [
      {
        OR: [
          { voteCount: { gt: MIN_VOTE_COUNT } },
          { popularity: { gt: MIN_POPULARITY } },
        ],
      }
    ];

    if (genero && genero !== 'todos') {
      allConditions.push({ genres: { some: { genero: { name: genero as string } } } });
    }

    if (status && status !== 'todos') {
      allConditions.push({ status: status as string });
    }

    if (ano && ano !== 'todos') {
      const year = parseInt(ano as string);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      allConditions.push({ releaseDate: { gte: startDate, lte: endDate } });
    }

    const now = new Date();
    if (filtro === 'em_cartaz') {
      allConditions.push({ releaseDate: { lte: now } });
    } else if (filtro === 'em_breve') {
      allConditions.push({ releaseDate: { gte: now } });
    }

    const where: Prisma.FilmeWhereInput = { AND: allConditions };

    const orderBy: Prisma.FilmeOrderByWithRelationInput = filtro === 'populares' ? { popularity: 'desc' } : { title: 'asc' };

    const filmes = await prisma.filme.findMany({
      where,
      include: { streamingProviders: { include: { provider: true } } },
      orderBy,
    });
    res.json({ results: filmes.map(mapFilmeToMidia), total: filmes.length });
  } catch (error) {
    logger.error(`Erro ao buscar filmes: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar filmes.' });
  }
});

// Rota de Detalhes do Filme
router.get('/filmes/:id/details', cacheMiddleware(TWENTY_FOUR_HOURS), async (req, res) => {
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
        streamingProviders: { include: { provider: true } },
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

// Rota de Edição do Filme (Admin)
router.put('/filmes/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedFilme = await prisma.filme.update({
      where: { tmdbId: Number(id) },
      data,
    });

    // Invalidar o cache para esta mídia
    if (redisClient) {
      const cacheKey = `cache:/api/filmes/${id}/details`;
      await redisClient.del(cacheKey);
      logger.info(`Cache invalidado para a chave: ${cacheKey}`);
    }
    res.json(mapFilmeToMidia(updatedFilme));
  } catch (error) {
    logger.error(`Erro ao editar o filme ID ${id}: ${error}`);
    res.status(500).json({ error: 'Erro ao editar o filme.' });
  }
});

// Rota para buscar opções de filtros de Filmes
router.get('/filmes/filtros', async (req, res) => {
  try {
    const genres = await prisma.genero.findMany({
      where: { filmes: { some: {} } }, // Apenas gêneros que têm filmes
      orderBy: { name: 'asc' },
    });

    const years = await prisma.filme.findMany({
      where: { releaseDate: { not: null } },
      distinct: ['releaseDate'],
      select: { releaseDate: true },
      orderBy: { releaseDate: 'desc' },
    });

    const distinctYears = [...new Set(years.map(y => y.releaseDate!.getFullYear()))];

    const statuses = await prisma.filme.findMany({
        where: { status: { not: null } },
        distinct: ['status'],
        select: { status: true },
    });

    res.json({
      genres: genres.map(g => g.name),
      years: distinctYears,
      statuses: statuses.map(s => s.status),
    });

  } catch (error) {
    logger.error('Erro ao buscar filtros de filmes:', error);
    res.status(500).json({ error: 'Erro ao buscar opções de filtros.' });
  }
});


// Rota para Séries
router.get('/series', cacheMiddleware(TWELVE_HOURS), async (req, res) => {
  const { filtro, genero, ano, status } = req.query;
  try {
    const where: Prisma.SerieWhereInput = {};

    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }

    if (status && status !== 'todos') {
      where.status = status as string;
    }

    if (ano && ano !== 'todos') {
      const year = parseInt(ano as string);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      where.firstAirDate = {
        gte: startDate,
        lte: endDate,
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
router.get('/series/:id/details', cacheMiddleware(TWENTY_FOUR_HOURS), async (req, res) => {
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
        streamingProviders: { include: { provider: true } },
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

// Rota de Edição da Série (Admin)
router.put('/series/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedSerie = await prisma.serie.update({
      where: { tmdbId: Number(id) },
      data,
    });

    // Invalidar o cache
    if (redisClient) {
      const cacheKey = `cache:/api/series/${id}/details`;
      await redisClient.del(cacheKey);
      logger.info(`Cache invalidado para a chave: ${cacheKey}`);
    }

    res.json(mapSerieToMidia(updatedSerie));
  } catch (error) {
    logger.error(`Erro ao editar a série ID ${id}: ${error}`);
    res.status(500).json({ error: 'Erro ao editar a série.' });
  }
});

// Rota para buscar opções de filtros de Séries
router.get('/series/filtros', async (req, res) => {
  try {
    const genres = await prisma.genero.findMany({
      where: { series: { some: {} } },
      orderBy: { name: 'asc' },
    });

    const years = await prisma.serie.findMany({
      where: { firstAirDate: { not: null } },
      distinct: ['firstAirDate'],
      select: { firstAirDate: true },
      orderBy: { firstAirDate: 'desc' },
    });

    const distinctYears = [...new Set(years.map(y => y.firstAirDate!.getFullYear()))];

    const statuses = await prisma.serie.findMany({
        where: { status: { not: null } },
        distinct: ['status'],
        select: { status: true },
    });

    res.json({
      genres: genres.map(g => g.name),
      years: distinctYears,
      statuses: statuses.map(s => s.status),
    });

  } catch (error) {
    logger.error('Erro ao buscar filtros de séries:', error);
    res.status(500).json({ error: 'Erro ao buscar opções de filtros.' });
  }
});

const blockedTags = ["Hentai", "Ecchi", "Yaoi", "Yuri", "Adult"];

// Rota para Animes
router.get('/animes', cacheMiddleware(TWELVE_HOURS), async (req, res) => {
  const { filtro, genero, ano, formato, fonte, status, safeSearch } = req.query;
  try {
    const where: Prisma.AnimeWhereInput = {};

    if (genero && genero !== 'todos') {
      where.genres = {
        some: { genero: { name: genero as string } },
      };
    }
    if (formato && formato !== 'todos') {
      where.format = formato as string;
    }
    if (fonte && fonte !== 'todos') {
      where.source = fonte as string;
    }
    if (status && status !== 'todos') {
      where.status = status as string;
    }
    if (ano && ano !== 'todos') {
      where.seasonYear = parseInt(ano as string);
    }

    if (safeSearch === 'true') {
      where.tags = {
        none: {
          tag: {
            name: {
              in: blockedTags,
            },
          },
        },
      };
    }

    const orderBy: Prisma.AnimeOrderByWithRelationInput = filtro === 'populares' ? { popularity: 'desc' } : { titleRomaji: 'asc' };

    const animes = await prisma.anime.findMany({
      where,
      include: { 
        sourceRelations: { 
          include: { 
            relatedAnime: { select: { anilistId: true, titleRomaji: true } },
            sourceAnime: { select: { anilistId: true, titleRomaji: true } }
          }
        },
        relatedRelations: { 
          include: { 
            relatedAnime: { select: { anilistId: true, titleRomaji: true } },
            sourceAnime: { select: { anilistId: true, titleRomaji: true } }
          }
        },
        tags: { include: { tag: true } }
      },
      orderBy,
    });
    res.json({ results: animes.map(mapAnimeToMidia), total: animes.length });
  } catch (error) {
    logger.error(`Erro ao buscar animes: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar animes.' });
  }
});

// Rota de Detalhes do Anime
router.get('/animes/:id/details', cacheMiddleware(TWELVE_HOURS), async (req, res) => {
  const { id } = req.params;
  try {
    const anime = await prisma.anime.findUnique({
      where: { anilistId: Number(id) },
      include: {
        genres: { include: { genero: true } },
        studios: { include: { studio: true } },
        characters: { include: { character: true, voiceActors: { include: { dublador: true } } } },
        staff: { include: { staff: true } },
        streamingLinks: true,
        sourceRelations: { 
          include: { 
            relatedAnime: { select: { anilistId: true, titleRomaji: true } },
            sourceAnime: { select: { anilistId: true, titleRomaji: true } }
          }
        },
        relatedRelations: { 
          include: { 
            relatedAnime: { select: { anilistId: true, titleRomaji: true } },
            sourceAnime: { select: { anilistId: true, titleRomaji: true } }
          }
        },
        airingSchedule: true,
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

// Rota de Edição do Anime (Admin)
router.put('/animes/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedAnime = await prisma.anime.update({
      where: { anilistId: Number(id) },
      data,
    });

    // Invalidar o cache
    if (redisClient) {
      const cacheKey = `cache:/api/animes/${id}/details`;
      await redisClient.del(cacheKey);
      logger.info(`Cache invalidado para a chave: ${cacheKey}`);
    }

    res.json(mapAnimeToMidia(updatedAnime));
  } catch (error) {
    logger.error(`Erro ao editar o anime ID ${id}: ${error}`);
    res.status(500).json({ error: 'Erro ao editar o anime.' });
  }
});

// Rota para buscar opções de filtros de Animes
router.get('/animes/filtros', async (req, res) => {
  try {
    const genres = await prisma.animeGenero.findMany({ orderBy: { name: 'asc' } });
    const years = await prisma.anime.findMany({ where: { seasonYear: { not: null } }, distinct: ['seasonYear'], select: { seasonYear: true }, orderBy: { seasonYear: 'desc' } });
    const formats = await prisma.anime.findMany({ where: { format: { not: null } }, distinct: ['format'], select: { format: true } });
    const sources = await prisma.anime.findMany({ where: { source: { not: null } }, distinct: ['source'], select: { source: true } });
    const statuses = await prisma.anime.findMany({ where: { status: { not: null } }, distinct: ['status'], select: { status: true } });

    res.json({
      genres: genres.map(g => g.name),
      years: years.map(y => y.seasonYear).filter(Boolean),
      formats: formats.map(f => f.format).filter(Boolean),
      sources: sources.map(s => s.source).filter(Boolean),
      statuses: statuses.map(s => s.status).filter(Boolean),
    });

  } catch (error) {
    logger.error('Erro ao buscar filtros de animes:', error);
    res.status(500).json({ error: 'Erro ao buscar opções de filtros.' });
  }
});

// Rota para o próximo episódio de um anime (não cacheada)
router.get('/animes/:id/next-episode', async (req, res) => {
  const { id } = req.params;
  try {
    const nextAiring = await prisma.airingSchedule.findFirst({
      where: {
        anime: { anilistId: Number(id) },
        airingAt: { gte: new Date() },
      },
      orderBy: {
        episode: 'asc',
      },
    });
    res.json(nextAiring);
  } catch (error) {
    logger.error(`Erro ao buscar próximo episódio para o anime ID ${id}: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar informações do próximo episódio.' });
  }
});

// Rota para Jogos
router.get('/jogos', cacheMiddleware(TWELVE_HOURS), async (req, res) => {
  const { filtro, genero, plataforma, modo } = req.query;
  try {
    const where: Prisma.JogoWhereInput = {};

    if (genero && genero !== 'todos') {
      where.genres = { some: { genero: { name: genero as string } } };
    }
    if (plataforma && plataforma !== 'todos') {
      where.platforms = { some: { plataforma: { name: plataforma as string } } };
    }
    if (modo && modo !== 'todos') {
      where.gameModes = { some: { gameMode: { name: modo as string } } };
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
router.get('/jogos/:id/details', cacheMiddleware(TWENTY_FOUR_HOURS), async (req, res) => {
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

// Rota de Edição do Jogo (Admin)
router.put('/jogos/:id', adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedJogo = await prisma.jogo.update({
      where: { igdbId: Number(id) },
      data,
    });

    // Invalidar o cache
    if (redisClient) {
      const cacheKey = `cache:/api/jogos/${id}/details`;
      await redisClient.del(cacheKey);
      logger.info(`Cache invalidado para a chave: ${cacheKey}`);
    }

    res.json(mapJogoToMidia(updatedJogo));
  } catch (error) {
    logger.error(`Erro ao editar o jogo ID ${id}: ${error}`);
    res.status(500).json({ error: 'Erro ao editar o jogo.' });
  }
});

// Rota para buscar opções de filtros de Jogos
router.get('/jogos/filtros', async (req, res) => {
  try {
    const genres = await prisma.jogoGenero.findMany({ orderBy: { name: 'asc' } });
    const platforms = await prisma.jogoPlataforma.findMany({ orderBy: { name: 'asc' } });
    const gameModes = await prisma.gameMode.findMany({ orderBy: { name: 'asc' } });
    const gameEngines = await prisma.gameEngine.findMany({ orderBy: { name: 'asc' } });

    res.json({
      genres: genres.map(g => g.name),
      platforms: platforms.map(p => p.name),
      gameModes: gameModes.map(gm => gm.name),
      gameEngines: gameEngines.map(ge => ge.name),
    });

  } catch (error) {
    logger.error('Erro ao buscar filtros de jogos:', error);
    res.status(500).json({ error: 'Erro ao buscar opções de filtros.' });
  }
});

// Rota de Pesquisa Global
router.get('/pesquisa', async (req, res) => {
  const { q, category } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'O parâmetro de pesquisa \'q\' é obrigatório.' });
  }

  try {
    const searchFilter = { contains: q, mode: 'insensitive' as const };
    let promises = [];

    const searchAnimes = () => prisma.anime.findMany({
      where: {
        OR: [
          { titleRomaji: searchFilter },
          { titleEnglish: searchFilter },
          { synonyms: { has: q } }
        ]
      }
    });

    const searchFilmes = () => prisma.filme.findMany({ where: { title: searchFilter } });
    const searchSeries = () => prisma.serie.findMany({ where: { name: searchFilter } });
    const searchJogos = () => prisma.jogo.findMany({ where: { name: searchFilter } });

    let results = {
      animes: [] as any[],
      filmes: [] as any[],
      series: [] as any[],
      jogos: [] as any[],
    };

    switch (category) {
      case 'animes':
        results.animes = (await searchAnimes()).map(mapAnimeToMidia);
        break;
      case 'filmes':
        results.filmes = (await searchFilmes()).map(mapFilmeToMidia);
        break;
      case 'series':
        results.series = (await searchSeries()).map(mapSerieToMidia);
        break;
      case 'jogos':
        results.jogos = (await searchJogos()).map(mapJogoToMidia);
        break;
      default:
        const [animes, filmes, series, jogos] = await Promise.all([
          searchAnimes(),
          searchFilmes(),
          searchSeries(),
          searchJogos(),
        ]);
        results.animes = animes.map(mapAnimeToMidia);
        results.filmes = filmes.map(mapFilmeToMidia);
        results.series = series.map(mapSerieToMidia);
        results.jogos = jogos.map(mapJogoToMidia);
        break;
    }

    res.json(results);

  } catch (error) {
    logger.error(`Erro ao realizar pesquisa: ${error}`);
    res.status(500).json({ error: 'Erro interno ao realizar pesquisa.' });
  }
});

// Rota para Premiações
router.get('/premios', cacheMiddleware(TWENTY_FOUR_HOURS), async (req, res) => {
  const { awardName, year } = req.query;
  try {
    const where: any = { premiacoes: { not: Prisma.JsonNull } };

    if (awardName) {
      where.premiacoes = { path: ['nome'], string_contains: awardName as string };
    }
    if (year) {
      where.premiacoes = { path: ['ano'], equals: parseInt(year as string) };
    }

    const filmes = await prisma.filme.findMany({ where, select: { id: true, tmdbId: true, title: true, posterPath: true, premiacoes: true } });
    const series = await prisma.serie.findMany({ where, select: { id: true, tmdbId: true, name: true, posterPath: true, premiacoes: true } });
    const animes = await prisma.anime.findMany({ where, select: { id: true, anilistId: true, titleRomaji: true, coverImage: true, premiacoes: true } });
    const jogos = await prisma.jogo.findMany({ where, select: { id: true, igdbId: true, name: true, cover: true, premiacoes: true } });

    const allAwards = [
      ...filmes.map(f => ({ ...f, type: 'filme' })),
      ...series.map(s => ({ ...s, type: 'serie' })),
      ...animes.map(a => ({ ...a, type: 'anime' })),
      ...jogos.map(j => ({ ...j, type: 'jogo' })),
    ];

    res.json(allAwards);

  } catch (error) {
    logger.error(`Erro ao buscar premiações: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar premiações.' });
  }
});

// Rota para Filmes por Ano
router.get('/filmes/by-year', async (req, res) => {
  const { year } = req.query;
  if (!year || isNaN(parseInt(year as string))) {
    return res.status(400).json({ error: 'Ano inválido fornecido.' });
  }
  const parsedYear = parseInt(year as string);
  const startDate = new Date(parsedYear, 0, 1);
  const endDate = new Date(parsedYear, 11, 31, 23, 59, 59);

  try {
    const currentYear = new Date().getFullYear();
    let relevanceFilter: Prisma.FilmeWhereInput = {};

    if (parsedYear > currentYear) {
      relevanceFilter = { popularity: { gt: 2 } };
    } else {
      relevanceFilter = {
        OR: [
          { voteCount: { gt: 25 } },
          { popularity: { gt: 10 } },
        ],
      };
    }

    const filmes = await prisma.filme.findMany({
      where: {
        AND: [
          {
            releaseDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          relevanceFilter,
        ],
      },
      orderBy: {
        releaseDate: 'asc',
      },
      include: {
        genres: { include: { genero: true } },
        streamingProviders: { include: { provider: true } },
      },
    });
    res.json(filmes.map(mapFilmeToMidia));
  } catch (error) {
    logger.error(`Erro ao buscar filmes por ano: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar filmes por ano.' });
  }
});

// Rota para Séries por Ano
router.get('/series/by-year', async (req, res) => {
  const { year } = req.query;
  if (!year || isNaN(parseInt(year as string))) {
    return res.status(400).json({ error: 'Ano inválido fornecido.' });
  }
  const parsedYear = parseInt(year as string);
  const startDate = new Date(parsedYear, 0, 1);
  const endDate = new Date(parsedYear, 11, 31, 23, 59, 59);

  try {
    const currentYear = new Date().getFullYear();
    let relevanceFilter: Prisma.SerieWhereInput = {};

    if (parsedYear > currentYear) {
      relevanceFilter = { popularity: { gt: 2 } };
    } else {
      relevanceFilter = {
        OR: [
          { voteCount: { gt: 25 } },
          { popularity: { gt: 10 } },
        ],
      };
    }

    const series = await prisma.serie.findMany({
      where: {
        AND: [
          {
            firstAirDate: {
              gte: startDate,
              lte: endDate,
            },
          },
          relevanceFilter,
        ],
      },
      orderBy: {
        firstAirDate: 'asc',
      },
      include: {
        genres: { include: { genero: true } },
        streamingProviders: { include: { provider: true } },
      },
    });
    res.json(series.map(mapSerieToMidia));
  } catch (error) {
    logger.error(`Erro ao buscar séries por ano: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar séries por ano.' });
  }
});

// Rota para Jogos por Ano
router.get('/jogos/by-year', async (req, res) => {
  const { year } = req.query;
  if (!year || isNaN(parseInt(year as string))) {
    return res.status(400).json({ error: 'Ano inválido fornecido.' });
  }
  const parsedYear = parseInt(year as string);
  const startDate = new Date(parsedYear, 0, 1);
  const endDate = new Date(parsedYear, 11, 31, 23, 59, 59);

  try {
    const jogos = await prisma.jogo.findMany({
      where: {
        firstReleaseDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        firstReleaseDate: 'asc',
      },
      include: {
        platforms: { include: { plataforma: true } }
      }
    });
    res.json(jogos.map(mapJogoToMidia));
  } catch (error) {
    logger.error(`Erro ao buscar jogos por ano: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar jogos por ano.' });
  }
});

// Rota para Animes da Semana
router.get('/animes/weekly-schedule', async (req, res) => {
  try {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Dom) - 6 (Sáb)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    const schedule = await prisma.airingSchedule.findMany({
      where: {
        airingAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        anime: true,
      },
      orderBy: {
        airingAt: 'asc',
      },
    });

    const groupedByDay = schedule.reduce((acc, item) => {
      const day = item.airingAt.getDay();
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(mapAnimeToMidia(item.anime));
      return acc;
    }, {} as Record<number, any[]>);

    res.json(groupedByDay);
  } catch (error) {
    logger.error(`Erro ao buscar cronograma semanal de animes: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar cronograma semanal de animes.' });
  }
});

// Helper function to get date range for a season
const getSeasonDateRange = (year: number, season: string): { startDate: Date, endDate: Date } => {
  let startDate: Date;
  let endDate: Date;

  switch (season.toUpperCase()) {
    case 'WINTER':
      startDate = new Date(Date.UTC(year, 0, 1)); // Jan 1
      endDate = new Date(Date.UTC(year, 2, 31, 23, 59, 59, 999)); // Mar 31
      break;
    case 'SPRING':
      startDate = new Date(Date.UTC(year, 3, 1)); // Apr 1
      endDate = new Date(Date.UTC(year, 5, 30, 23, 59, 59, 999)); // Jun 30
      break;
    case 'SUMMER':
      startDate = new Date(Date.UTC(year, 6, 1)); // Jul 1
      endDate = new Date(Date.UTC(year, 8, 30, 23, 59, 59, 999)); // Sep 30
      break;
    case 'FALL':
      startDate = new Date(Date.UTC(year, 9, 1)); // Oct 1
      endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // Dec 31
      break;
    default:
      // Return a range that will yield no results for invalid seasons
      startDate = new Date(0);
      endDate = new Date(0);
      break;
  }
  return { startDate, endDate };
};

// Rota para Animes por Temporada e Ano
router.get('/animes/by-season', async (req, res) => {
  const { year, season } = req.query;

  if (!year || !season || typeof year !== 'string' || typeof season !== 'string') {
    return res.status(400).json({ error: "Os parâmetros 'year' e 'season' são obrigatórios." });
  }

  try {
    const parsedYear = parseInt(year, 10);
    if (isNaN(parsedYear)) {
      return res.status(400).json({ error: "O parâmetro 'year' deve ser um número." });
    }

    const { startDate, endDate } = getSeasonDateRange(parsedYear, season);

    const airingSchedules = await prisma.airingSchedule.findMany({
      where: {
        airingAt: {
          gte: startDate,
          lte: endDate,
        },
        anime: {
          isAdult: false,
          format: {
            in: ['TV', 'MOVIE', 'ONA', 'SPECIAL'],
          },
        },
      },
      include: {
        anime: {
          include: {
            airingSchedule: true,
            genres: { include: { genero: true } },
            studios: { include: { studio: true } },
            characters: { 
              include: { 
                character: true, 
                voiceActors: { include: { dublador: true } } 
              } 
            }
          }
        }
      },
      orderBy: {
        airingAt: 'asc',
      },
    });

    const animesMap = new Map<number, any>();
    airingSchedules.forEach(schedule => {
      if (schedule.anime && !animesMap.has(schedule.anime.anilistId)) {
        animesMap.set(schedule.anime.anilistId, schedule.anime);
      }
    });

    const uniqueAnimes = Array.from(animesMap.values());

    const animesWithNextEpisode = uniqueAnimes.map(anime => {
      const now = new Date();
      const nextAiring = anime.airingSchedule
        .filter((s: any) => s.airingAt > now)
        .sort((a: any, b: any) => a.airingAt.getTime() - b.airingAt.getTime())[0];

      return {
        ...mapAnimeToMidia(anime),
        nextAiringEpisode: nextAiring ? { airingAt: nextAiring.airingAt, episode: nextAiring.episode } : null,
      };
    });

    res.status(200).json(animesWithNextEpisode);
  } catch (error) {
    logger.error(`Erro ao buscar animes por temporada: ${error}`);
    res.status(500).json({ error: 'Erro ao buscar animes por temporada.' });
  }
});



export default router;
