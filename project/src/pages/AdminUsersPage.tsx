import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
};

const API = 'http://localhost:3001/api/users';

const AdminUsersPage: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [token]);

  const changeRole = async (id: number, role: 'user' | 'admin') => {
    if (!window.confirm('Изменить роль пользователя?')) return;
    const res = await fetch(`${API}/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    } else {
      setError('Ошибка при изменении роли');
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm('Удалить пользователя?')) return;
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) setUsers(users.filter(u => u.id !== id));
    else setError('Ошибка удаления');
  };

  if (!user || user.role !== 'admin') return <div>Доступ только для администратора.</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Пользователи</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <table className="min-w-full border mb-4">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Имя</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Роль</th>
            <th className="border px-2 py-1">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.username}</td>
              <td className="border px-2 py-1">{u.email}</td>
              <td className="border px-2 py-1">{u.role}</td>
              <td className="border px-2 py-1">
                {u.role === 'user' &&
                  <button className="btn btn-xs btn-success mr-2" onClick={() => changeRole(u.id, 'admin')}>Сделать админом</button>
                }
                {u.role === 'admin' &&
                  <button className="btn btn-xs btn-warning mr-2" onClick={() => changeRole(u.id, 'user')}>Сделать обычным</button>
                }
                {u.id !== user.id && (
                  <button className="btn btn-xs btn-danger" onClick={() => deleteUser(u.id)}>Удалить</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <div className="text-slate-500">Нет пользователей.</div>}
    </div>
  );
};

export default AdminUsersPage;