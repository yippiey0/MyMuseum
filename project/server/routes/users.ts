import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminOnly } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Получить всех пользователей (только для админов)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении пользователей' });
  }
});

// Изменить роль пользователя (только для админов)
router.put('/:id/role', authMiddleware, adminOnly, async (req, res): Promise<any> => {
  const id = Number(req.params.id);
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Недопустимая роль' });
  }
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });
    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при смене роли' });
  }
});

// Удалить пользователя (только для админов)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении пользователя' });
  }
});

export default router;