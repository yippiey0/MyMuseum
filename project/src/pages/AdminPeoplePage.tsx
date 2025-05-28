import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type Person = {
  id: number;
  name: string;
  role?: string;
  years?: string;
  biography?: string;
  achievements?: string;
  imageUrl?: string;
};

const API = 'http://localhost:3001/api/people';

const AdminPeoplePage: React.FC = () => {
  const { token } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [form, setForm] = useState<Partial<Person>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API).then(res => res.json()).then(setPeople);
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
        const newPerson = await res.json();
        setPeople([...people, newPerson]);
        setForm({});
      } else setError('Ошибка при добавлении');
    } catch { setError('Ошибка сети'); }
  };

  const startEdit = (p: Person) => {
    setEditId(p.id);
    setForm(p);
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
        setPeople(people.map(p => p.id === id ? updated : p));
        setEditId(null);
        setForm({});
      } else setError('Ошибка при обновлении');
    } catch { setError('Ошибка сети'); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setPeople(people.filter(p => p.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Люди</h2>
      <div className="mb-4 flex gap-2 flex-wrap">
        <input name="name" className="input" placeholder="Имя" value={form.name || ''} onChange={handleChange} />
        <input name="role" className="input" placeholder="Роль" value={form.role || ''} onChange={handleChange} />
        <input name="years" className="input" placeholder="Годы жизни" value={form.years || ''} onChange={handleChange} />
        <input name="biography" className="input" placeholder="Биография" value={form.biography || ''} onChange={handleChange} />
        <input name="achievements" className="input" placeholder="Достижения" value={form.achievements || ''} onChange={handleChange} />
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
        {people.map(p => (
          <li key={p.id} className="mb-2 flex items-center justify-between border rounded px-3 py-2">
            <div>
              <b>{p.name}</b> — {p.role} {p.years && `(${p.years})`}
              {p.biography && <> — {p.biography}</>}
              {p.achievements && <> — {p.achievements}</>}
              {p.imageUrl && <img src={p.imageUrl} alt="" className="inline-block h-8 ml-2" />}
            </div>
            <div>
              <button className="btn btn-xs btn-primary mr-1" onClick={() => startEdit(p)}>Редактировать</button>
              <button className="btn btn-xs btn-danger" onClick={() => handleDelete(p.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AdminPeoplePage;