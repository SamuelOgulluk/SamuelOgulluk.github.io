import React from 'react';
import { useLanguage } from '@/App';
import Icon from './Icon';
import type { Project } from '@/types';


const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <a 
      href={project.githubUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-zinc-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:shadow-red-500/20 group relative z-10 hover:z-20"
    >
      <div className={`flex flex-row group-hover:flex-col transition-all duration-500 ease-in-out ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
        <div className={`relative w-48 group-hover:w-full transition-all duration-500 ease-in-out ${index % 2 === 1 ? 'ml-auto' : 'mr-auto'}`}>
          <div className="relative overflow-hidden transition-all duration-500 ease-in-out group-hover:h-96 h-48 transform-gpu">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                className="w-full h-full object-cover object-top group-hover:object-contain transition-all duration-500 ease-out origin-top
                scale-100 group-hover:scale-100 group-hover:origin-center
                motion-safe:group-hover:animate-expand motion-safe:group-not-hover:animate-collapse"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover object-top group-hover:object-contain transition-all duration-500 ease-out origin-top
                scale-100 group-hover:scale-100 group-hover:origin-center
                motion-safe:group-hover:animate-expand motion-safe:group-not-hover:animate-collapse" 
              />
            )}
            <div className={`absolute top-3 w-8 h-8 text-white bg-black/50 rounded-full p-1.5 transition-transform duration-300 group-hover:scale-110 ${index % 2 === 0 ? 'right-3' : 'left-3'}`}>
              <Icon name="github" className="w-full h-full bg-white" />
            </div>
          </div>
        </div>
        <div className="flex-1 p-5 transition-all duration-500 ease-in-out">
          <h3 className="font-bold text-xl text-white mb-2">{project.title}</h3>
          <p className="text-slate-400 text-sm mb-4">{project.description}</p>
          
          <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 mr-2">Tech Stack:</span>
              {project.technologies.map(tech => (
                <div 
                  key={tech.name} 
                  className="w-6 h-6 text-slate-400" 
                  title={tech.name}
                >
                  <img src={`/assets/${tech.icon}`} alt={tech.name} className="w-full h-full" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </a>
  );
};


const Projects: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="projects" className="pt-8 pb-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8">
          {t.projects.title}
          <span className="text-red-500">.</span>
      </h2>
      <div className="grid gap-8">
        {t.projects.items.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;