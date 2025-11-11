import React from 'react';
import { useLanguage } from '@/App';
import { LANGUAGES_DATA, SOFTWARE_DATA } from '@/constants';

const Skills: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="skills" className="pt-8 pb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-12">
                {t.skills.title}
                <span className="text-red-500">.</span>
            </h2>

            {/* Languages & Technologies */}
            <div className="mb-16">
                <h3 className="text-xl font-semibold text-slate-200 mb-6">{t.skills.languages}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8">
                    {LANGUAGES_DATA.map((skill) => (
                        <div key={skill.name} className="relative group flex flex-col items-center">
                            <a 
                                href={skill.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label={skill.name}
                                className="w-16 h-16 md:w-20 md:h-20 p-3 bg-zinc-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-zinc-700/70 transition-all duration-300 transform hover:scale-110"
                            >
                                <img src={`/assets/${skill.icon}`} alt={skill.name} className="w-full h-full object-contain" />
                            </a>
                            <span className="text-sm mt-2 text-slate-300">{skill.name}</span>

                            {/* Libraries Popover */}
                            {skill.libraries && (
                                <div className="absolute -top-4 -right-4 translate-x-full z-10 w-40 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                   <div className="grid grid-cols-2 gap-3">
                                        {skill.libraries.map(lib => (
                                             <a 
                                                key={lib.name}
                                                href={lib.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={lib.name}
                                                className="flex flex-col items-center text-slate-400 hover:text-red-500 transition-colors duration-200"
                                            >
                                                <div className="w-10 h-10 p-1">
                                                     <img src={`/assets/${lib.icon}`} alt={lib.name} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xs mt-1">{lib.name}</span>
                                            </a>
                                        ))}
                                   </div>
                                   <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-700 transform rotate-45"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Software */}
            <div>
                <h3 className="text-xl font-semibold text-slate-200 mb-6">{t.skills.software}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8">
                    {SOFTWARE_DATA.map((software) => (
                        <div key={software.name} className="flex flex-col items-center">
                            <a 
                                href={software.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label={software.name}
                                className="w-16 h-16 md:w-20 md:h-20 p-3 bg-zinc-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-zinc-700/70 transition-all duration-300 transform hover:scale-110"
                            >
                                <img 
                                    src={`/assets/${software.icon}`} 
                                    alt={software.name} 
                                    className="w-full h-full object-contain transition-transform duration-300"
                                    style={{ transform: `scale(${software.scale || 1})` }}
                                />
                            </a>
                            <span className="text-sm mt-2 text-slate-300">{software.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;