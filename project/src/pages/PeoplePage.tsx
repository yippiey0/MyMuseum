import React, { useEffect, useState } from 'react';
import { Person } from '../types';

const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  // Получаем людей из API (Prisma)
  useEffect(() => {
    fetch('http://localhost:3001/api/people')
      .then(res => res.json())
      .then(data => {
        setPeople(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">Люди завода</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Знакомьтесь с выдающимися личностями, внесшими значительный вклад в развитие 
            филиала ПАО "Ил"-Авиастар и авиационной промышленности.
          </p>
        </div>
      </section>

      {/* People Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12 text-xl text-slate-500">Загрузка...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {people.map(person => {
                // Универсальная обработка achievements: если строка — превращаем в массив;
                // если массив — используем как есть; если пусто — []
                const achievementsArr = Array.isArray(person.achievements)
                  ? person.achievements
                  : typeof person.achievements === "string" && person.achievements.length > 0
                    ? person.achievements.split(',').map(s => s.trim())
                    : [];

                return (
                  <div key={person.id} className="card">
                    <div className="overflow-hidden h-96">
                      {person.imageUrl && (
                        <img 
                          src={person.imageUrl} 
                          alt={person.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                      {person.role && <p className="text-blue-700 font-medium mb-1">{person.role}</p>}
                      {person.years && <p className="text-slate-500 text-sm mb-4">{person.years}</p>}
                      {person.biography && <p className="text-slate-600 mb-4">{person.biography}</p>}
                      {achievementsArr.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Достижения:</h4>
                          <ul className="list-disc list-inside text-slate-600">
                            {achievementsArr.map((achievement, index) => (
                              <li key={index}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PeoplePage;