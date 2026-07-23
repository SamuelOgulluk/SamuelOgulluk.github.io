import React from 'react';
import { useLanguage } from '@/App';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">01</p>
      <h2 className="section-title">{t.about.title}</h2>
      <p className="max-w-2xl text-base leading-relaxed text-soft md:text-lg">
        {t.about.bio}
      </p>
      <a href="/cv.pdf" download className="btn btn-primary mt-8">
        {t.about.downloadCV}
      </a>
    </>
  );
};

export default About;
