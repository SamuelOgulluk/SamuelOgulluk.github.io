import React from 'react';
import { useLanguage } from '@/App';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="flex min-h-[calc(100vh-5.5rem)] flex-col justify-center pb-10 pt-6">
      <p className="section-kicker animate-rise" style={{ animationDelay: '80ms' }}>
        {t.headerSubtitle}
      </p>
      <h1
        className="animate-rise font-display text-[clamp(2.75rem,8vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-ink"
        style={{ animationDelay: '160ms' }}
      >
        {t.headerTitle}
      </h1>
      <p
        className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-soft md:text-xl"
        style={{ animationDelay: '260ms' }}
      >
        {t.home.intro}
      </p>
      <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: '340ms' }}>
        <a href="#contact" className="btn btn-primary">
          {t.contact.emailText}
        </a>
        <a href="/cv.pdf" download className="btn btn-ghost">
          {t.about.downloadCV}
        </a>
      </div>
    </section>
  );
};

export default Home;
