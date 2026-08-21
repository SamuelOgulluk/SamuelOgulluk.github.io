import React from 'react';
import { useLanguage } from '@/App';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import Contact from './Contact';
import { CONTACT_DATA } from '@/constants';

const InspectPanel = ({ panel, onClose }) => {
  const { t } = useLanguage();

  const title = {
    about: t.about.title,
    experience: t.experience.title,
    education: t.education.title,
    skills: t.skills.title,
    projects: t.projects.title,
    contact: t.contact.title,
  }[panel];

  return (
    <div className="inspect" role="dialog" aria-label={title}>
      <div className="inspect-bar">
        <span>{title}</span>
        <button type="button" className="inspect-x" onClick={onClose} aria-label={t.den.close}>
          {t.den.close}
        </button>
      </div>
      <div className="inspect-body">
        {panel === 'about' && (
          <div>
            <p className="mt-0 font-display text-xl text-ink">{t.home.greeting}</p>
            <p className="mt-2 text-sm font-semibold text-accent">{t.headerSubtitle}</p>
            <p className="mt-3 mb-0 text-base leading-relaxed text-soft">{t.about.bio}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT_DATA.email}`} className="btn btn-primary">
                {t.contact.emailText}
              </a>
              <a href="/cv.pdf" download className="btn btn-ghost">
                {t.about.downloadCV}
              </a>
            </div>
          </div>
        )}
        {panel === 'experience' && <Experience />}
        {panel === 'education' && <Education />}
        {panel === 'skills' && <Skills />}
        {panel === 'projects' && <Projects />}
        {panel === 'contact' && <Contact />}
      </div>
    </div>
  );
};

export default InspectPanel;
