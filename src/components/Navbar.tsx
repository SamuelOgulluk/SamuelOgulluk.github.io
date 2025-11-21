import React from 'react';
import type { SectionId } from '@/types';
import { useLanguage } from '@/App';
import Icon from './Icon';

interface NavbarProps {
  activeSection: SectionId;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  const navItems = [
    { id: 'home' as SectionId, label: t.nav.home, iconName: 'home' },
    { id: 'about' as SectionId, label: t.nav.about, iconName: 'about' },
    { id: 'skills' as SectionId, label: t.nav.skills, iconName: 'skills' },
    { id: 'experience' as SectionId, label: t.nav.experience, iconName: 'experience' },
    { id: 'education' as SectionId, label: t.nav.education, iconName: 'education' },
    { id: 'projects' as SectionId, label: t.nav.projects, iconName: 'projects' },
    { id: 'contact' as SectionId, label: t.nav.contact, iconName: 'contact' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 z-50 md:top-0 md:left-0 md:h-full md:w-24 md:bg-zinc-900/80 md:border-r md:border-t-0 md:flex md:flex-col md:items-center md:justify-between md:py-10">
      <div className="flex flex-row items-center justify-around w-full h-full md:flex-col md:justify-start md:gap-6 md:h-auto">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center transition-colors duration-200 group ${
              activeSection === item.id
                ? 'text-red-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon name={item.iconName} className="w-6 h-6 md:w-8 md:h-8 mb-1" />
            <span className="text-[10px] md:text-xs font-medium tracking-wider uppercase hidden md:block">{item.label}</span>
          </a>
        ))}
        
        {/* Mobile Language Switcher - Integrated into the nav items row if needed, or separate */}
        <button
            onClick={toggleLanguage}
            className="md:hidden flex flex-col items-center justify-center text-slate-400 hover:text-white"
            aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
        >
             <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-600">
                <img src={`/assets/${language === 'en' ? 'uk-flag' : 'france-flag'}.svg`} alt={language === 'en' ? 'UK Flag' : 'French Flag'} className="w-full h-full object-cover" />
             </div>
             <span className="text-[10px] font-medium tracking-wider uppercase mt-1">{language === 'en' ? 'EN' : 'FR'}</span>
        </button>
      </div>

       <button
        onClick={toggleLanguage}
        className="hidden md:block group relative"
        aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
      >
        <div className="w-10 h-10 p-1 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
          <img src={`/assets/${language === 'en' ? 'uk-flag' : 'france-flag'}.svg`} alt={language === 'en' ? 'UK Flag' : 'French Flag'} className="rounded-full" />
        </div>
        <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          {language === 'en' ? 'Français' : 'English'}
        </span>
      </button>
    </nav>
  );
};

export default Navbar;