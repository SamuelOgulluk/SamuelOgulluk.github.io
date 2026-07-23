import React from 'react';
import type { SectionId } from '@/types';
import { useLanguage } from '@/App';

interface NavbarProps {
  activeSection: SectionId;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const navItems = [
    { id: 'home' as SectionId, label: t.nav.home },
    { id: 'about' as SectionId, label: t.nav.about },
    { id: 'skills' as SectionId, label: t.nav.skills },
    { id: 'experience' as SectionId, label: t.nav.experience },
    { id: 'education' as SectionId, label: t.nav.education },
    { id: 'projects' as SectionId, label: t.nav.projects },
    { id: 'contact' as SectionId, label: t.nav.contact },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-[rgba(15,23,22,0.78)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-end gap-4 px-4 md:h-16 md:px-6 lg:justify-between">
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-2.5 -bottom-0.5 h-px origin-left bg-accent animate-[underline-grow_280ms_ease-out]" />
                  )}
                </a>
              );
            })}
          </nav>

          <button
            onClick={toggleLanguage}
            className="rounded-[2px] border border-line bg-[rgba(244,239,230,0.06)] px-2.5 py-1 text-xs font-semibold tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>

      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-line bg-[rgba(15,23,22,0.9)] backdrop-blur-md lg:hidden"
        aria-label="Mobile"
      >
        <div className="flex h-14 items-stretch justify-between overflow-x-auto px-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex min-w-[3.25rem] flex-1 flex-col items-center justify-center px-1 text-[10px] font-semibold uppercase tracking-wide ${
                  isActive ? 'text-accent' : 'text-muted'
                }`}
              >
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
