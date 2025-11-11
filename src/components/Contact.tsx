import React from 'react';
import { useLanguage } from '@/App';
import { CONTACT_DATA } from '@/constants';
import Icon from './Icon';

const Contact: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="contact" className="pt-8 pb-20 text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-4">
                {t.contact.title}
                <span className="text-red-500">.</span>
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
                {t.contact.subtitle}
            </p>

            <a
                href={`mailto:${CONTACT_DATA.email}`}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-transform duration-300 hover:scale-105 mb-12"
            >
                {t.contact.emailText}
            </a>

            <div className="flex justify-center items-center gap-4">
                <a href={CONTACT_DATA.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center" aria-label="LinkedIn">
                    <div className="h-8 w-8 text-slate-400 group-hover:text-red-500 transition-all duration-300 transform group-hover:scale-110 z-10">
                        <Icon name="linkedin" className="w-full h-full" />
                    </div>
                    <div className="overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs">
                         <span className="ml-2 pl-3 pr-4 py-2 rounded-full bg-zinc-700/80 backdrop-blur-sm text-lg text-white font-semibold whitespace-nowrap">
                            {CONTACT_DATA.linkedinHandle}
                        </span>
                    </div>
                </a>

                <a href={CONTACT_DATA.github} target="_blank" rel="noopener noreferrer" className="group flex items-center" aria-label="GitHub">
                    <div className="h-8 w-8 text-slate-400 group-hover:text-red-500 transition-all duration-300 transform group-hover:scale-110 z-10">
                        <Icon name="github" className="w-full h-full" />
                    </div>
                    <div className="overflow-hidden transition-all duration-300 max-w-0 group-hover:max-w-xs">
                        <span className="ml-2 pl-3 pr-4 py-2 rounded-full bg-zinc-700/80 backdrop-blur-sm text-lg text-white font-semibold whitespace-nowrap">
                            {CONTACT_DATA.githubHandle}
                        </span>
                    </div>
                </a>
            </div>
             <p className="text-zinc-500 text-sm mt-20">
                Designed & Built by Samuel Ogulluk
            </p>
        </section>
    );
};

export default Contact;
