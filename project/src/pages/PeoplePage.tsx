import React from 'react';
import people from '../data/people';

const PeoplePage: React.FC = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {people.map(person => (
              <div key={person.id} className="card">
                <div className="overflow-hidden h-96">
                  <img 
                    src={person.imageUrl} 
                    alt={person.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                  <p className="text-blue-700 font-medium mb-1">{person.role}</p>
                  <p className="text-slate-500 text-sm mb-4">{person.years}</p>
                  <p className="text-slate-600 mb-4">{person.biography}</p>
                  <div>
                    <h4 className="font-medium mb-2">Достижения:</h4>
                    <ul className="list-disc list-inside text-slate-600">
                      {person.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeoplePage;