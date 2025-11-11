import React from 'react';
import { useLanguage } from '../App';

const Home: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="home" className="min-h-screen flex flex-col justify-center animate-fade-in">
            <div className="space-y-4">
                <p className="text-xl text-red-400 font-medium">{t.headerSubtitle}</p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                    {t.headerTitle}
                    <span className="text-red-500">.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 pt-4 max-w-xl">
                    {t.home.intro}
                </p>
                <p className="text-slate-400 md:text-lg leading-relaxed max-w-xl">
                    {t.home.paragraph1}
                </p>
            </div>
        </section>
    );
};

export default Home;