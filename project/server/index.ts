import express from 'express';
import cors from 'cors';
import exhibitsRouter from './routes/exhibits';
import galleryRouter from './routes/gallery';
import peopleRouter from './routes/people';
import historicalEventsRouter from './routes/historicalEvents';
import authRouter from './routes/auth'
import usersRouter from './routes/users';
import bodyParser from "body-parser";
import feedbackRouter from "./feedback";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Подключаем роутеры
app.use('/api/exhibits', exhibitsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/people', peopleRouter);
app.use('/api/historical-events', historicalEventsRouter);
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter);
app.use(bodyParser.json());
app.post("/api/feedback", (req, res) => {
  // Просто для теста: выведем тело запроса в консоль
  console.log("Получена заявка:", req.body);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});