import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">Авиастар Музей</span>
            </div>
            <p className="text-slate-300 mb-4">
              Музей филиала ПАО «Ил»-«Авиастар» представляет уникальную коллекцию экспонатов, 
              отражающих богатую историю авиастроения.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">Главная</Link>
              </li>
              <li>
                <Link to="/exhibits" className="text-slate-300 hover:text-white transition-colors">Экспонаты и самолёты</Link>
              </li>
              <li>
                <Link to="/history" className="text-slate-300 hover:text-white transition-colors">История</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-white transition-colors">Галерея</Link>
              </li>
              <li>
                <Link to="/people" className="text-slate-300 hover:text-white transition-colors">Люди</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Авторизация</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-slate-300">432072, Россия, Ульяновская обл., г. Ульяновск, проспект Антонова, 1</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-slate-300">+7 (8422) 28-10-22</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-slate-300">mail@aviastar-sp.ru</span>
              </li>
              <li className="flex items-center">
                <ExternalLink className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                <span className="text-slate-300">https://www.uacrussia.ru/ru/</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>© {currentYear} Музей филиала ПАО «Ил»-«Авиастар». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;