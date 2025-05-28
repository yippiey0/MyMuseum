import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, adminOnly } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  try {
    const images = await prisma.galleryImage.findMany();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении изображений' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { category, imageUrl } = req.body;
    const newImage = await prisma.galleryImage.create({
      data: { category, imageUrl }
    });
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при создании изображения' });
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const { category, imageUrl } = req.body;
    const updatedImage = await prisma.galleryImage.update({
      where: { id },
      data: { category, imageUrl }
    });
    res.json(updatedImage);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении изображения' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.galleryImage.delete({ where: { id } });
    res.json({ message: 'Изображение удалено' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при удалении изображения' });
  }
});

export default router;