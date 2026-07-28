import React from 'react';
import type { AppView, SectionId } from '@/types';
import { useLanguage } from '@/App';

interface NavbarProps {
  activeSection: SectionId;
  view: AppView;
  onViewChange: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, view, onViewChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const navItems = [
    { id: 'home' as SectionId, label: t.nav.home, short: language === 'fr' ? 'Accueil' : 'Home' },
    { id: 'experience' as SectionId, label: t.nav.experience, short: language === 'fr' ? 'Exp.' : 'Work' },
    { id: 'education' as SectionId, label: t.nav.education, short: language === 'fr' ? 'Form.' : 'Edu' },
    { id: 'skills' as SectionId, label: t.nav.skills, short: language === 'fr' ? 'Comp.' : 'Skills' },
    { id: 'projects' as SectionId, label: t.nav.projects, short: language === 'fr' ? 'Projets' : 'Projects' },
    { id: 'contact' as SectionId, label: t.nav.contact, short: language === 'fr' ? 'Contact' : 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-[rgba(251,253,251,0.9)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="app-tabs" role="tablist" aria-label="Views">
              <button
                type="button"
                role="tab"
                aria-selected={view === 'portfolio'}
                className={`app-tab ${view === 'portfolio' ? 'is-active' : ''}`}
                onClick={() => onViewChange('portfolio')}
              >
                {t.tabs.portfolio}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'utility'}
                className={`app-tab ${view === 'utility' ? 'is-active' : ''}`}
                onClick={() => onViewChange('utility')}
              >
                {t.tabs.utility}
              </button>
              <a
                href="https://samuelogulluk.github.io/lutra/"
                className="app-tab"
                role="tab"
                aria-selected={false}
              >
                {t.tabs.music}
              </a>
            </div>

            {view === 'portfolio' && (
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
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="shrink-0 rounded-[2px] border border-line bg-white/70 px-2.5 py-1 text-xs font-semibold tracking-wide text-ink transition-colors hover:border-accent hover:text-accent"
            aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>

      {view === 'portfolio' && (
        <nav
          className="fixed bottom-0 inset-x-0 z-50 border-t border-line bg-[rgba(251,253,251,0.96)] backdrop-blur-md lg:hidden safe-bottom"
          aria-label="Mobile"
        >
          <div className="mx-auto grid h-14 max-w-lg grid-cols-6 gap-0 px-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`flex min-h-[44px] flex-col items-center justify-center px-0.5 text-center text-[11px] font-semibold leading-tight ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                >
                  <span className="max-w-full truncate">{item.short}</span>
                  {isActive && <span className="mt-0.5 h-0.5 w-4 rounded-full bg-accent" />}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
