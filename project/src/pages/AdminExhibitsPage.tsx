import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Exhibit = {
  id: number;
  name: string;
  description: string;
  year?: number;
  category?: string;
};

const API = 'http://localhost:3001/api/exhibits';

const AdminExhibitsPage: React.FC = () => {
  const { token } = useAuth();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [form, setForm] = useState<Partial<Exhibit>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setExhibits);
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
        const newExhibit = await res.json();
        setExhibits([...exhibits, newExhibit]);
        setForm({});
      } else setError('Ошибка при добавлении');
    } catch { setError('Ошибка сети'); }
  };

  const startEdit = (ex: Exhibit) => {
    setEditId(ex.id);
    setForm(ex);
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
        setExhibits(exhibits.map(e => e.id === id ? updated : e));
        setEditId(null);
        setForm({});
      } else setError('Ошибка при обновлении');
    } catch { setError('Ошибка сети'); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setExhibits(exhibits.filter(e => e.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Экспонаты</h2>
      <div className="mb-4 flex gap-2">
        <input name="name" className="input" placeholder="Название" value={form.name || ''} onChange={handleChange} />
        <input name="description" className="input" placeholder="Описание" value={form.description || ''} onChange={handleChange} />
        <input name="year" className="input" type="number" placeholder="Год" value={form.year || ''} onChange={handleChange} />
        <input name="category" className="input" placeholder="Категория" value={form.category || ''} onChange={handleChange} />
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
        {exhibits.map(e => (
          <li key={e.id} className="mb-2 flex items-center justify-between border rounded px-3 py-2">
            <div>
              <b>{e.name}</b> ({e.year || '—'}) — {e.category || 'Без категории'} — {e.description}
            </div>
            <div>
              <button className="btn btn-xs btn-primary mr-2" onClick={() => startEdit(e)}>Редактировать</button>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(e.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AdminExhibitsPage;