import React from 'react';
import { useLanguage } from '@/App';
import Icon from './Icon';
import type { ExperienceItem } from '@/types';


const ExperienceCard: React.FC<{ item: ExperienceItem }> = ({ item }) => {
    
    const iconName = item.icon ? item.icon.replace('.svg', '') : 'briefcase';

    const iconElement = item.isIconMultiColor
      ? <img src={`/assets/${item.icon}`} alt="" className="w-full h-full object-contain" />
      : <Icon name={iconName} className="w-full h-full" />;

    // Make icons fit the circle by default; allow per-icon adjustments (CERN slightly larger)
    const defaultScale = 1;
    let iconScale = defaultScale;
    const lowerIcon = iconName.toLowerCase();
    if (lowerIcon.includes('cern')) {
      // make CERN the size of the circle
      iconScale = 1;
    }

    return (
        <div className="relative pl-28 sm:pl-32 py-4 group">
            <a 
              href={item.institutionLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`${item.company} website`}
              className="absolute left-0 z-10 w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] bg-white rounded-full -translate-x-1/2 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <div style={{ transform: `scale(${iconScale})`, transformOrigin: 'center' }} className="w-full h-full flex items-center justify-center">
                  {iconElement}
                </div>
              </div>
            </a>
            <div className="pl-6">
              <h4 className="font-bold text-lg text-white">{item.role}</h4>
              <p className="text-red-400 text-sm mb-2">{item.company} | {item.duration}</p>
              <p className="text-slate-400 text-sm md:text-base whitespace-pre-line">
                  {item.description}
              </p>
            </div>
        </div>
    );
};

const Experience: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section id="experience" className="pt-8 pb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-8">
                {t.experience.title}
                <span className="text-red-500">.</span>
            </h2>
            <div className="relative border-l-2 border-zinc-700">
                {t.experience.items.map((item, index) => (
                    <ExperienceCard key={index} item={item} />
                ))}
            </div>
        </section>
    );
};

export default Experience;