import React from 'react';
import { useLanguage } from '@/App';
import type { EducationItem } from '@/types';

const EducationRow: React.FC<{ item: EducationItem }> = ({ item }) => {
  return (
    <article className="grid gap-4 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[7.5rem_1fr] md:gap-8">
      <div className="text-sm font-medium text-muted md:pt-1">{item.duration}</div>
      <div>
        <div className="mb-4 flex items-start gap-5">
          <a
            href={item.institutionLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.institution} website`}
            className="logo-tile flex h-20 w-44 shrink-0 items-center justify-center overflow-hidden border md:h-24 md:w-56"
          >
            <img src={`/assets/${item.icon}`} alt="" className="h-full w-full object-contain p-3 md:p-4" />
          </a>
          <div>
            <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink md:text-xl">
              {item.degree}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-accent">{item.institution}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-soft md:text-base">{item.description}</p>
      </div>
    </article>
  );
};

const Education: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">03</p>
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
