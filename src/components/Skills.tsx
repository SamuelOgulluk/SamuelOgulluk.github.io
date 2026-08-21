import React from 'react';
import { useLanguage } from '@/App';
import { LANGUAGES_DATA, SOFTWARE_DATA } from '@/constants';

const Skills = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">map 03</p>
      <h2 className="section-title">{t.skills.title}</h2>

      <div className="space-y-10">
        <div>
          <h3 className="mb-4 font-mono text-[1.1rem] tracking-[0.12em] text-muted uppercase">
            {t.skills.languages}
          </h3>
          <ul className="stagger grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {LANGUAGES_DATA.map((skill) => (
              <li key={skill.name} className="group relative">
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inventory-slot"
                >
                  <img
                    src={`/assets/${skill.icon}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-7 object-contain"
                  />
                  <span className="text-sm font-medium md:text-[0.95rem]">{skill.name}</span>
                </a>
                {skill.libraries && (
                  <div className="skill-pop">
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
          <h3 className="mb-4 font-mono text-[1.1rem] tracking-[0.12em] text-muted uppercase">
            {t.skills.software}
          </h3>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {SOFTWARE_DATA.map((software) => (
              <li key={software.name}>
                <a
                  href={software.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inventory-slot"
                >
                  <img
                    src={`/assets/${software.icon}`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-7 object-contain"
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
