import React from 'react';
import { useLanguage } from '@/App';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="flex min-h-[calc(100svh-8.5rem)] flex-col justify-center pb-8 pt-4 md:min-h-[calc(100vh-5.5rem)] md:pb-10 md:pt-6"
    >
      <p
        className="animate-rise mb-2 max-w-3xl text-[0.88rem] font-semibold leading-snug tracking-normal text-accent normal-case sm:text-[0.95rem]"
        style={{ animationDelay: '60ms' }}
      >
        {t.headerSubtitle}
      </p>
      <h1
        className="animate-rise font-display text-[clamp(2.35rem,9vw,4.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-ink"
        style={{ animationDelay: '120ms' }}
      >
        {t.headerTitle}
      </h1>
      <p
        className="animate-rise mt-5 max-w-2xl text-base leading-relaxed text-soft sm:mt-6 sm:text-lg md:text-xl"
        style={{ animationDelay: '200ms' }}
      >
        {t.about.bio}
      </p>
      <div className="animate-rise mt-7 flex flex-wrap gap-3" style={{ animationDelay: '280ms' }}>
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
