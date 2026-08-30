export type Language = 'en' | 'fr';

export type AppView = 'portfolio' | 'utility';

export type PanelId = 'about' | 'experience' | 'education' | 'skills' | 'projects' | 'contact';

export interface TranslationContent {
  headerTitle: string;
  headerSubtitle: string;
  tabs: {
    portfolio: string;
    utility: string;
    music: string;
  };
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
    lookAround: string;
  };
  den: {
    hint: string;
    lab: string;
    desk: string;
    books: string;
    music: string;
    tools: string;
    mail: string;
    otter: string;
    about: string;
    kit: string;
    close: string;
    back: string;
    window: string;
    maps: string;
    degree: string;
    diploma: string;
    piano: string;
    guitar: string;
    otterLines: string[];
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
    title: string;
    subtitle: string;
    emailText: string;
  };
  utility: {
    title: string;
    subtitle: string;
    linkLabel: string;
    placeholder: string;
    modeVideo: string;
    modeAudio: string;
    analyze: string;
    loading: string;
    qualityLabel: string;
    download: string;
    downloading: string;
    invalidUrl: string;
    fetchError: string;
    noStreams: string;
    downloadFallback: string;
    disclaimer: string;
    lockTitle: string;
    lockSubtitle: string;
    lockLabel: string;
    lockSubmit: string;
    lockWrong: string;
    toolYoutube: string;
    toolPdf: string;
    pdf: {
      title: string;
      subtitle: string;
      pdf24Title: string;
      pdf24Subtitle: string;
      openPdf24: string;
      popupBlocked: string;
      localTitle: string;
      localSubtitle: string;
      addFiles: string;
      clearFiles: string;
      merge: string;
      split: string;
      rotate: string;
      rangeLabel: string;
      rangePlaceholder: string;
      needMultiple: string;
      needSingle: string;
      processError: string;
      working: string;
      disclaimer: string;
    };
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
  siteUrl?: string;
  technologies: SkillDetails[];
}
