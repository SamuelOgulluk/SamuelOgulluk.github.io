import React from 'react';
import { useLanguage } from '@/App';

const Navbar = ({ activeSection, view, onViewChange }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  };

  const navItems = [
    { id: 'home', label: t.nav.home, short: language === 'fr' ? 'Base' : 'Den' },
    { id: 'experience', label: t.nav.experience, short: language === 'fr' ? 'XP' : 'XP' },
    { id: 'education', label: t.nav.education, short: language === 'fr' ? 'École' : 'Edu' },
    { id: 'skills', label: t.nav.skills, short: language === 'fr' ? 'Stuff' : 'Skills' },
    { id: 'projects', label: t.nav.projects, short: language === 'fr' ? 'Build' : 'Build' },
    { id: 'contact', label: t.nav.contact, short: language === 'fr' ? 'Mail' : 'Mail' },
  ];

  return (
    <>
      <header className="hud">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 px-3 md:h-16 md:px-6">
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
              <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`relative px-2 py-1 font-pixel text-sm ${
                        isActive ? 'text-accent' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute inset-x-2 -bottom-0.5 h-[3px] bg-accent-lamp" />
                      )}
                    </a>
                  );
                })}
              </nav>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="lang-btn"
            aria-label={language === 'en' ? 'Switch to French' : 'Switch to English'}
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>

      {view === 'portfolio' && (
        <nav className="dock lg:hidden safe-bottom" aria-label="Mobile">
          <div className="mx-auto grid h-14 max-w-lg grid-cols-6 gap-0 px-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`dock-item ${isActive ? 'is-active' : ''}`}
                >
                  <span className="max-w-full truncate">{item.short}</span>
                  {isActive && <span className="mt-0.5 h-[3px] w-4 bg-accent-lamp" />}
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
