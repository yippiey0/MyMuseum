import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminOnly } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const events = await prisma.historicalEvent.findMany();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении событий' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { title, date, description, imageUrl } = req.body;
    const newEvent = await prisma.historicalEvent.create({
      data: { title, date, description, imageUrl }
    });
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании события' });
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { title, date, description, imageUrl } = req.body;
    const updatedEvent = await prisma.historicalEvent.update({
      where: { id },
      data: { title, date, description, imageUrl }
    });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении события' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.historicalEvent.delete({ where: { id } });
    res.json({ message: 'Событие удалено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении события' });
  }
});

export default router;