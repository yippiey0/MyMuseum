import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Heart } from 'lucide-react';
import exhibits from '../data/exhibits';
import { Exhibit } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ExhibitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, toggleFavorite, getFavorites, addRecentlyViewed } = useAuth();
  
  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [relatedExhibits, setRelatedExhibits] = useState<Exhibit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    
    const exhibitId = parseInt(id || '0', 10);
    const foundExhibit = exhibits.find(e => e.id === exhibitId);
    
    if (foundExhibit) {
      setExhibit(foundExhibit);
      
      const related = exhibits
        .filter(e => e.id !== exhibitId && e.category === foundExhibit.category)
        .slice(0, 3);
      
      setRelatedExhibits(related);

      // Check if exhibit is in favorites
      const favorites = getFavorites();
      setIsFavorite(favorites.includes(exhibitId));

      // Add to recently viewed
      if (isAuthenticated) {
        addRecentlyViewed(exhibitId);
      }
    }
    
    setIsLoading(false);
  }, [id, getFavorites, isAuthenticated, addRecentlyViewed]);

  const handleFavoriteClick = () => {
    if (!exhibit) return;
    toggleFavorite(exhibit.id);
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!exhibit) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Экспонат не найден</h1>
        <p className="text-slate-600 mb-8">
          Запрашиваемый экспонат не существует или был удален.
        </p>
        <Link to="/exhibits" className="btn btn-primary">
          Вернуться к списку экспонатов
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="bg-slate-100 py-3">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Назад к экспонатам и самолётам
          </button>
        </div>
      </div>

      {/* Exhibit Header */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="md:w-1/2 h-[400px] md:h-[500px] rounded-lg overflow-hidden">
              <img 
                src={exhibit.imageUrl} 
                alt={exhibit.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Details */}
            <div className="md:w-1/2">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {exhibit.category}
                </span>
                {isAuthenticated && (
                  <button
                    onClick={handleFavoriteClick}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-100 text-red-500' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{exhibit.name}</h1>
              <p className="text-slate-600 mb-6 text-lg">{exhibit.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-700 mr-2" />
                  <span>Год: <strong>{exhibit.year}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details & Historical Context */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exhibit.technicalDetails && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Технические характеристики</h2>
                <p className="text-slate-600">{exhibit.technicalDetails}</p>
              </div>
            )}
            
            {exhibit.historicalContext && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">Исторический контекст</h2>
                <p className="text-slate-600">{exhibit.historicalContext}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Exhibits */}
      {relatedExhibits.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Похожие экспонаты</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedExhibits.map(related => (
                <Link key={related.id} to={`/exhibits/${related.id}`} className="card group">
                  <div className="overflow-hidden h-48">
                    <img 
                      src={related.imageUrl} 
                      alt={related.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                      {related.category}
                    </span>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-700 transition-colors">
                      {related.name}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ExhibitDetailPage;