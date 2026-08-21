import React from 'react';
import { useLanguage } from '@/App';

const ExperienceRow = ({ item }) => {
  return (
    <article className="pixel-panel mb-4 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
        <a
          href={item.institutionLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.company} website`}
          className="logo-tile flex h-16 w-36 shrink-0 items-center justify-center overflow-hidden sm:h-20 sm:w-40 md:h-24 md:w-52"
        >
          <img src={`/assets/${item.icon}`} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain p-1" />
        </a>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">{item.role}</h3>
          <p className="mt-0.5 text-sm font-semibold text-accent">{item.company}</p>
          <p className="mt-1 font-mono text-[1.05rem] text-accent-lamp">{item.duration}</p>
        </div>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-soft md:text-base">
        {item.description}
      </p>
    </article>
  );
};

const Experience = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">map 01</p>
      <h2 className="section-title">{t.experience.title}</h2>
      <div>
        {t.experience.items.map((item, index) => (
          <ExperienceRow key={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default Experience;
