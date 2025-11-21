import type { TranslationContent, SkillDetails, SoftwareDetails, Project } from './types';

const LANGUAGES_DATA: SkillDetails[] = [
  { 
    name: 'Python', 
    link: 'https://en.wikipedia.org/wiki/Python_(programming_language)', 
    icon: 'python.svg',
    libraries: [
      { name: 'Keras', link: 'https://en.wikipedia.org/wiki/Keras', icon: 'Keras_logo.svg' },
      { name: 'TensorFlow', link: 'https://en.wikipedia.org/wiki/TensorFlow', icon: 'tensorflow.svg' },
      { name: 'JAX', link: 'https://en.wikipedia.org/wiki/JAX_(software)', icon: 'jax.svg' },
      { name: 'OpenCV', link: 'https://en.wikipedia.org/wiki/OpenCV', icon: 'opencv.svg' },
      { name: 'PyTorch', link: 'https://en.wikipedia.org/wiki/PyTorch', icon: 'pytorch.svg' },
      { name: 'NumPy', link: 'https://en.wikipedia.org/wiki/NumPy', icon: 'numpy-logo.svg' },
    ]
  },
  { 
    name: 'C', 
    link: 'https://en.wikipedia.org/wiki/C_(programming_language)', 
    icon: 'C.svg',
    libraries: [
      { name: 'OpenMP', link: 'https://en.wikipedia.org/wiki/OpenMP', icon: 'openmp-logo.svg' },
      { name: 'SDL2', link: '#', icon: 'sdl2.svg' },
    ]
  },
  { 
    name: 'C++', 
    link: 'https://en.wikipedia.org/wiki/C%2B%2B', 
    icon: 'cpp.svg',
    libraries: [
      { name: 'CUDA', link: 'https://en.wikipedia.org/wiki/CUDA', icon: 'cuda.svg' },
    ]
  },
  { name: 'ARM assembler', link: 'https://en.wikipedia.org/wiki/ARM_architecture', icon: 'ARM_powered_Badge.svg' },

  { name: 'HTML', link: 'https://en.wikipedia.org/wiki/HTML', icon: 'html5.svg' },
  { name: 'CSS', link: 'https://en.wikipedia.org/wiki/CSS', icon: 'CSS3.svg' },
  { name: 'TypeScript', link: 'https://en.wikipedia.org/wiki/TypeScript', icon: 'typescript.svg' },
  { name: 'MATLAB', link: 'https://en.wikipedia.org/wiki/MATLAB', icon: 'matlab.svg' },
  { name: 'Git', link: 'https://en.wikipedia.org/wiki/Git', icon: 'Git.svg' },
  { name: 'Unix', link: 'https://en.wikipedia.org/wiki/Bash_(Unix_shell)', icon: 'unix.svg' },
];

const PROJECTS_EN: Project[] = [
  {
    title: "Portfolio Website",
    description: "My personal portfolio website built with React and TypeScript, featuring smooth animations, responsive design, and interactive elements. The site showcases my projects, skills, and experience.",
    videoUrl: "/assets/video_site.mp4",
    githubUrl: "https://github.com/SamuelOgulluk/SamuelOgulluk.github.io",
    technologies: [
    LANGUAGES_DATA.find(l => l.name === 'TypeScript'),
    LANGUAGES_DATA.find(l => l.name === 'HTML'),
    LANGUAGES_DATA.find(l => l.name === 'CSS'),
    LANGUAGES_DATA.find(l => l.name === 'Git'),
    ].filter(Boolean) as SkillDetails[],
  },
  {
    title: "Otternet",
    description: "A C framework specialized in efficient and easy Machine learning and data science",
    imageUrl: "/assets/otternet-logo.png",
    githubUrl: "https://github.com/SamuelOgulluk/Otternet",
    technologies: [
    LANGUAGES_DATA.find(l => l.name === 'C'),
    LANGUAGES_DATA.find(l => l.name === 'Python'),
    LANGUAGES_DATA.find(l => l.name === 'Git'),
    ].filter(Boolean) as SkillDetails[],
  },
  {
    title: "7 colors game",
    description: "The classic 7 colors game implemented in C using SDL2 library with different AI opponents including Minimax and Monte Carlo Tree Search algorithms.",
    imageUrl: "/assets/7color.png",
    githubUrl: "https://github.com/SamuelOgulluk/7Colors",
     technologies: [
    LANGUAGES_DATA.find(l => l.name === 'C'),
    LANGUAGES_DATA.find(l => l.name === 'Git'),
    ].filter(Boolean) as SkillDetails[],
  },
];

const PROJECTS_FR: Project[] = [
    {
      title: "Site Web Portfolio",
      description: "Mon site web personnel construit avec React et TypeScript, présentant des animations fluides, un design responsive et des éléments interactifs. Le site met en valeur mes projets, compétences et expériences.",
      videoUrl: "/assets/video_site.mp4",
      githubUrl: "https://github.com/SamuelOgulluk/SamuelOgulluk.github.io",
      technologies: [
        LANGUAGES_DATA.find(l => l.name === 'TypeScript'),
        LANGUAGES_DATA.find(l => l.name === 'HTML'),
        LANGUAGES_DATA.find(l => l.name === 'CSS'),
        LANGUAGES_DATA.find(l => l.name === 'Git'),
      ].filter(Boolean) as SkillDetails[],
    },
    {
      title: "Otternet",
      description: "Une librairie en C spécialisée dans l'apprentissage automatique et la science des données, conçue pour être efficace et facile à utiliser.",
      imageUrl: "/assets/otternet-logo.svg",
      githubUrl: "https://github.com/OgullukSamuel/Otternet",
      technologies: [
        LANGUAGES_DATA.find(l => l.name === 'Python'),
        LANGUAGES_DATA.find(l => l.name === 'HTML'),
        LANGUAGES_DATA.find(l => l.name === 'CSS'),
      ].filter(Boolean) as SkillDetails[],
    },
    {
      title: "Jeu des 7 couleurs",
      description: "Le classique jeu des 7 couleurs implémenté en C utilisant la bibliothèque SDL2 avec différents adversaires IA incluant les algorithmes Minimax et Monte Carlo Tree Search.",
      imageUrl: "/assets/7color.png",
      githubUrl: "https://github.com/OgullukSamuel/7Colors",
       technologies: [
        LANGUAGES_DATA.find(l => l.name === 'C++'),
        LANGUAGES_DATA.find(l => l.name === 'Git'),
      ].filter(Boolean) as SkillDetails[],
    },
];


export const TRANSLATIONS: { en: TranslationContent; fr: TranslationContent } = {
  en: {
    headerTitle: "Samuel Ogulluk",
    headerSubtitle: "Electronic & IT Engineering Student",
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      education: "Education",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
    },
    home: {
      greeting: "Welcome.",
      intro: "I'm a graduate student in Electronic engineering, Computer Science, and Applied mathematics, with a strong interest in Robotics.",
      paragraph1: "Passionate about solving complex problems at the intersection of algorithms and physical systems. Explore my portfolio to see my work and get in touch!",
    },
    about: {
      title: "About Me",
      bio: "As a graduate student in Electronic engineering, Computer Science, and Applied mathematics, I am driven to build innovative solutions at the intersection of algorithms and robotics. I am open to opportunities, don't hesitate to contact me.",
      downloadCV: "Download CV",
    },
    skills: {
      title: "Skills",
      languages: "Languages & Technologies",
      software: "Software",
    },
    education: {
      title: "Education",
      items: [
        {
          degree: "MSc in Electronic and Digital Engineering",
          institution: "Ecole Normale Supérieure Paris-Saclay, Paris",
          duration: "2025 - Present",
          description: "Department of Electronic and Digital Engineering - Student civil servant. The key courses included: Microprocessors architecture, Computer science, Signal & Image Processing, Physics, AI.",
          institutionLink: "https://ens-paris-saclay.fr/",
          icon: 'ens_ps.svg',
          isIconMultiColor: true,
        },
        {
          degree: "BSc in Theoretical Physics",
          institution: "Sorbonne Université, Paris",
          duration: "2025 - Present",
          description: "The key courses included: Quantum Physics, Complex Analysis, Mechanics of Materials.",
          institutionLink: "https://www.sorbonne-universite.fr/",
          icon: 'sorbonne_universite_logo.svg',
          isIconMultiColor: true,
        },
        {
          degree: "BSc in Mechanical Engineering with the highest honours & BSc in Electrical Engineering with high honours",
          institution: "École Normale Supérieure de Rennes, Rennes",
          duration: "2024 - 2025",
          description: "Department of Mechatronics - Student civil servant. The key courses included : Continuum Mechanics, Rigid-Body Mechanics, Engineering Drawing, 3D CAD, Analog Electronics.",
          institutionLink: "https://www.ens-rennes.fr/",
          icon: 'ens-rennes.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Preparatory class for France's leading engineering Universities",
          institution: "Lycée Hoche, Versailles",
          duration: "2022 - 2024",
          description: "Intensive generalist curriculum in Mathematics and Chemistry with a Major in Physics and Engineering.",
          institutionLink: "https://en.wikipedia.org/wiki/Lyc%C3%A9e_Hoche",
          icon: 'hoche.svg',
          isIconMultiColor: true,
        },
      ]
    },
    experience: {
      title: "Work Experience",
      items: [
        {
          role: "Internship",
          company: "CERN, Meyrin, Switzerland",
          duration: "June-July 2025",
          description: "Worked on the FCC (Future Circular Collider) project in the BEAMS department. Developed and benchmarked state-of-the-art robotic pose estimation algorithms, assembled a dedicated testbed, and ensured robustness under critical operating conditions. Attended Summer Student lectures on Particle Physics, Experimental Physics and Computer Sciences.",
          icon: 'cern.svg',
          isIconMultiColor: true,
          institutionLink: "https://home.cern/",
        },
      ],
    },
    projects: {
      title: "My Projects",
      items: PROJECTS_EN,
    },
    contact: {
      title: "Get In Touch",
      subtitle: "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions. Feel free to reach out!",
      emailText: "Say Hello"
    }
  },
  fr: {
    headerTitle: "Samuel Ogulluk",
    headerSubtitle: "Étudiant en Électronique et Informatique",
    nav: {
      home: "Accueil",
      about: "À Propos",
      skills: "Compétences",
      education: "Formation",
      experience: "Expérience",
      projects: "Projets",
      contact: "Contact",
    },
    home: {
      greeting: "Bienvenue.",
      intro: "Je suis étudiant en Ingénierie Electronique, Informatique et Mathématiques Appliquées, avec un fort intérêt pour la Robotique.",
      paragraph1: "Passionné par la résolution de problèmes complexes à l'intersection des algorithmes et des systèmes physiques. Explorez mon portfolio pour découvrir mes travaux et n'hésitez pas à me contacter !",
    },
    about: {
      title: "À Propos de Moi",
      bio: "En tant qu'étudiant en Ingénierie Electronique, Informatique et Mathématiques Appliquées, je suis motivé à créer des solutions innovantes à l'intersection des algorithmes et de la robotique. Je suis ouvert aux opportunités, n'hésitez pas à me contacter.",
      downloadCV: "Télécharger le CV",
    },
     skills: {
      title: "Compétences",
      languages: "Langages & Technologies",
      software: "Logiciels",
    },
    education: {
      title: "Formation",
      items: [
        {
          degree: "Master en sciences pour l'ingénieur électronique et numérique",
          institution: "École Normale Supérieure Paris-Saclay, Paris",
          duration: "2025 - Présent",
          description: "Département d'Ingénierie Électronique et Numérique - Élève fonctionnaire-stagiaire. Cours clés : Architecture des microprocesseurs, Informatique, Traitement du signal et de l'image, Physique, IA.",
          institutionLink: "https://ens-paris-saclay.fr/",
          icon: 'ens_ps.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Licence de physique fondamentale",
          institution: "Sorbonne Université, Paris",
          duration: "2025 - Présent",
          description: "Cours clés : Physique quantique, Analyse complexe, Mécanique des matériaux.",
          institutionLink: "https://www.sorbonne-universite.fr/",
          icon: 'sorbonne_universite_logo.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Licence en ingénierie mécanique (Mention très bien) & Licence en ingénierie électronique (Mention bien)",
          institution: "École Normale Supérieure de Rennes, Rennes",
          duration: "2024 - 2025",
          description: "Département de Mécatronique - Élève fonctionnaire-stagiaire. Cours clés : Mécanique des milieux continus, Mécanique du solide, Dessin technique, CAO 3D, Électronique analogique.",
          institutionLink: "https://www.ens-rennes.fr/",
          icon: 'ens-rennes.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Classe préparatoire aux grandes écoles d'ingénieurs",
          institution: "Lycée Hoche, Versailles",
          duration: "2022 - 2024",
          description: "Cursus généraliste intensif en Mathématiques et Chimie avec une Majeure en Physique et Sciences de l'Ingénieur.",
          institutionLink: "https://fr.wikipedia.org/wiki/Lyc%C3%A9e_Hoche",
          icon: 'hoche.svg',
          isIconMultiColor: true,
        },
      ]
    },
    experience: {
      title: "Expérience Professionnelle",
      items: [
         {
          role: "Stage",
          company: "CERN, Meyrin, Suisse",
          duration: "Juin-Juillet 2025",
          description: "Travail sur le projet FCC (Future Circular Collider) dans le département BEAMS. Développement et évaluation d'algorithmes de pointe pour l'estimation de la pose de robots, assemblage d'un banc d'essai dédié et garantie de la robustesse dans des conditions de fonctionnement critiques. Participation aux cours d'été pour étudiants sur la physique des particules, la physique expérimentale et l'informatique.",
          icon: 'cern.svg',
          isIconMultiColor: true,
          institutionLink: "https://home.cern/",
        },
      ],
    },
    projects: {
      title: "Mes Projets",
      items: PROJECTS_FR,
    },
     contact: {
      title: "Contactez-moi",
      subtitle: "Je suis toujours ouvert à discuter de nouveaux projets, d'idées créatives ou d'opportunités pour faire partie de vos visions. N'hésitez pas à me contacter !",
      emailText: "Dites Bonjour"
    }
  },
};

export { LANGUAGES_DATA };

export const SOFTWARE_DATA: SoftwareDetails[] = [
  { name: 'KiCad', link: 'https://en.wikipedia.org/wiki/KiCad', icon: 'kicad.svg' },
  { name: 'PSpice', link: 'https://en.wikipedia.org/wiki/PSpice', icon: 'pspice.svg', scale: 1.4 },
  { name: 'SolidWorks', link: 'https://en.wikipedia.org/wiki/SolidWorks', icon: 'solidworks.svg' },
  { name: 'Autodesk Inventor', link: 'https://en.wikipedia.org/wiki/Autodesk_Inventor', icon: 'autodesk-inventor.svg' },
  { name: 'COMSOL', link: 'https://en.wikipedia.org/wiki/COMSOL_Multiphysics', icon: 'comsol.svg', scale: 1.4 },
  { name: 'MATLAB', link: 'https://en.wikipedia.org/wiki/MATLAB', icon: 'matlab.svg' },
];

export const CONTACT_DATA = {
  email: "samuel.ogulluk@ens-paris-saclay.fr",
  linkedin: "https://www.linkedin.com/in/samuel-ogulluk/",
  github: "https://github.com/SamuelOgulluk",
  linkedinHandle: "@samuel-ogulluk",
  githubHandle: "@SamuelOgulluk",
};