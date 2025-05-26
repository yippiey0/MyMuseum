import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 fade-in">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-9xl font-bold text-blue-700 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-6">Страница не найдена</h2>
        <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/" className="btn btn-primary inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;