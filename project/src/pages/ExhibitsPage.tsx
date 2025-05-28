import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Exhibit, FilterOptions } from '../types';

const ExhibitsPage: React.FC = () => {
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [filteredExhibits, setFilteredExhibits] = useState<Exhibit[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    yearFrom: 1950,
    yearTo: 2025,
    searchQuery: ''
  });

  // Получаем экспонаты из API (Prisma)
  useEffect(() => {
    fetch('http://localhost:3001/api/exhibits')
      .then(res => res.json())
      .then(data => {
        setExhibits(data);
        setFilteredExhibits(data);
        // Обновим диапазон лет по данным из БД
        if (data.length > 0) {
          const years = data.map((ex: Exhibit) => ex.year).filter(Boolean);
          const minYear = Math.min(...years);
          const maxYear = Math.max(...years);
          setFilters(prev => ({
            ...prev,
            yearFrom: minYear,
            yearTo: maxYear
          }));
        }
      });
    // eslint-disable-next-line
  }, []);

  // Пересчитать фильтры при изменении фильтров или exhibits
  useEffect(() => {
    let result = [...exhibits];

    // Фильтр по поисковому запросу
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(exhibit =>
        exhibit.name.toLowerCase().includes(query) ||
        (exhibit.description?.toLowerCase().includes(query) ?? false)
      );
    }

    // Фильтр по категории
    if (filters.category && filters.category !== 'Все категории') {
      result = result.filter(exhibit => exhibit.category === filters.category);
    }

    // Фильтр по диапазону лет
    result = result.filter(exhibit =>
      exhibit.year >= filters.yearFrom && exhibit.year <= filters.yearTo
    );

    setFilteredExhibits(result);
  }, [filters, exhibits]);

  // Категории из БД
  const categories = ['Все категории', ...Array.from(new Set(exhibits.map(exhibit => exhibit.category).filter(Boolean)))];

  // Диапазон лет из БД
  const minYear = exhibits.length > 0 ? Math.min(...exhibits.map(e => e.year).filter(Boolean)) : 1950;
  const maxYear = exhibits.length > 0 ? Math.max(...exhibits.map(e => e.year).filter(Boolean)) : 2025;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value }));
  };

  const handleYearFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFilters(prev => ({ ...prev, yearFrom: value }));
  };

  const handleYearToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFilters(prev => ({ ...prev, yearTo: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      yearFrom: minYear,
      yearTo: maxYear,
      searchQuery: ''
    });
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4 text-white">Экспонаты музея и самолёты</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Исследуйте нашу коллекцию уникальных экспонатов, отражающих богатую историю 
            авиационного завода "Авиастар" и производимой им авиационной техники.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="bg-white py-6 shadow-md sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск экспонатов..."
                className="input pl-10 pr-4 py-2 w-full"
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Filters Toggle Button (Mobile) */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden btn btn-outline flex items-center justify-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
              {(filters.category || filters.yearFrom > minYear || filters.yearTo < maxYear) && (
                <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ✓
                </span>
              )}
            </button>
            
            {/* Desktop Filters */}
            <div className="hidden md:flex items-center space-x-4">
              <select
                className="input py-2"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                <option value="">Все категории</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  className="input py-2 w-24"
                  placeholder="Год от"
                  min={minYear}
                  max={maxYear}
                  value={filters.yearFrom}
                  onChange={handleYearFromChange}
                />
                <span>—</span>
                <input
                  type="number"
                  className="input py-2 w-24"
                  placeholder="Год до"
                  min={minYear}
                  max={maxYear}
                  value={filters.yearTo}
                  onChange={handleYearToChange}
                />
              </div>
              
              {(filters.category || filters.yearFrom > minYear || filters.yearTo < maxYear) && (
                <button
                  onClick={resetFilters}
                  className="btn btn-outline flex items-center py-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Сбросить
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile Filters */}
          {isFilterOpen && (
            <div className="md:hidden mt-4 p-4 bg-slate-50 rounded-md scale-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                  <select
                    className="input py-2 w-full"
                    value={filters.category}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Все категории</option>
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Годы</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      className="input py-2 w-full"
                      placeholder="Год от"
                      min={minYear}
                      max={maxYear}
                      value={filters.yearFrom}
                      onChange={handleYearFromChange}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      className="input py-2 w-full"
                      placeholder="Год до"
                      min={minYear}
                      max={maxYear}
                      value={filters.yearTo}
                      onChange={handleYearToChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="btn btn-outline flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Сбросить фильтры
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Exhibits Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          {filteredExhibits.length > 0 ? (
            <>
              <p className="mb-6 text-slate-600">Найдено самолётов и экспонатов: {filteredExhibits.length}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredExhibits.map(exhibit => (
                  <Link key={exhibit.id} to={`/exhibits/${exhibit.id}`} className="card group">
                    <div className="overflow-hidden h-64">
                      <img 
                        src={exhibit.imageUrl} 
                        alt={exhibit.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {exhibit.category}
                        </span>
                        <span className="text-slate-500">{exhibit.year} г.</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-700 transition-colors">
                        {exhibit.name}
                      </h3>
                      <p className="text-slate-600 line-clamp-3">{exhibit.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-2">Экспонаты не найдены</h3>
              <p className="text-slate-600 mb-6">
                По вашему запросу не найдено ни одного экспоната. Попробуйте изменить параметры поиска.
              </p>
              <button onClick={resetFilters} className="btn btn-primary">
                Сбросить все фильтры
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExhibitsPage;