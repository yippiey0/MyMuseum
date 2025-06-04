import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminOnly } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// GET — всем доступно
router.get('/', async (req, res) => {
  try {
    const exhibits = await prisma.exhibit.findMany();
    res.json(exhibits);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении экспонатов' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const exhibit = await prisma.exhibit.findUnique({ where: { id } });
    if (exhibit) res.json(exhibit);
    else res.status(404).json({ error: 'Экспонат не найден' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении экспоната' });
  }
});

// POST — только админ
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, description, imageUrl, year, category, videoUrl, technicalDetails, historicalContext, model3dUrl } = req.body;
    const exhibit = await prisma.exhibit.create({
      data: { name, description, imageUrl, year, category, videoUrl, technicalDetails, historicalContext, model3dUrl }
    });
    res.status(201).json(exhibit);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании экспоната' });
  }
});

// PUT — только админ
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { name, description, imageUrl, year, category, videoUrl, technicalDetails, historicalContext, model3dUrl } = req.body;
    const exhibit = await prisma.exhibit.update({
      where: { id },
      data: { name, description, imageUrl, year, category, videoUrl, technicalDetails, historicalContext, model3dUrl }
    });
    res.json(exhibit);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении экспоната' });
  }
});

// DELETE — только админ
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.exhibit.delete({ where: { id } });
    res.json({ message: 'Экспонат удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении экспоната' });
  }
});

export default router;