import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from './clients';
import { logger } from './logger';
import jwt from 'jsonwebtoken';


const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';

interface AuthRequest extends Request {
  user?: { 
    userId: number;
    role: string;
  };
}

// Middleware simples para verificar o token em rotas de usuário
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number, role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
};

// Rota para buscar as interações do usuário logado
router.get('/me/interactions', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(403).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const interactions = await prisma.preferencias_usuario_midia.findMany({
            where: { usuario_id: userId },
        });
        res.json(interactions);
    } catch (error) {
        logger.error(`Erro ao buscar interações para o usuário ID ${userId}:`, error);
        res.status(500).json({ error: 'Erro ao buscar interações.' });
    }
});

// Rota para criar/atualizar uma interação
router.post('/me/interactions', authMiddleware, async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(403).json({ error: 'Usuário não autenticado.' });
    }

    const { midia_id, tipo_midia, status } = req.body;

    if (!midia_id || !tipo_midia || !status) {
        return res.status(400).json({ error: 'Dados da interação incompletos.' });
    }

    try {
        const interaction = await prisma.preferencias_usuario_midia.upsert({
            where: {
                usuario_midia_unique: { 
                    usuario_id: userId,
                    midia_id: midia_id,
                    tipo_midia: tipo_midia,
                }
            },
            update: { status },
            create: { 
                usuario_id: userId,
                midia_id: midia_id,
                tipo_midia: tipo_midia,
                status: status,
            },
        });
        res.status(201).json(interaction);
    } catch (error) {
        logger.error(`Erro ao salvar interação para o usuário ID ${userId}:`, error);
        res.status(500).json({ error: 'Erro ao salvar interação.' });
    }
});

export default router;
