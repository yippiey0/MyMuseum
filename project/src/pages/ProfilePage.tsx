import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Heart, Clock } from 'lucide-react';
import { Exhibit } from '../types';

const API_URL = 'http://localhost:3001/api/exhibits';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, getFavorites, getRecentlyViewed } = useAuth();
  const [favoriteExhibits, setFavoriteExhibits] = useState<Exhibit[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(API_URL)
        .then(res => res.json())
        .then((data: Exhibit[]) => {
          setLoading(false);

          const favoriteIds: number[] = getFavorites();
          const favExhibits: Exhibit[] = data.filter((exhibit: Exhibit) => favoriteIds.includes(exhibit.id));
          setFavoriteExhibits(favExhibits);

          const recentIds: number[] = getRecentlyViewed();
          const recentExhibits: Exhibit[] = recentIds
            .map((id: number) => data.find((exhibit: Exhibit) => exhibit.id === id))
            .filter((exhibit): exhibit is Exhibit => exhibit !== undefined);
          setRecentlyViewed(recentExhibits);
        });
    }
  }, [isAuthenticated, getFavorites, getRecentlyViewed]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 fade-in">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-4">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.username}</h1>
                  <p className="text-slate-600">{user?.email}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="btn btn-outline flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
          
          {/* Favorite Exhibits */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-6">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Избранные экспонаты</h2>
            </div>
            
            {loading ? (
              <div className="text-slate-500">Загрузка...</div>
            ) : favoriteExhibits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoriteExhibits.map(exhibit => (
                  <Link 
                    key={exhibit.id} 
                    to={`/exhibits/${exhibit.id}`}
                    className="flex bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div className="w-1/3">
                      <img 
                        src={exhibit.imageUrl} 
                        alt={exhibit.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-2/3 p-4">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                        {exhibit.category}
                      </span>
                      <h3 className="font-semibold mb-1 group-hover:text-blue-700 transition-colors">
                        {exhibit.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{exhibit.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">
                У вас пока нет избранных экспонатов. Добавьте экспонаты в избранное, чтобы они отображались здесь.
              </p>
            )}
          </div>
          
          {/* Recently Viewed */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center mb-6">
              <Clock className="w-5 h-5 text-blue-700 mr-2" />
              <h2 className="text-xl font-semibold">Недавно просмотренные</h2>
            </div>
            
            {loading ? (
              <div className="text-slate-500">Загрузка...</div>
            ) : recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentlyViewed.map(exhibit => (
                  <Link 
                    key={exhibit.id} 
                    to={`/exhibits/${exhibit.id}`}
                    className="card group"
                  >
                    <div className="overflow-hidden h-40">
                      <img 
                        src={exhibit.imageUrl} 
                        alt={exhibit.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-blue-700 transition-colors">
                        {exhibit.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{exhibit.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">
                У вас пока нет просмотренных экспонатов. Посещайте страницы экспонатов, чтобы они отображались здесь.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;