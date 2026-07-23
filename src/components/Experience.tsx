import React from 'react';
import { useLanguage } from '@/App';
import type { ExperienceItem } from '@/types';

const ExperienceRow: React.FC<{ item: ExperienceItem }> = ({ item }) => {
  return (
    <article className="grid gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[7.5rem_1fr] md:gap-8">
      <div className="text-sm font-medium text-muted md:pt-1">{item.duration}</div>
      <div>
        <div className="mb-4 flex items-start gap-5">
          <a
            href={item.institutionLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.company} website`}
            className="logo-tile flex h-20 w-44 shrink-0 items-center justify-center overflow-hidden border md:h-24 md:w-56"
          >
            <img src={`/assets/${item.icon}`} alt="" className="h-full w-full object-contain p-3 md:p-4" />
          </a>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-ink">{item.role}</h3>
            <p className="mt-0.5 text-sm font-medium text-accent">{item.company}</p>
          </div>
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed text-soft md:text-base">
          {item.description}
        </p>
      </div>
    </article>
  );
};

const Experience: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">01</p>
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
