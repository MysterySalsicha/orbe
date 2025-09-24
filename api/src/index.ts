import express from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

import mediaRoutes from './mediaRoutes';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';

app.use(cors());
app.use(express.json());

// Usar as rotas de mídia
app.use('/api', mediaRoutes);

// Rota de Registro
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // CORREÇÃO: 'usuario' para 'user'
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // CORREÇÃO: 'usuario' para 'user'
    const newUser = await prisma.user.create({
      data: {
        email,
        hashed_password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: newUser.id });
  } catch (error) {
    logger.error(`Erro no registro: ${error}`);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota de Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        // CORREÇÃO: 'usuario' para 'user'
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ token });
    } catch (error) {
        logger.error(`Erro no login: ${error}`);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// Rota de Perfil do Usuário
app.get('/profile', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        
        // CORREÇÃO: 'usuario' para 'user'
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                quer_avaliar: true,
                data_criacao: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
});