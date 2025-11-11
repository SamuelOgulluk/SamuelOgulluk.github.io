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
    { id: 'home' as SectionId, label: t.nav.home, iconName: 'home.svg' },
    { id: 'about' as SectionId, label: t.nav.about, iconName: 'user-circle' },
    { id: 'skills' as SectionId, label: t.nav.skills, iconName: 'code-bracket' },
    { id: 'experience' as SectionId, label: t.nav.experience, iconName: 'briefcase' },
    { id: 'education' as SectionId, label: t.nav.education, iconName: 'academic-cap' },
    { id: 'projects' as SectionId, label: t.nav.projects, iconName: 'folder' },
    { id: 'contact' as SectionId, label: t.nav.contact, iconName: 'mail' },
  ];

  return (
    <nav className="fixed top-0 left-0 h-full w-24 bg-zinc-900/80 backdrop-blur-sm border-r border-zinc-800 flex flex-col items-center justify-between py-10">
      <div className="flex flex-col items-center gap-6">
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
            <Icon name={item.iconName} className="w-8 h-8 mb-1" />
            <span className="text-xs font-medium tracking-wider uppercase">{item.label}</span>
          </a>
        ))}
      </div>
       <button
        onClick={toggleLanguage}
        className="group relative"
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