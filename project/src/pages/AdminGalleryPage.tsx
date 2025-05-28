import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

type GalleryImage = {
  id: number;
  category?: string;
  imageUrl: string;
};

const API = 'http://localhost:3001/api/gallery';

const AdminGalleryPage: React.FC = () => {
  const { token } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [form, setForm] = useState<Partial<GalleryImage>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API).then(res => res.json()).then(setImages);
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
        const newImg = await res.json();
        setImages([...images, newImg]);
        setForm({});
      } else setError('Ошибка при добавлении');
    } catch { setError('Ошибка сети'); }
  };

  const startEdit = (img: GalleryImage) => {
    setEditId(img.id);
    setForm(img);
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
        setImages(images.map(i => i.id === id ? updated : i));
        setEditId(null);
        setForm({});
      } else setError('Ошибка при обновлении');
    } catch { setError('Ошибка сети'); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setImages(images.filter(i => i.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Галерея</h2>
      <div className="mb-4 flex gap-2">
        <input name="category" className="input" placeholder="Категория" value={form.category || ''} onChange={handleChange} />
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="border p-2 rounded relative">
            <img src={img.imageUrl} alt="" className="w-full h-32 object-cover mb-2"/>
            <div>{img.category || 'Без категории'}</div>
            <button className="btn btn-xs btn-primary mr-1" onClick={() => startEdit(img)}>Редактировать</button>
            <button className="btn btn-xs btn-danger" onClick={() => handleDelete(img.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminGalleryPage;