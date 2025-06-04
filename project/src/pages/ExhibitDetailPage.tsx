import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, ExternalLink } from 'lucide-react';
import { Exhibit } from '../types';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'react-qr-code';
import Exhibit3DViewer from '../components/Exhibit3DViewer';

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

    fetch(`http://localhost:3001/api/exhibits/${exhibitId}`)
      .then(res => res.ok ? res.json() : null)
      .then((ex: Exhibit | null) => {
        if (ex) {
          setExhibit(ex);

          fetch(`http://localhost:3001/api/exhibits`)
            .then(res => res.json())
            .then((all: Exhibit[]) => {
              const related = all
                .filter(e => e.id !== exhibitId && e.category === ex.category)
                .slice(0, 3);
              setRelatedExhibits(related);
            });

          const favorites = getFavorites();
          setIsFavorite(favorites.includes(exhibitId));

          if (isAuthenticated) {
            addRecentlyViewed(exhibitId);
          }
        } else {
          setExhibit(null);
        }
        setIsLoading(false);
      });
    // eslint-disable-next-line
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

  const exhibitUrl = `${window.location.origin}/exhibits/${exhibit.id}`;
  const wikipediaUrl = `https://ru.wikipedia.org/wiki/${encodeURIComponent(exhibit.name.replace(/ /g, '_'))}`;

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
            {/* Image и QR */}
            <div className="md:w-1/2 rounded-lg flex flex-col items-center">
              <img 
                src={exhibit.imageUrl} 
                alt={exhibit.name} 
                className="w-full h-[350px] object-cover mb-4"
              />
              {exhibit.videoUrl && (
                <div className="w-full flex justify-center mt-4">
                  {exhibit.videoUrl.includes('rutube.ru') ? (
                    <iframe
                      src={exhibit.videoUrl}
                      width="400"
                      height="240"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="rounded-lg shadow"
                      title="Видео экспоната"
                    />
                  ) : (
                    <video
                      src={exhibit.videoUrl}
                      controls
                      className="w-full max-w-md rounded-lg shadow"
                      style={{ maxHeight: 240 }}  
                  >
                    Ваш браузер не поддерживает видео.
                  </video>
                  )}
                </div>
              )}
              {/* QR-код */}
              <div className="flex flex-col items-center mt-4">
                <span className="text-sm text-slate-500 mb-1">Получить больше информации</span>
                <div className="bg-white p-2 rounded shadow">
                  <QRCode value={exhibitUrl} size={80} />
                </div>
                <span className="text-xs text-slate-400 mt-1">Отсканируйте QR-код</span>
              </div>
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{exhibit.name}</h1>
              <p className="text-slate-600 mb-4 text-lg">{exhibit.description}</p>

              {/* Wikipedia link */}
              <div className="mb-6">
                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 underline hover:text-blue-900 transition text-base"
                >
                  <ExternalLink className="w-4 h-4" />
                  Подробнее на Википедии
                </a>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-700 mr-2" />
                  <span>Год: <strong>{exhibit.year}</strong></span>
                </div>
              </div>
              {exhibit.model3dUrl && (
                <div className="mt-6">
                  <h3 className="mb-2 font-semibold">3D модель самолёта</h3>
                  <Exhibit3DViewer url={exhibit.model3dUrl} />
                </div>
              )}
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