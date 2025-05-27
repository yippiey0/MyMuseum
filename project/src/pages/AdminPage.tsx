import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Пример структуры экспоната (можно расширить)
interface Exhibit {
  id: number;
  name: string;
  description: string;
}

// Работа с экспонатами через localStorage
const EXHIBITS_KEY = 'exhibits';

const getStoredExhibits = (): Exhibit[] => {
  const exhibits = localStorage.getItem(EXHIBITS_KEY);
  return exhibits ? JSON.parse(exhibits) : [];
};

const saveExhibits = (exhibits: Exhibit[]) => {
  localStorage.setItem(EXHIBITS_KEY, JSON.stringify(exhibits));
};

const AdminPage: React.FC = () => {
  const { user, getUsers, setRole } = useAuth();
  const [exhibits, setExhibits] = useState<Exhibit[]>(getStoredExhibits());
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'exhibits' | 'users'>('exhibits');

  // Работа с экспонатами
  const handleAddExhibit = () => {
    if (!name.trim()) return;
    const newExhibit: Exhibit = {
      id: Date.now(),
      name,
      description,
    };
    const updated = [...exhibits, newExhibit];
    saveExhibits(updated);
    setExhibits(updated);
    setName('');
    setDescription('');
  };

  const handleDeleteExhibit = (id: number) => {
    const updated = exhibits.filter(e => e.id !== id);
    saveExhibits(updated);
    setExhibits(updated);
  };

  // Работа с пользователями
  const [users, setUsers] = useState(getUsers());

  // Обновить роли пользователя
  const handleRoleChange = (id: number, newRole: 'user' | 'admin') => {
    setRole(id, newRole);
    setUsers(getUsers());
  };

  if (!user || user.role !== 'admin') {
    return <div style={{ padding: 24 }}>Доступ только для администратора.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="mb-6">
        <button
          className={`btn mr-2 ${activeTab === 'exhibits' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('exhibits')}
        >
          Экспонаты
        </button>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
      </div>

      {activeTab === 'exhibits' && (
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
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Управление пользователями</h2>
          <table className="min-w-full border mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Имя</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Роль</th>
                <th className="border px-2 py-1">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="border px-2 py-1">{u.name}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">{u.role}</td>
                  <td className="border px-2 py-1">
                    {u.role !== 'admin' && (
                      <button
                        className="btn btn-xs btn-success mr-2"
                        onClick={() => handleRoleChange(u.id, 'admin')}
                      >
                        Сделать админом
                      </button>
                    )}
                    {u.role !== 'user' && (
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => handleRoleChange(u.id, 'user')}
                      >
                        Сделать обычным
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-slate-500">Нет пользователей.</div>}
        </div>
      )}
    </div>
  );
};

export default AdminPage;