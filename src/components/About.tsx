import React from 'react';
import { useLanguage } from '@/App';

const About: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="pt-20 pb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-8">
                {t.about.title}
                <span className="text-red-500">.</span>
            </h2>
            
            <p className="md:text-lg text-slate-300 leading-relaxed bg-zinc-800/50 p-6 rounded-lg backdrop-blur-sm mb-8">
                {t.about.bio}
            </p>
            
            <a 
              href="/cv.pdf"
              download
              className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 hover:scale-105"
            >
              {t.about.downloadCV}
            </a>
        </section>
    );
};

export default About;