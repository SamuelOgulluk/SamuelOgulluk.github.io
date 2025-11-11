import React from 'react';
import { useLanguage } from '../App';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  return (
    <header className="p-6 bg-slate-800 border-b border-slate-700/50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t.headerTitle}</h1>
          <p className="text-sm text-cyan-400">{t.headerSubtitle}</p>
        </div>
        <button
          onClick={toggleLanguage}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 text-sm"
        >
          {language === 'en' ? 'FR' : 'EN'}
        </button>
      </div>
    </header>
  );
};

export default Header;
