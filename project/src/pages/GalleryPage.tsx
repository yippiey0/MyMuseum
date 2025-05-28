import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';
import { GallerySwiper } from "../components/GallerySwiper";

const categories = [
  { id: 'all', name: 'Все фотографии' },
  { id: 'factory', name: 'Филиал ПАО "Ил"-Авиастар' },
  { id: 'museum', name: 'Музей' },
  { id: 'archive', name: 'Архив' },
  { id: 'history', name: 'История' }
];

const GalleryPage: React.FC = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'factory' | 'museum' | 'archive' | 'history'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Получаем галерею из API (Prisma)
  useEffect(() => {
    fetch('http://localhost:3001/api/gallery')
      .then(res => res.json())
      .then(data => {
        setGalleryImages(data);
        setLoading(false);
      });
  }, []);

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (idx: number) => setSelectedIndex(idx);
  const closeModal = () => setSelectedIndex(null);

  if (loading) {
    return <div className="text-center py-12 text-xl">Загрузка...</div>;
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">Фотогалерея</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Исторические фотографии и современные снимки, отражающие богатую историю 
            и текущую деятельность филиала ПАО "Ил"-Авиастар.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white py-6 shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredImages.map((image: GalleryImage, idx) => (
                <div 
                  key={image.id} 
                  className="card group cursor-pointer"
                  onClick={() => openModal(idx)}
                >
                  <div className="overflow-hidden h-64">
                    <img 
                      src={image.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={image.category}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xl text-slate-500">
              Нет фотографий для выбранной категории.
            </div>
          )}
        </div>
      </section>

      {/* Swiper Modal */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-7xl w-full mx-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
              onClick={closeModal}
            >
              ×
            </button>
            <GallerySwiper
              images={filteredImages.map(img => img.imageUrl)}
              captions={filteredImages.map(img => img.caption ?? "")}
              initialIndex={selectedIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;