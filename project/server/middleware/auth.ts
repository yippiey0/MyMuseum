import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export interface AuthRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: 'Нет токена' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Нет токена' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(403).json({ error: 'Неверный токен' });
  }
}

// Только для админов
export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Требуются права администратора' });
  }
}