import React from 'react';
import { useLanguage } from '@/App';
import PixelDen from './PixelDen';

const Home = ({ onViewChange }) => {
  const { t } = useLanguage();

  return (
    <section id="home" className="flex min-h-[calc(100svh-8.5rem)] flex-col justify-center pb-8 pt-3 md:min-h-[calc(100vh-5.5rem)] md:pb-10 md:pt-4">
      <p
        className="animate-rise mb-3 font-mono text-[1.15rem] tracking-[0.12em] text-accent-lamp"
        style={{ animationDelay: '40ms' }}
      >
        {t.home.lookAround}
      </p>

      <div className="animate-rise" style={{ animationDelay: '80ms' }}>
        <PixelDen onViewChange={onViewChange} />
      </div>

      <div className="dialogue animate-rise" style={{ animationDelay: '160ms' }}>
        <span className="dialogue-name">{t.headerTitle}</span>
        <p className="m-0 font-display text-xl text-ink md:text-2xl">{t.home.greeting}</p>
        <p className="mt-2 m-0 text-sm font-semibold text-accent md:text-base">{t.headerSubtitle}</p>
        <p className="mt-3 mb-0 max-w-2xl text-base leading-relaxed text-soft md:text-lg">
          {t.about.bio}
          <span className="caret" aria-hidden="true" />
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" className="btn btn-primary">
            {t.contact.emailText}
          </a>
          <a href="/cv.pdf" download className="btn btn-ghost">
            {t.about.downloadCV}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
