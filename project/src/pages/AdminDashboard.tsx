import React, { useState } from 'react';
import AdminExhibitsPage from './AdminExhibitsPage';
import AdminGalleryPage from './AdminGalleryPage';
import AdminEventsPage from './AdminEventsPage';
import AdminPeoplePage from './AdminPeoplePage';
import AdminUsersPage from './AdminUsersPage';

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<'exhibits'|'gallery'|'events'|'people'|'users'>('exhibits');
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
      <div className="mb-6 space-x-2">
        <button className={`btn ${tab === 'exhibits' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('exhibits')}>Экспонаты</button>
        <button className={`btn ${tab === 'gallery' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('gallery')}>Галерея</button>
        <button className={`btn ${tab === 'events' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('events')}>События</button>
        <button className={`btn ${tab === 'people' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('people')}>Люди</button>
        <button className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')}>Пользователи</button>
      </div>
      {tab === 'exhibits' && <AdminExhibitsPage />}
      {tab === 'gallery' && <AdminGalleryPage />}
      {tab === 'events' && <AdminEventsPage />}
      {tab === 'people' && <AdminPeoplePage />}
      {tab === 'users' && <AdminUsersPage />}
    </div>
  );
};
export default AdminDashboard;