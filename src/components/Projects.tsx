import React from 'react';
import { useLanguage } from '@/App';
import Icon from './Icon';
import type { Project } from '@/types';

const ProjectBlock: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const primaryUrl = project.siteUrl || project.githubUrl;
  const hasSite = Boolean(project.siteUrl);

  return (
    <article className="border-t border-line py-8 first:border-t-0 first:pt-0">
      <div className={`flex flex-col gap-5 md:flex-row md:items-start md:gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full overflow-hidden border border-line bg-white md:w-56 md:shrink-0"
        >
          <div className="h-44 overflow-hidden md:h-40 md:transition-all md:duration-500 md:group-hover:h-56">
            {project.videoUrl ? (
              <video
                className="h-full w-full object-cover object-top"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source src={project.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-full w-full object-contain object-center p-4"
              />
            )}
          </div>
        </a>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink">
            <a
              href={primaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </a>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-soft md:text-base">{project.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {hasSite && (
              <a
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                Site →
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
              aria-label={`${project.title} on GitHub`}
            >
              <Icon name="github" className="h-4 w-4" />
              GitHub
            </a>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted">Stack</span>
            {project.technologies.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-2 text-sm text-soft"
                title={tech.name}
              >
                <img
                  src={`/assets/${tech.icon}`}
                  alt=""
                  className="h-8 w-8 object-contain"
                />
                <span className="font-medium text-ink">{tech.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

const Projects: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <p className="section-kicker">04</p>
      <h2 className="section-title">{t.projects.title}</h2>
      <div>
        {t.projects.items.map((project, index) => (
          <ProjectBlock key={index} project={project} index={index} />
        ))}
      </div>
    </>
  );
};

export default Projects;
