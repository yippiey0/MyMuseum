import React from 'react';
import { Link } from 'react-router-dom';
import historicalEvents from '../data/historicalEvents';

const HistoryPage: React.FC = () => {
  // Sort events by date
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
            {sortedEvents.map((event) => (
              <div key={event.id} className="timeline-item">
                <div className="mb-1 flex items-center">
                  <span className="text-xl font-bold text-blue-700">{event.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {event.imageUrl && (
                    <div className="md:w-1/3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  )}
                  <div className={event.imageUrl ? 'md:w-2/3' : 'w-full'}>
                    <p className="text-slate-700">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
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