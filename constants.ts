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
    title: "Otty",
    description: "Local digital audio workstation (DAW) built with Tauri 2, React and Web Audio: arrangement, piano roll, instruments, effects and mixer.",
    imageUrl: "/assets/otty.svg",
    siteUrl: "https://samuelogulluk.github.io/otty/",
    githubUrl: "https://github.com/SamuelOgulluk/otty",
    technologies: [
      LANGUAGES_DATA.find(l => l.name === 'TypeScript'),
      LANGUAGES_DATA.find(l => l.name === 'HTML'),
      LANGUAGES_DATA.find(l => l.name === 'CSS'),
      LANGUAGES_DATA.find(l => l.name === 'Git'),
    ].filter(Boolean) as SkillDetails[],
  },
  {
    title: "Portfolio Website",
    description: "Personal portfolio built with React and TypeScript: bilingual content, responsive layout, and project showcases.",
    videoUrl: "/assets/Video_site.mp4",
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
      title: "Otty",
      description: "DAW locale (station de travail audio) en Tauri 2, React et Web Audio : arrangement, piano roll, instruments, effets et mixer.",
      imageUrl: "/assets/otty.svg",
      siteUrl: "https://samuelogulluk.github.io/otty/",
      githubUrl: "https://github.com/SamuelOgulluk/otty",
      technologies: [
        LANGUAGES_DATA.find(l => l.name === 'TypeScript'),
        LANGUAGES_DATA.find(l => l.name === 'HTML'),
        LANGUAGES_DATA.find(l => l.name === 'CSS'),
        LANGUAGES_DATA.find(l => l.name === 'Git'),
      ].filter(Boolean) as SkillDetails[],
    },
    {
      title: "Site Web Portfolio",
      description: "Site personnel en React et TypeScript : contenu bilingue, mise en page responsive et présentation des projets.",
      videoUrl: "/assets/Video_site.mp4",
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
      description: "Bibliothèque en C pour le machine learning et la data science, pensée pour rester simple tout en restant efficace.",
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
      description: "Implémentation en C du jeu des 7 couleurs avec SDL2, et des adversaires IA basés sur Minimax et Monte Carlo Tree Search.",
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
      intro: "Graduate student in electronic engineering, computer science, and applied mathematics.",
    },
    about: {
      title: "About",
      bio: "I am a graduate student in electronic and digital engineering at ENS Paris-Saclay. My work focuses on signal processing and applied algorithms, and I am open to internships and collaborations.",
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
          description: "PCSI then PSI* — intensive preparatory track in mathematics, physics and engineering sciences.",
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
          role: "Research internship",
          company: "ETH Zurich, Zurich, Switzerland",
          duration: "2026",
          description: "Worked on recurrent neural networks and their interpretability by testing exact learning algorithms. Demonstrated the PP-completeness of learning with recurrent neural networks over a number of iterations polynomial in the input size.",
          icon: 'ethz.svg',
          isIconMultiColor: true,
          institutionLink: "https://ethz.ch/",
        },
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
      title: "Contact",
      subtitle: "Feel free to reach out — happy to chat.",
      emailText: "Email me"
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
      intro: "Étudiant en ingénierie électronique, informatique et mathématiques appliquées.",
    },
    about: {
      title: "À propos",
      bio: "Élève à l'ENS Paris-Saclay en ingénierie électronique et numérique, je m'intéresse surtout au traitement du signal et aux algorithmes appliqués. N'hésitez pas à me contacter pour un stage ou une collaboration.",
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
          description: "Élève fonctionnaire-stagiaire au département d'ingénierie électronique et numérique. Enseignements notamment en architecture des microprocesseurs, informatique, traitement du signal et de l'image, physique et IA.",
          institutionLink: "https://ens-paris-saclay.fr/",
          icon: 'ens_ps.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Licence en ingénierie mécanique (Mention très bien) & Licence en ingénierie électronique (Mention bien)",
          institution: "École Normale Supérieure de Rennes, Rennes",
          duration: "2024 - 2025",
          description: "Élève fonctionnaire-stagiaire en mécatronique. Au programme notamment : mécanique des milieux continus et du solide, dessin technique, CAO 3D et électronique analogique.",
          institutionLink: "https://www.ens-rennes.fr/",
          icon: 'ens-rennes.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Classe préparatoire aux grandes écoles d'ingénieurs",
          institution: "Lycée Hoche, Versailles",
          duration: "2022 - 2024",
          description: "Filière PCSI puis PSI* — formation intensive en mathématiques, physique et sciences de l'ingénieur.",
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
          role: "Stage de recherche",
          company: "ETH Zurich, Zurich, Suisse",
          duration: "2026",
          description: "J'ai travaillé sur les réseaux de neurones récurrents et leur interprétabilité, en testant des algorithmes d'apprentissage exacts. J'ai montré que cet apprentissage est PP-complet lorsque le nombre d'itérations est polynomial en la taille de l'entrée.",
          icon: 'ethz.svg',
          isIconMultiColor: true,
          institutionLink: "https://ethz.ch/",
        },
        {
          role: "Stage",
          company: "CERN, Meyrin, Suisse",
          duration: "Juin-Juillet 2025",
          description: "Au département BEAMS, j'ai contribué au projet FCC (Future Circular Collider) : développement et comparaison d'algorithmes d'estimation de pose pour la robotique, montage d'un banc d'essai dédié, et tests de robustesse en conditions exigeantes. J'ai aussi suivi les cours d'été sur la physique des particules, la physique expérimentale et l'informatique.",
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
      title: "Contact",
      subtitle: "N'hésitez pas à m'écrire — avec plaisir d'échanger.",
      emailText: "M'écrire"
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