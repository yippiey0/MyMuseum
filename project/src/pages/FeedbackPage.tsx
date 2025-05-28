import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  excursionDate: string;
  groupSize: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  excursionDate: "",
  groupSize: "",
};

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Можно добавить валидацию тут
    try {
      // Пример отправки на API 
      const res = await fetch("http://localhost:3001/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ошибка при отправке заявки");
      setSent(true);
      setForm(initialState);
    } catch (e: any) {
      setError(e.message || "Не удалось отправить заявку");
    }
  };

  if (sent)
    return (
      <div className="max-w-xl mx-auto mt-16 bg-green-50 border border-green-300 rounded p-8 text-center text-lg text-green-800 shadow">
        Спасибо, ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.
        <br />
        <button
          className="mt-5 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setSent(false)}
        >
          Отправить ещё
        </button>
      </div>
    );

  return (
    <section className="max-w-xl mx-auto mt-16 bg-white rounded p-8 shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Заявка на экскурсию / Обратная связь</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Ваше имя *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="ФИО"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="example@mail.ru"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Телефон</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+7 (___) ___-__-__"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Дата экскурсии</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="date"
            name="excursionDate"
            value={form.excursionDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Размер группы</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="number"
            name="groupSize"
            min={1}
            value={form.groupSize}
            onChange={handleChange}
            placeholder="Количество человек"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Вопрос или комментарий</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Ваш вопрос или пожелания"
          />
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-5 rounded text-lg font-semibold"
        >
          Отправить
        </button>
      </form>
    </section>
  );
}