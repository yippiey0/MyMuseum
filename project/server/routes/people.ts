import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminOnly } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const people = await prisma.person.findMany();
    res.json(people);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении людей' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, role, years, biography, achievements, imageUrl } = req.body;
    const newPerson = await prisma.person.create({
      data: { name, role, years, biography, achievements, imageUrl }
    });
    res.status(201).json(newPerson);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании человека' });
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { name, role, years, biography, achievements, imageUrl } = req.body;
    const updatedPerson = await prisma.person.update({
      where: { id },
      data: { name, role, years, biography, achievements, imageUrl }
    });
    res.json(updatedPerson);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении человека' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.person.delete({ where: { id } });
    res.json({ message: 'Человек удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении человека' });
  }
});

export default router;