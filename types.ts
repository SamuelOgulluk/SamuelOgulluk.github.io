export type Language = 'en' | 'fr';

export type SectionId = 'home' | 'about' | 'skills' | 'education' | 'experience' | 'projects' | 'contact';

export interface TranslationContent {
  headerTitle: string;
  headerSubtitle: string;
  nav: {
    home: string;
    about: string;
    skills: string;
    education: string;
    experience: string;
    projects: string;
    contact: string;
  };
  home: {
    greeting: string;
    intro: string;
    paragraph1: string;
  };
  about: {
    title: string;
    bio: string;
    downloadCV: string;
  };
  skills: {
    title: string;
    languages: string;
    software: string;
  };
  education: {
    title: string;
    items: EducationItem[];
  };
  experience: {
    title: string;
    items: ExperienceItem[];
  };
  projects: {
    title: string;
    items: Project[];
  };
  contact: {
    title:string;
    subtitle: string;
    emailText: string;
  };
}

export interface SkillDetails {
  name: string;
  link: string;
  icon: string; // Changed from React.FC
  libraries?: {
    name: string;
    link: string;
    icon: string; // Changed from React.FC
  }[];
}

export interface SoftwareDetails {
  name: string;
  link: string;
  icon: string; // Changed from React.FC
  scale?: number;
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  description: string;
  institutionLink: string;
  icon: string; // Changed from React.FC
  isIconMultiColor?: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
  icon?: string; // Changed from React.FC
  isIconMultiColor?: boolean;
  institutionLink: string;
}

export interface Project {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  githubUrl: string;
  technologies: SkillDetails[];
}
