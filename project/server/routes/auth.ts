import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

router.post('/login', async (req, res): Promise<any> => {
  const { username, password } = req.body;
  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { email: username }] }
  });
  if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Неверный логин или пароль' });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, id: user.id, username: user.username, role: user.role, email: user.email });
});

router.post('/register', async (req, res): Promise<any> => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Заполните все поля' });
  const exists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (exists) return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hash,
      role: 'user',
    }
  });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, id: user.id, username: user.username, role: user.role, email: user.email });
});

export default router;
