import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Clock, MapPin, AlertCircle, Info } from 'lucide-react';
import exhibits from '../data/exhibits';

const heroImages = [
  '/src/images/nnvkpxlv6zstudqmdlka.jpg',
  '/src/images/DSC01957.JPG',
  '/src/images/scale_1200.jpg',
  '/src/images/126796_big.jpg'
];

const HomePage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const featuredExhibits = [...exhibits].sort(() => 0.5 - Math.random()).slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${image})`,
              backgroundBlendMode: 'overlay',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              opacity: index === currentImageIndex ? 1 : 0,
              zIndex: index === currentImageIndex ? 1 : 0
            }}
          />
        ))}
        <div className="relative container mx-auto px-4 h-full flex items-center text-white z-10">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white animate-fade-in">
              Музей филиала<br />ПАО «Ил»-«Авиастар»
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl text-slate-200 animate-slide-up">
              Погрузитесь в увлекательную историю авиастроения и узнайте о 
              легендарных самолётах, созданных на Ульяновском авиационном заводе.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up">
              <Link to="/exhibits" className="btn btn-primary px-6 py-3 text-lg text-white hover:text-white hover:scale-105 transition-transform">
                Посмотреть экспонаты
              </Link>
              <Link to="/history" className="btn btn-primary px-6 py-3 text-lg text-white hover:text-white hover:scale-105 transition-transform">
                Узнать историю
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Museum Rules Section */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Правила поведения в музее</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="flex items-start mb-4">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold">Запрещено</h3>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Прикасаться к экспонатам
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Проносить еду и напитки
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Использовать вспышку при фотосъемке
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Шуметь и бегать по залам
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="flex items-start mb-4">
                <Info className="w-8 h-8 text-blue-500 mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold">Рекомендации</h3>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Следовать указаниям экскурсовода
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Соблюдать тишину во время экскурсии
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Задавать вопросы после рассказа
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Сдавать верхнюю одежду в гардероб
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="flex items-start mb-4">
                <Clock className="w-8 h-8 text-green-500 mr-3 flex-shrink-0" />
                <h3 className="text-xl font-semibold">Организация посещения</h3>
              </div>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Приходить за 10-15 минут до начала
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Записываться на экскурсии заранее
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Групповые посещения по договоренности
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Иметь при себе документ для входа
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <Search className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Уникальные экспонаты</h3>
              <p className="text-slate-600">
                Более 500 экспонатов, представляющих историю авиационного завода и производимой техники.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Часы работы</h3>
              <p className="text-slate-600">
                Уточнять у организатора
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
              <MapPin className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Как добраться</h3>
              <p className="text-slate-600">
                432072, г. Ульяновск, пр-т Антонова, 1<br />
                Автобусы: 14, 15, 30, 47, 78, 82, 84
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Exhibits */}
      <section className="py-16 bg-gradient-to-t from-slate-100 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Уникальные экспонаты</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Познакомьтесь с самыми интересными экспонатами нашей коллекции, 
              каждый из которых имеет свою уникальную историю.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredExhibits.map(exhibit => (
              <div key={exhibit.id} className="card group transform hover:-translate-y-1 transition-all duration-300">
                <div className="overflow-hidden h-64">
                  <img 
                    src={exhibit.imageUrl} 
                    alt={exhibit.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                    {exhibit.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">{exhibit.name}</h3>
                  <p className="text-slate-600 mb-4 line-clamp-3">{exhibit.description}</p>
                  <Link 
                    to={`/exhibits/${exhibit.id}`} 
                    className="inline-flex items-center font-medium text-blue-700 hover:text-blue-800 group-hover:translate-x-2 transition-transform"
                  >
                    Подробнее <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/exhibits" 
              className="btn btn-primary px-6 py-3 text-lg text-white hover:text-white hover:scale-105 transition-transform"
            >
              Смотреть все экспонаты
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Станьте частью нашего сообщества</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Зарегистрируйтесь на нашем сайте, чтобы получать уведомления о новых 
            экспонатах и мероприятиях, а также создавать списки избранных экспонатов.
          </p>
          <Link 
            to="/register" 
            className="btn bg-white text-blue-700 hover:bg-slate-100 px-6 py-3 text-lg hover:scale-105 transition-transform"
          >
            Регистрация
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;