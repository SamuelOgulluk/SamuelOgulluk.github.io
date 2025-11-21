import React from 'react';
import { useLanguage } from '@/App';
import Icon from './Icon';
import type { EducationItem } from '@/types';


const EducationCard: React.FC<{ item: EducationItem }> = ({ item }) => {
    
        const iconName = item.icon.replace('.svg', '');

        const iconElement = item.isIconMultiColor
            ? <img src={`/assets/${item.icon}`} alt="" className="w-full h-full object-contain" />
            : <Icon name={iconName} className="w-full h-full" />;

        // Per-icon scale: make logos fit the circle by default (scale = 1)
        // Keep ENS Paris-Saclay slightly larger so it remains prominent
        const defaultScale = 1;
        let iconScale = defaultScale;
        const lowerIcon = iconName.toLowerCase();
        if (lowerIcon.includes('ens-rennes') || lowerIcon === 'ens-rennes') {
            // ENS Rennes: slightly reduced (≈10% smaller than before)
            iconScale = 1.8;
        } else if (lowerIcon === 'ens_ps' || (lowerIcon.includes('paris') && lowerIcon.includes('ens')) || lowerIcon.includes('paris-saclay')) {
            // ENS Paris-Saclay: slightly reduced (≈10% smaller than before)
                iconScale = 1.08; // slightly larger for ENS Paris-Saclay
            } else if (lowerIcon.includes('sorbonne')) {
                iconScale = 1.3; // Sorbonne: slightly larger
        }

    return (
                <div className="relative pl-20 sm:pl-32 py-6 group">
                        <a
                            href={item.institutionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${item.institution} website`}
                            className="absolute left-0 z-10 w-[60px] h-[60px] sm:w-[96px] sm:h-[96px] bg-white rounded-full -translate-x-1/2 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
                        >
                            {/* reduced circle to a moderate size so logos are smaller and fit better */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                <div style={{ transform: `scale(${iconScale})`, transformOrigin: 'center' }} className="w-full h-full flex items-center justify-center">
                                    {iconElement}
                                </div>
                            </div>
                        </a>
                        <div className="pl-2 sm:pl-8">
              <h4 className="font-bold text-lg text-white">{item.degree}</h4>
              <p className="text-red-400 text-sm mb-2">{item.institution} | {item.duration}</p>
              <p className="text-slate-400 text-sm md:text-base">
                  {item.description}
              </p>
            </div>
        </div>
    );
};

const Education: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="education" className="pt-8 pb-20 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-8">
                {t.education.title}
                <span className="text-red-500">.</span>
            </h2>
            <div className="relative border-l-2 border-zinc-700">
                {t.education.items.map((item, index) => (
                    <EducationCard key={index} item={item} />
                ))}
            </div>
        </section>
    );
};

export default Education;