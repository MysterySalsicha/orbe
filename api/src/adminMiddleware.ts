import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_jwt_super_secreto';

interface AuthRequest extends Request {
  user?: { 
    userId: number;
    role: string;
  };
}

const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Tentativa de acesso admin sem token de autorização.');
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    
    if (decoded.role !== 'admin') {
      logger.warn(`Usuário (ID: ${decoded.userId}) sem permissão de admin tentou acessar rota protegida.`);
      return res.status(403).json({ error: 'Acesso proibido. Requer permissão de administrador.' });
    }

    // Opcional: adicionar informações do usuário à requisição para uso posterior
    req.user = decoded;
    
    logger.info(`Acesso de admin concedido para o usuário (ID: ${decoded.userId})`);
    next();

  } catch (error) {
    logger.error('Erro na verificação do token de admin:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

export default adminMiddleware;
