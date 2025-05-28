import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type HistoricalEvent = {
  id: number;
  title: string;
  date?: string;
  description?: string;
  imageUrl?: string;
};

const API = 'http://localhost:3001/api/historicalEvents';

const AdminEventsPage: React.FC = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [form, setForm] = useState<Partial<HistoricalEvent>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API).then(res => res.json()).then(setEvents);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents([...events, newEvent]);
        setForm({});
      } else setError('Ошибка при добавлении');
    } catch { setError('Ошибка сети'); }
  };

  const startEdit = (e: HistoricalEvent) => {
    setEditId(e.id);
    setForm(e);
  };

  const handleUpdate = async (id: number) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents(events.map(ev => ev.id === id ? updated : ev));
        setEditId(null);
        setForm({});
      } else setError('Ошибка при обновлении');
    } catch { setError('Ошибка сети'); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Исторические события</h2>
      <div className="mb-4 flex gap-2">
        <input name="title" className="input" placeholder="Название" value={form.title || ''} onChange={handleChange} />
        <input name="date" className="input" placeholder="Дата (YYYY-MM-DD)" value={form.date || ''} onChange={handleChange} />
        <input name="description" className="input" placeholder="Описание" value={form.description || ''} onChange={handleChange} />
        <input name="imageUrl" className="input" placeholder="URL картинки" value={form.imageUrl || ''} onChange={handleChange} />
        {editId === null ? (
          <button className="btn btn-success" onClick={handleAdd}>Добавить</button>
        ) : (
          <button className="btn btn-primary" onClick={() => handleUpdate(editId)}>Сохранить</button>
        )}
        {editId !== null && (
          <button className="btn btn-outline" onClick={() => { setEditId(null); setForm({}); }}>Отмена</button>
        )}
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul>
        {events.map(e => (
          <li key={e.id} className="mb-2 flex items-center justify-between border rounded px-3 py-2">
            <div>
              <b>{e.title}</b> ({e.date || '—'}) — {e.description}
              {e.imageUrl && <img src={e.imageUrl} alt="" className="inline-block h-8 ml-2" />}
            </div>
            <div>
              <button className="btn btn-xs btn-primary mr-1" onClick={() => startEdit(e)}>Редактировать</button>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(e.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AdminEventsPage;