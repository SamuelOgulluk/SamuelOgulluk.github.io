import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import type { AppView, Language, TranslationContent } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './src/components/Navbar';
import PixelDen from './src/components/PixelDen';
import UtilityGate from './src/components/UtilityGate';

interface LanguageContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: TranslationContent;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [view, setView] = useState<AppView>('portfolio');

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className={`site-shell font-body text-soft ${view === 'utility' ? 'is-utility' : ''}`}>
        <Navbar view={view} onViewChange={setView} />
        {view === 'portfolio' ? (
          <div className="den-stage">
            <PixelDen onViewChange={setView} />
          </div>
        ) : (
          <main className="utility-screen">
            <UtilityGate />
          </main>
        )}
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
