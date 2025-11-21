import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import type { Language, SectionId, TranslationContent } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './src/components/Navbar';
import Home from './src/components/Home';
import About from './src/components/About';
import Skills from './src/components/Skills';
import Experience from './src/components/Experience';
import Projects from './src/components/Projects';
import BackgroundAnimation from './src/components/BackgroundAnimation';
import Contact from './src/components/Contact';
import Education from './src/components/Education';
import AnimatedSection from './src/components/AnimatedSection';

// Language Context
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
      { rootMargin: '-50% 0px -50% 0px' } // Set active when section is in the vertical center
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
      <BackgroundAnimation />
      <div className="bg-zinc-950/75 font-sans text-slate-300">
        <Navbar activeSection={activeSection} />
        <div className="pb-24 md:pb-0 md:pl-24">
            <main className="max-w-4xl mx-auto p-6 md:p-12">
                <div className="space-y-16">
                    <Home />
                    <AnimatedSection id="about"><About /></AnimatedSection>
                    <AnimatedSection id="skills"><Skills /></AnimatedSection>
                </div>
                <div className="space-y-8"> {/* Reduced space between experience and education */}
                    <AnimatedSection id="experience"><Experience /></AnimatedSection>
                    <AnimatedSection id="education"><Education /></AnimatedSection>
                </div>
                <div className="space-y-16 mt-16">
                    <AnimatedSection id="projects"><Projects /></AnimatedSection>
                    <AnimatedSection id="contact"><Contact /></AnimatedSection>
                </div>
            </main>
        </div>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;