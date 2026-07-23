import React from 'react';
import { useLanguage } from '@/App';
import { LANGUAGES_DATA, SOFTWARE_DATA } from '@/constants';

const Skills: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">02</p>
      <h2 className="section-title">{t.skills.title}</h2>

      <div className="space-y-10">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-muted">
            {t.skills.languages}
          </h3>
          <ul className="stagger grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {LANGUAGES_DATA.map((skill) => (
              <li key={skill.name} className="group relative">
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-1 text-ink transition-colors hover:text-accent"
                >
                  <img
                    src={`/assets/${skill.icon}`}
                    alt=""
                    className="h-7 w-7 object-contain opacity-90"
                  />
                  <span className="text-sm font-medium md:text-[0.95rem]">{skill.name}</span>
                </a>
                {skill.libraries && (
                  <div className="pointer-events-none absolute left-0 top-full z-20 mt-1 hidden min-w-[10rem] border border-line bg-paper p-3 shadow-lg shadow-black/30 group-hover:pointer-events-auto group-hover:block">
                    <div className={`grid gap-2 ${skill.libraries.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {skill.libraries.map((lib) => (
                        <a
                          key={lib.name}
                          href={lib.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1 text-muted transition-colors hover:text-accent"
                        >
                          <img src={`/assets/${lib.icon}`} alt="" className="h-7 w-7 object-contain" />
                          <span className="text-[11px]">{lib.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-muted">
            {t.skills.software}
          </h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-4">
            {SOFTWARE_DATA.map((software) => (
              <li key={software.name}>
                <a
                  href={software.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-1 text-ink transition-colors hover:text-accent"
                >
                  <img
                    src={`/assets/${software.icon}`}
                    alt=""
                    className="h-7 w-7 object-contain opacity-90"
                    style={{ transform: `scale(${software.scale || 1})` }}
                  />
                  <span className="text-sm font-medium md:text-[0.95rem]">{software.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Skills;
