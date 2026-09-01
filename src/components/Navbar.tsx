import React from 'react';
import { useLanguage } from '@/App';

const Navbar = ({ view, onViewChange }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="hud hud-thin">
      {view === 'utility' && (
        <button type="button" className="lang-btn" onClick={() => onViewChange('portfolio')}>
          {t.den.back}
        </button>
      )}
      {view === 'portfolio' && (
        <a
          href="https://samuelogulluk.github.io/lutra/"
          className="lang-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.tabs.music}
        </a>
      )}
      <button
        onClick={() => setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'))}
        className="lang-btn"
        aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
      >
        {language === 'en' ? 'FR' : 'EN'}
      </button>
    </header>
  );
};

export default Navbar;
