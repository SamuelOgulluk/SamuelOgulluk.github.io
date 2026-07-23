import React from 'react';
import { useLanguage } from '@/App';
import { CONTACT_DATA } from '@/constants';
import Icon from './Icon';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">06</p>
      <h2 className="section-title">{t.contact.title}</h2>
      <p className="max-w-xl text-base leading-relaxed text-soft md:text-lg">{t.contact.subtitle}</p>

      <a href={`mailto:${CONTACT_DATA.email}`} className="btn btn-primary mt-8">
        {t.contact.emailText}
      </a>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <a
          href={CONTACT_DATA.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-soft transition-colors hover:text-accent"
          aria-label="LinkedIn"
        >
          <Icon name="linkedin" className="h-5 w-5" />
          <span className="text-sm font-medium">{CONTACT_DATA.linkedinHandle}</span>
        </a>
        <a
          href={CONTACT_DATA.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-soft transition-colors hover:text-accent"
          aria-label="GitHub"
        >
          <Icon name="github" className="h-5 w-5" />
          <span className="text-sm font-medium">{CONTACT_DATA.githubHandle}</span>
        </a>
      </div>

      <p className="mt-16 text-sm text-muted">Samuel Ogulluk</p>
    </>
  );
};

export default Contact;
