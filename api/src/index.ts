
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API do Orbe Nerd! (Node.js)', version: '1.0' });
});

app.get('/api/filmes', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 20;

  try {
    const filmes = await prisma.filme.findMany({
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const total_filmes = await prisma.filme.count();
    const total_pages = Math.ceil(total_filmes / per_page);

    res.json({
      results: filmes,
      page: page,
      total_pages: total_pages,
      total_results: total_filmes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar filmes' });
  }
});

app.get('/api/filmes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const filme = await prisma.filme.findUnique({
      where: { id: parseInt(id) },
    });
    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }
    res.json(filme);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar filme' });
  }
});

app.get('/api/series', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 20;

  try {
    const series = await prisma.serie.findMany({
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const total_series = await prisma.serie.count();
    const total_pages = Math.ceil(total_series / per_page);

    res.json({
      results: series,
      page: page,
      total_pages: total_pages,
      total_results: total_series,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar séries' });
  }
});

app.get('/api/animes', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 20;

  try {
    const animes = await prisma.anime.findMany({
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const total_animes = await prisma.anime.count();
    const total_pages = Math.ceil(total_animes / per_page);

    res.json({
      results: animes,
      page: page,
      total_pages: total_pages,
      total_results: total_animes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar animes' });
  }
});

app.get('/api/jogos', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 20;

  try {
    const jogos = await prisma.jogo.findMany({
      skip: (page - 1) * per_page,
      take: per_page,
    });

    const total_jogos = await prisma.jogo.count();
    const total_pages = Math.ceil(total_jogos / per_page);

    res.json({
      results: jogos,
      page: page,
      total_pages: total_pages,
      total_results: total_jogos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar jogos' });
  }
});

app.get('/api/series/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const serie = await prisma.serie.findUnique({
      where: { id: parseInt(id) },
    });
    if (!serie) {
      return res.status(404).json({ error: 'Série não encontrada' });
    }
    res.json(serie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar série' });
  }
});

app.get('/api/animes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const anime = await prisma.anime.findUnique({
      where: { id: parseInt(id) },
    });
    if (!anime) {
      return res.status(404).json({ error: 'Anime não encontrado' });
    }
    res.json(anime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar anime' });
  }
});

app.get('/api/jogos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const jogo = await prisma.jogo.findUnique({
      where: { id: parseInt(id) },
    });
    if (!jogo) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.json(jogo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar jogo' });
  }
});

app.get('/api/search', (req, res) => {
  const query = req.query.q;
  res.json({ results: [] });
});

app.get('/api/trending', (req, res) => {
  res.json({ results: [] });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, nome } = req.body;

  if (!email || !password || !nome) {
    return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
  }

  try {
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.usuario.create({
      data: {
        email,
        senha_hash: hashedPassword,
        nome,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.SECRET_KEY || 'orbe_nerd_secret_key_2025', { expiresIn: '7d' });

    res.status(201).json({ message: 'Usuário criado com sucesso', token, user: newUser });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.senha_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY || 'orbe_nerd_secret_key_2025', { expiresIn: '7d' });

    res.json({ message: 'Login realizado com sucesso', token, user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'orbe_nerd_secret_key_2025') as { userId: number };
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
