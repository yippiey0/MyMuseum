import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HistoricalEvent } from '../types';
import '../styles/HistoryPage.css';

const HistoryPage: React.FC = () => {
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openedId, setOpenedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/historical-events')
      .then(res => res.json())
      .then(data => {
        setHistoricalEvents(data);
        setLoading(false);
      });
  }, []);

  const sortedEvents = [...historicalEvents].sort((a, b) => {
    return parseInt(a.date, 10) - parseInt(b.date, 10);
  });

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">История филиала ПАО «Ил»-«Авиастар»</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Узнайте о ключевых событиях и этапах развития одного из крупнейших 
            авиастроительных предприятий России.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center">О предприятии</h2>
            <p className="text-lg text-slate-700 mb-4">
              Филиал ПАО «Ил»-«Авиастар» — одно из самых современных самолётостроительных 
              предприятий России, расположенное в Ульяновске. Завод был основан в 1976 году 
              как Ульяновский авиационный промышленный комплекс (УАПК).
            </p>
            <p className="text-lg text-slate-700 mb-4">
              За свою историю предприятие выпустило множество значимых для отечественной 
              авиации самолётов, включая тяжёлые транспортные самолёты Ан-124 «Руслан», 
              пассажирские лайнеры Ту-204 различных модификаций и военно-транспортные 
              самолёты Ил-76МД-90А.
            </p>
            <p className="text-lg text-slate-700">
              В 2021 году АО «Авиастар-СП» вошло в состав ПАО «Ил» в качестве филиала, 
              что стало важным этапом в консолидации авиастроительной отрасли России.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-12 text-center">Ключевые события</h2>
          <div className="max-w-4xl mx-auto timeline-container">
            {loading ? (
              <div className="text-center text-xl text-slate-500 py-8">Загрузка...</div>
            ) : (
              <div className="relative">
                <div className="absolute left-5 top-0 w-1 bg-gradient-to-b from-blue-500 to-blue-300 h-full rounded" />
                <ul className="space-y-10">
                  {sortedEvents.map((event, idx) => (
                    <li
                      key={event.id}
                      className="relative flex items-start group cursor-pointer"
                      onClick={() => setOpenedId(openedId === event.id ? null : event.id)}
                    >
                      <div className="z-10 flex flex-col items-center">
                        <span className={`w-6 h-6 rounded-full border-4 border-blue-500 bg-white flex items-center justify-center transition group-hover:bg-blue-500 group-hover:border-blue-700`}>
                          <span className="block w-2 h-2 rounded-full bg-blue-500 group-hover:bg-white"></span>
                        </span>
                        {idx !== sortedEvents.length - 1 && (
                          <span className="flex-1 w-1 bg-blue-200" style={{ minHeight: 40 }} />
                        )}
                      </div>
                      <div className="ml-6 flex-1 py-2 px-4 rounded-lg transition group-hover:bg-blue-100 group-hover:shadow-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold text-blue-700">{event.date}</span>
                          <svg width="14" height="14" fill="currentColor" className="text-blue-500 group-hover:text-blue-700"><circle cx="7" cy="7" r="7" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-800 transition">{event.title}</h3>
                        <p className="line-clamp-2 text-slate-700">
                          {openedId === event.id
                            ? event.description
                            : event.description.slice(0, 120) + (event.description.length > 120 ? '...' : '')
                          }
                        </p>
                        {event.imageUrl && (
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className={`rounded-lg mt-2 w-full max-w-xs object-cover h-32 transition-all ${openedId === event.id ? 'opacity-100' : 'opacity-70 blur-[2px]'}`}
                            style={{ filter: openedId === event.id ? 'none' : 'blur(2px)' }}
                          />
                        )}
                        <div className="mt-2 text-sm text-blue-600 underline transition">
                          {openedId === event.id ? "Свернуть" : "Подробнее..."}
                        </div>
                        {/* Подробная инфа прямо под элементом */}
                        {openedId === event.id && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-4 shadow-inner animate-fadeIn">
                            <p className="text-slate-800 mb-2">{event.description}</p>
                            {event.imageUrl && (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="rounded-lg w-full object-cover max-h-60 mb-2"
                              />
                            )}
                            {/* Можно добавить больше подробностей, например, ссылки, источники, цитаты */}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Present Day */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-6">Современный день</h2>
            <p className="text-lg text-slate-700 mb-6">
              Сегодня филиал ПАО «Ил»-«Авиастар» продолжает развиваться и играть важную роль 
              в российской авиационной промышленности. Предприятие специализируется на выпуске 
              транспортных самолётов Ил-76МД-90А и участвует в кооперации по производству 
              других типов авиационной техники.
            </p>
            <p className="text-lg text-slate-700 mb-8">
              Музей истории филиала ПАО «Ил»-«Авиастар» сохраняет и популяризирует богатое 
              наследие предприятия, знакомя посетителей с уникальными экспонатами и историями 
              создания легендарных самолётов.
            </p>
            <Link to="/gallery" className="btn btn-primary px-6 py-3 text-lg text-white hover:text-white hover:scale-105 transition-transform">
              Посмотреть фотогалерею
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;