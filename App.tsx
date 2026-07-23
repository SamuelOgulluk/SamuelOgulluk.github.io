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
        <div className="site-foliage" aria-hidden="true">
          <svg viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M160 40c-8 70-70 120-110 150 55 8 100 40 120 90 18-52 70-90 120-100-42-28-98-70-130-140Z" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08"/>
            <path d="M160 150c-6 60-55 100-90 125 45 10 82 38 98 78 16-44 58-78 100-86-36-24-82-60-108-117Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.06"/>
            <path d="M160 240c-5 55-48 90-78 112 38 8 70 34 84 70 14-38 50-68 86-74-30-22-70-54-92-108Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.05"/>
            <path d="M160 40v360" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M160 120c40 20 70 30 95 34M160 180c-38 18-68 28-92 30M160 250c42 16 74 24 100 26M160 310c-36 14-64 22-88 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
            <circle cx="250" cy="90" r="18" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05"/>
            <circle cx="70" cy="200" r="12" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.05"/>
            <path d="M230 340c30 40 20 80-10 110 50-10 80-50 70-95-20 5-40 0-60-15Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.07"/>
          </svg>
        </div>
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
