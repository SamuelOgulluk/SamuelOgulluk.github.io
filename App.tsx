import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import type { Language, SectionId, TranslationContent } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './src/components/Navbar';
import Home from './src/components/Home';
import About from './src/components/About';
import Skills from './src/components/Skills';
import Experience from './src/components/Experience';
import Projects from './src/components/Projects';
import Contact from './src/components/Contact';
import Education from './src/components/Education';
import AnimatedSection from './src/components/AnimatedSection';

interface LanguageContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: TranslationContent;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const t = useMemo(() => TRANSLATIONS[language], [language]);
  const languageContextValue = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );

    const sections: SectionId[] = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <div className="site-shell font-body text-soft">
        <div className="site-atmosphere" aria-hidden="true" />
        <Navbar activeSection={activeSection} />
        <main className="site-main">
          <Home />
          <AnimatedSection id="about"><About /></AnimatedSection>
          <AnimatedSection id="skills"><Skills /></AnimatedSection>
          <AnimatedSection id="experience"><Experience /></AnimatedSection>
          <AnimatedSection id="education"><Education /></AnimatedSection>
          <AnimatedSection id="projects"><Projects /></AnimatedSection>
          <AnimatedSection id="contact"><Contact /></AnimatedSection>
        </main>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;
