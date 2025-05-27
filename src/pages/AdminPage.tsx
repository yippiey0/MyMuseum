import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/db';
import { Exhibit } from '../types';
import { Pencil, Trash2, Plus } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [editingExhibit, setEditingExhibit] = useState<Exhibit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadExhibits();
  }, []);

  const loadExhibits = async () => {
    try {
      const result = await db.execute('SELECT * FROM exhibits ORDER BY id DESC');
      setExhibits(result.rows as Exhibit[]);
    } catch (error) {
      console.error('Failed to load exhibits:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      if (editingExhibit) {
        await db.execute({
          sql: `
            UPDATE exhibits 
            SET name = ?, description = ?, imageUrl = ?, year = ?, 
                category = ?, technicalDetails = ?, historicalContext = ?,
                updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?
          `,
          args: [
            formData.get('name'),
            formData.get('description'),
            formData.get('imageUrl'),
            Number(formData.get('year')),
            formData.get('category'),
            formData.get('technicalDetails'),
            formData.get('historicalContext'),
            editingExhibit.id
          ]
        });
      } else {
        await db.execute({
          sql: `
            INSERT INTO exhibits (
              name, description, imageUrl, year, category, 
              technicalDetails, historicalContext
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          args: [
            formData.get('name'),
            formData.get('description'),
            formData.get('imageUrl'),
            Number(formData.get('year')),
            formData.get('category'),
            formData.get('technicalDetails'),
            formData.get('historicalContext')
          ]
        });
      }

      setIsModalOpen(false);
      setEditingExhibit(null);
      loadExhibits();
    } catch (error) {
      console.error('Failed to save exhibit:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот экспонат?')) return;

    try {
      await db.execute({
        sql: 'DELETE FROM exhibits WHERE id = ?',
        args: [id]
      });
      loadExhibits();
    } catch (error) {
      console.error('Failed to delete exhibit:', error);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Управление экспонатами</h1>
          <button
            onClick={() => {
              setEditingExhibit(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить экспонат
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Название</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Категория</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Год</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-slate-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {exhibits.map(exhibit => (
                <tr key={exhibit.id}>
                  <td className="px-6 py-4 text-sm text-slate-500">{exhibit.id}</td>
                  <td className="px-6 py-4">{exhibit.name}</td>
                  <td className="px-6 py-4">{exhibit.category}</td>
                  <td className="px-6 py-4">{exhibit.year}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingExhibit(exhibit);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exhibit.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingExhibit ? 'Редактировать экспонат' : 'Добавить экспонат'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Название
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingExhibit?.name}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Описание
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingExhibit?.description}
                      className="input h-24"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      URL изображения
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      defaultValue={editingExhibit?.imageUrl}
                      className="input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Год
                      </label>
                      <input
                        type="number"
                        name="year"
                        defaultValue={editingExhibit?.year}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Категория
                      </label>
                      <input
                        type="text"
                        name="category"
                        defaultValue={editingExhibit?.category}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Технические характеристики
                    </label>
                    <textarea
                      name="technicalDetails"
                      defaultValue={editingExhibit?.technicalDetails}
                      className="input h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Исторический контекст
                    </label>
                    <textarea
                      name="historicalContext"
                      defaultValue={editingExhibit?.historicalContext}
                      className="input h-24"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline"
                  >
                    Отмена
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingExhibit ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;