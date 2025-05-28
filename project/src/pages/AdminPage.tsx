import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Exhibit {
  id: number;
  name: string;
  description: string;
}

const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Получить экспонаты
  useEffect(() => {
    const fetchExhibits = async () => {
      setLoading(true);
      const res = await fetch('http://localhost:3001/api/exhibits');
      const data = await res.json();
      setExhibits(data);
      setLoading(false);
    };
    fetchExhibits();
  }, []);

  // Добавить экспонат
  const handleAddExhibit = async () => {
    if (!name.trim()) return;
    try {
      setError('');
      const res = await fetch('http://localhost:3001/api/exhibits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        const data = await res.json();
        setExhibits([...exhibits, data]);
        setName('');
        setDescription('');
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка');
      }
    } catch {
      setError('Ошибка сети');
    }
  };

  // Удалить экспонат
  const handleDeleteExhibit = async (id: number) => {
    if (!window.confirm('Удалить экспонат?')) return;
    try {
      await fetch(`http://localhost:3001/api/exhibits/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setExhibits(exhibits.filter(e => e.id !== id));
    } catch {
      setError('Ошибка удаления');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div style={{ padding: 24 }}>Доступ только для администратора.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Управление экспонатами</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Название экспоната"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Описание"
            className="input"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleAddExhibit}>
            Добавить
          </button>
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <ul>
            {exhibits.map(e => (
              <li key={e.id} className="mb-2 flex items-center justify-between border rounded px-3 py-2">
                <div>
                  <span className="font-semibold">{e.name}</span>
                  <span className="ml-2 text-slate-600">{e.description}</span>
                </div>
                <button className="btn btn-xs btn-danger" onClick={() => handleDeleteExhibit(e.id)}>
                  Удалить
                </button>
              </li>
            ))}
            {exhibits.length === 0 && <li className="text-slate-500">Нет экспонатов.</li>}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPage;