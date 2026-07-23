import React from 'react';
import { useLanguage } from '@/App';
import type { EducationItem } from '@/types';

const EducationRow: React.FC<{ item: EducationItem }> = ({ item }) => {
  return (
    <article className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
        <a
          href={item.institutionLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.institution} website`}
          className="logo-tile flex h-16 w-36 shrink-0 items-center justify-center overflow-hidden border sm:h-20 sm:w-40 md:h-24 md:w-52"
        >
          <img src={`/assets/${item.icon}`} alt="" className="h-full w-full object-contain p-1" />
        </a>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink md:text-xl">
            {item.degree}
          </h3>
          <p className="mt-0.5 text-sm font-medium text-accent">{item.institution}</p>
          <p className="mt-1 text-sm font-medium text-muted">{item.duration}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-soft md:text-base">{item.description}</p>
    </article>
  );
};

const Education: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">02</p>
      <h2 className="section-title">{t.education.title}</h2>
      <div>
        {t.education.items.map((item, index) => (
          <EducationRow key={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default Education;
