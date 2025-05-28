import express from "express";
import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "vadim120903@gmail.com",
    pass: "ojod ekpq efnv ejca",
  },
});

function validateForm(data: any) {
  const errors: string[] = [];
  if (!data.name || typeof data.name !== "string" || data.name.length < 2) {
    errors.push("Укажите корректное имя");
  }
  if (
    !data.email ||
    typeof data.email !== "string" ||
    !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)
  ) {
    errors.push("Укажите корректный email");
  }
  if (data.phone && !/^\+?[\d\s\-\(\)]{7,}$/.test(data.phone)) {
    errors.push("Укажите корректный телефон");
  }
  if (data.excursionDate && isNaN(Date.parse(data.excursionDate))) {
    errors.push("Некорректная дата экскурсии");
  }
  if (data.groupSize && (isNaN(Number(data.groupSize)) || Number(data.groupSize) <= 0)) {
    errors.push("Некорректный размер группы");
  }
  if ((data.message && typeof data.message !== "string") || (data.message && data.message.length > 1000)) {
    errors.push("Комментарий слишком длинный");
  }
  return errors;
}

router.post("/api/feedback", async (req, res): Promise<any> => {
  const errors = validateForm(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Сохраняем в базу
    const request = await prisma.excursionRequest.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || null,
        message: req.body.message || null,
        excursionDate: req.body.excursionDate
          ? new Date(req.body.excursionDate)
          : null,
        groupSize: req.body.groupSize ? Number(req.body.groupSize) : null,
      },
    });

    // Отправляем уведомление на email
    await transporter.sendMail({
      from: '"Сайт музея" <vadim120903@gmail.com>',
      to: "yak414832@gmail.com",
      subject: "Новая заявка на экскурсию",
      text: `
Имя: ${request.name}
Email: ${request.email}
Телефон: ${request.phone || "-"}
Дата экскурсии: ${request.excursionDate ? request.excursionDate.toISOString().slice(0,10) : "-"}
Размер группы: ${request.groupSize || "-"}
Сообщение: ${request.message || "-"}
Дата заявки: ${request.createdAt.toLocaleString()}
      `,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("Ошибка:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;