import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import type { AppView, Language, SectionId, TranslationContent } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './src/components/Navbar';
import Home from './src/components/Home';
import Skills from './src/components/Skills';
import Experience from './src/components/Experience';
import Projects from './src/components/Projects';
import Contact from './src/components/Contact';
import Education from './src/components/Education';
import AnimatedSection from './src/components/AnimatedSection';
import YoutubeDownloader from './src/components/YoutubeDownloader';

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

const SECTIONS: SectionId[] = ['home', 'experience', 'education', 'skills', 'projects', 'contact'];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [view, setView] = useState<AppView>('portfolio');

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (view !== 'portfolio') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    for (const id of SECTIONS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [view]);

  const handleViewChange = (next: AppView) => {
    setView(next);
    if (next === 'portfolio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' } as ScrollToOptions);
    }
  };

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className={`site-shell font-body text-soft ${view === 'utility' ? 'is-utility' : ''}`}>
        <div className="site-atmosphere" aria-hidden="true" />
        <div className="site-nature" aria-hidden="true" />
        <Navbar activeSection={activeSection} view={view} onViewChange={handleViewChange} />
        <main className="site-main">
          {view === 'portfolio' ? (
            <>
              <Home />
              <AnimatedSection id="experience"><Experience /></AnimatedSection>
              <AnimatedSection id="education"><Education /></AnimatedSection>
              <AnimatedSection id="skills"><Skills /></AnimatedSection>
              <AnimatedSection id="projects"><Projects /></AnimatedSection>
              <AnimatedSection id="contact"><Contact /></AnimatedSection>
            </>
          ) : (
            <YoutubeDownloader />
          )}
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
