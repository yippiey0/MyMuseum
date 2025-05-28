import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plane, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated} = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container py-4 mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Plane className="w-8 h-8 text-blue-700" />
            <span className="text-xl font-bold text-slate-900">Авиастар Музей</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${location.pathname === '/' ? 'text-blue-700 font-medium' : 'text-slate-700 hover:text-blue-700'}`}
            >
              Главная
            </Link>
            <Link 
              to="/exhibits" 
              className={`transition-colors ${location.pathname.includes('/exhibits') ? 'text-blue-700 font-medium' : 'text-slate-700 hover:text-blue-700'}`}
            >
              Экспонаты и самолёты
            </Link>
            <Link 
              to="/history" 
              className={`transition-colors ${location.pathname === '/history' ? 'text-blue-700 font-medium' : 'text-slate-700 hover:text-blue-700'}`}
            >
              История
            </Link>
            <Link 
              to="/gallery" 
              className={`transition-colors ${location.pathname === '/gallery' ? 'text-blue-700 font-medium' : 'text-slate-700 hover:text-blue-700'}`}
            >
              Галерея
            </Link>
            <Link 
              to="/people" 
              className={`transition-colors ${location.pathname === '/people' ? 'text-blue-700 font-medium' : 'text-slate-700 hover:text-blue-700'}`}
            >
              Люди
            </Link>
            <Link 
                to="/feedback" 
                className={`py-2 transition-colors ${location.pathname === '/feedback' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Заявка на экскурсию
              </Link>
            {isAuthenticated ? (
              <Link 
                to="/profile" 
                className="btn btn-outline flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Профиль
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Войти
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-900 focus:outline-none" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pt-4 pb-2 scale-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`py-2 transition-colors ${location.pathname === '/' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Главная
              </Link>
              <Link 
                to="/exhibits" 
                className={`py-2 transition-colors ${location.pathname.includes('/exhibits') ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Экспонаты
              </Link>
              <Link 
                to="/history" 
                className={`py-2 transition-colors ${location.pathname === '/history' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                История
              </Link>
              <Link 
                to="/gallery" 
                className={`py-2 transition-colors ${location.pathname === '/gallery' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Галерея
              </Link>
              <Link 
                to="/people" 
                className={`py-2 transition-colors ${location.pathname === '/people' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Люди
              </Link>
              <Link 
                to="/feedback" 
                className={`py-2 transition-colors ${location.pathname === '/feedback' ? 'text-blue-700 font-medium' : 'text-slate-700'}`}
              >
                Заявка на экскурсию
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/profile" 
                  className="btn btn-outline flex items-center justify-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Профиль
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary w-full">
                  Войти
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;