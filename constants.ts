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
  { name: 'VHDL/Verilog', link: 'https://en.wikipedia.org/wiki/VHDL', icon: 'vhdl-verilog.svg' },

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
    description: "I built Otty, a local DAW with Tauri 2, React and Web Audio: arrangement, piano roll, instruments, effects and mixer.",
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
    description: "I developed this personal portfolio in React and TypeScript — bilingual and responsive — to present my background and projects.",
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
    description: "I wrote Otternet, a C library for machine learning and data science, designed to stay simple and efficient.",
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
    description: "I implemented the 7 colors game in C with SDL2, including AI opponents based on Minimax and Monte Carlo Tree Search.",
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
      description: "J'ai conçu Otty, une DAW locale (Tauri 2, React, Web Audio) avec arrangement, piano roll, instruments, effets et mixer.",
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
      description: "J'ai développé ce site personnel en React et TypeScript, bilingue et responsive, pour présenter mon parcours et mes projets.",
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
      description: "J'ai écrit Otternet, une bibliothèque en C pour le machine learning et la data science, pensée pour rester simple et efficace.",
      imageUrl: "/assets/otternet-logo.png",
      githubUrl: "https://github.com/SamuelOgulluk/Otternet",
      technologies: [
        LANGUAGES_DATA.find(l => l.name === 'C'),
        LANGUAGES_DATA.find(l => l.name === 'Python'),
        LANGUAGES_DATA.find(l => l.name === 'Git'),
      ].filter(Boolean) as SkillDetails[],
    },
    {
      title: "Jeu des 7 couleurs",
      description: "J'ai implémenté le jeu des 7 couleurs en C avec SDL2, et des adversaires IA basés sur Minimax et Monte Carlo Tree Search.",
      imageUrl: "/assets/7color.png",
      githubUrl: "https://github.com/SamuelOgulluk/7Colors",
      technologies: [
        LANGUAGES_DATA.find(l => l.name === 'C'),
        LANGUAGES_DATA.find(l => l.name === 'Git'),
      ].filter(Boolean) as SkillDetails[],
    },
];


export const TRANSLATIONS: { en: TranslationContent; fr: TranslationContent } = {
  en: {
    headerTitle: "Samuel Ogulluk",
    headerSubtitle: "Aspiring researcher in electrical engineering, computer science and applied mathematics",
    tabs: {
      portfolio: "Portfolio",
      utility: "Utility",
    },
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
      intro: "I am a student training for a research career, working at the intersection of electrical engineering, computer science and applied mathematics.",
    },
    about: {
      title: "About",
      bio: "As a student at École Normale Supérieure Paris-Saclay, I aim to become a researcher at the intersection of electrical engineering, computer science and applied mathematics. I am particularly interested in machine learning, both from theoretical and practical perspectives. Feel free to reach out for any collaboration.",
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
          description: "I am a student civil servant in the Department of Electronic and Digital Engineering. I study topics such as microprocessor architecture, computer science, signal and image processing, physics and AI.",
          institutionLink: "https://ens-paris-saclay.fr/",
          icon: 'ens_ps.svg',
          isIconMultiColor: true,
        },
        {
          degree: "BSc in Mechanical Engineering with the highest honours & BSc in Electrical Engineering with high honours",
          institution: "École Normale Supérieure de Rennes, Rennes",
          duration: "2024 - 2025",
          description: "I was a student civil servant in mechatronics. I took courses in continuum mechanics, rigid-body mechanics, engineering drawing, 3D CAD and analog electronics.",
          institutionLink: "https://www.ens-rennes.fr/",
          icon: 'ens-rennes.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Preparatory class for France's leading engineering Universities",
          institution: "Lycée Hoche, Versailles",
          duration: "2022 - 2024",
          description: "I completed PCSI then PSI* — an intensive preparatory track in mathematics, physics and engineering sciences.",
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
          description: "I worked on recurrent neural networks and their interpretability by testing exact learning algorithms. I showed that this learning problem is PP-complete when the number of iterations is polynomial in the input size.",
          icon: 'ethz.svg',
          isIconMultiColor: true,
          institutionLink: "https://ethz.ch/",
        },
        {
          role: "Research internship",
          company: "CERN, Meyrin, Switzerland",
          duration: "June-July 2025",
          description: "In the BEAMS department, I contributed to research on the FCC (Future Circular Collider) project. I developed and compared robotic pose estimation algorithms, built a dedicated testbed, and tested robustness under demanding conditions. I also attended Summer Student lectures on particle physics, experimental physics and computer science.",
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
      subtitle: "Feel free to reach out — I am always glad to discuss research ideas.",
      emailText: "Email me"
    },
    utility: {
      title: "YouTube downloader",
      subtitle: "Paste a YouTube link, choose video or audio, then download via yt-dlp.",
      linkLabel: "YouTube link",
      placeholder: "https://www.youtube.com/watch?v=…",
      modeVideo: "Video",
      modeAudio: "Audio",
      analyze: "Fetch formats",
      loading: "Fetching…",
      qualityLabel: "Format",
      download: "Download",
      downloading: "Downloading…",
      invalidUrl: "This does not look like a valid YouTube link.",
      fetchError: "Could not fetch this video. Try again in a moment.",
      noStreams: "No downloadable format was found for this video.",
      downloadFallback: "Direct save failed — the stream was opened in a new tab.",
      disclaimer: "For personal use only. Respect copyright and YouTube’s terms of service. Powered by yt-dlp.",
      lockTitle: "Protected area",
      lockSubtitle: "Enter the password to open the utility tab.",
      lockLabel: "Password",
      lockSubmit: "Unlock",
      lockWrong: "Wrong password.",
      toolYoutube: "YouTube",
      toolPdf: "PDF",
      pdf: {
        title: "PDF tools",
        subtitle: "Open PDF24 in a window, or merge / split / rotate files locally in the browser.",
        pdf24Title: "PDF24",
        pdf24Subtitle: "Opens the official PDF24 tools in a separate browser window (they block embedding).",
        openPdf24: "Open PDF24 window",
        popupBlocked: "The popup was blocked. Allow popups for this site, then try again.",
        localTitle: "Local tools",
        localSubtitle: "Processed on your device — files never leave the browser.",
        addFiles: "Add PDFs",
        clearFiles: "Clear list",
        merge: "Merge",
        split: "Extract pages",
        rotate: "Rotate 90°",
        rangeLabel: "Page range",
        rangePlaceholder: "1-3 or 2-",
        needMultiple: "Add at least two PDFs to merge.",
        needSingle: "Select exactly one PDF for this action.",
        processError: "Could not process this PDF. Try another file.",
        working: "Working…",
        disclaimer: "Local tools run entirely in your browser. PDF24 opens on tools.pdf24.org.",
      },
    }
  },
  fr: {
    headerTitle: "Samuel Ogulluk",
    headerSubtitle: "Étudiant-chercheur en ingénierie électronique, informatique et en mathématiques appliquées",
    tabs: {
      portfolio: "Portfolio",
      utility: "Utilitaire",
    },
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
      intro: "Je suis étudiant, en formation pour devenir chercheur, à l'intersection du génie électrique, de l'informatique et des mathématiques appliquées.",
    },
    about: {
      title: "À propos",
      bio: "Élève à l'École Normale Supérieure de Paris-Saclay, je souhaite devenir chercheur à l'intersection de l'ingénierie électronique, informatique et des mathématiques appliquées. Je m'intéresse tout particulièrement à l'apprentissage automatique, tant de manière théorique que pratique. N'hésitez pas à me contacter pour toute collaboration.",
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
          description: "Je suis élève fonctionnaire-stagiaire au département d'ingénierie électronique et numérique. J'y suis formé notamment en architecture des microprocesseurs, informatique, traitement du signal et de l'image, physique et IA.",
          institutionLink: "https://ens-paris-saclay.fr/",
          icon: 'ens_ps.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Licence en ingénierie mécanique (Mention très bien) & Licence en ingénierie électronique (Mention bien)",
          institution: "École Normale Supérieure de Rennes, Rennes",
          duration: "2024 - 2025",
          description: "J'étais élève fonctionnaire-stagiaire en mécatronique. J'y ai suivi notamment de la mécanique des milieux continus et du solide, du dessin technique, de la CAO 3D et de l'électronique analogique.",
          institutionLink: "https://www.ens-rennes.fr/",
          icon: 'ens-rennes.svg',
          isIconMultiColor: true,
        },
        {
          degree: "Classe préparatoire aux grandes écoles d'ingénieurs",
          institution: "Lycée Hoche, Versailles",
          duration: "2022 - 2024",
          description: "J'ai fait PCSI puis PSI* — une formation intensive en mathématiques, physique et sciences de l'ingénieur.",
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
          role: "Stage de recherche",
          company: "CERN, Meyrin, Suisse",
          duration: "Juin-Juillet 2025",
          description: "Au département BEAMS, j'ai contribué à la recherche sur le projet FCC (Future Circular Collider). J'ai développé et comparé des algorithmes d'estimation de pose pour la robotique, monté un banc d'essai dédié, et testé leur robustesse en conditions exigeantes. J'ai aussi suivi les cours d'été sur la physique des particules, la physique expérimentale et l'informatique.",
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
      subtitle: "N'hésitez pas à m'écrire — j'aime échanger autour de la recherche.",
      emailText: "M'écrire"
    },
    utility: {
      title: "Téléchargeur YouTube",
      subtitle: "Colle un lien YouTube, choisis vidéo ou audio, puis télécharge via yt-dlp.",
      linkLabel: "Lien YouTube",
      placeholder: "https://www.youtube.com/watch?v=…",
      modeVideo: "Vidéo",
      modeAudio: "Audio",
      analyze: "Récupérer les formats",
      loading: "Chargement…",
      qualityLabel: "Format",
      download: "Télécharger",
      downloading: "Téléchargement…",
      invalidUrl: "Ce lien YouTube ne semble pas valide.",
      fetchError: "Impossible de récupérer cette vidéo. Réessaie dans un instant.",
      noStreams: "Aucun format téléchargeable n'a été trouvé pour cette vidéo.",
      downloadFallback: "L'enregistrement direct a échoué — le flux a été ouvert dans un nouvel onglet.",
      disclaimer: "Usage personnel uniquement. Respecte le droit d'auteur et les conditions d'utilisation de YouTube. Propulsé par yt-dlp.",
      lockTitle: "Zone protégée",
      lockSubtitle: "Entre le mot de passe pour ouvrir l'onglet utilitaire.",
      lockLabel: "Mot de passe",
      lockSubmit: "Déverrouiller",
      lockWrong: "Mot de passe incorrect.",
      toolYoutube: "YouTube",
      toolPdf: "PDF",
      pdf: {
        title: "Outils PDF",
        subtitle: "Ouvre PDF24 dans une fenêtre, ou fusionne / découpe / tourne des fichiers localement dans le navigateur.",
        pdf24Title: "PDF24",
        pdf24Subtitle: "Ouvre les outils officiels PDF24 dans une fenêtre séparée (ils bloquent l'intégration iframe).",
        openPdf24: "Ouvrir la fenêtre PDF24",
        popupBlocked: "La popup a été bloquée. Autorise les popups pour ce site, puis réessaie.",
        localTitle: "Outils locaux",
        localSubtitle: "Traitement sur ton appareil — les fichiers ne quittent pas le navigateur.",
        addFiles: "Ajouter des PDF",
        clearFiles: "Vider la liste",
        merge: "Fusionner",
        split: "Extraire des pages",
        rotate: "Rotation 90°",
        rangeLabel: "Plage de pages",
        rangePlaceholder: "1-3 ou 2-",
        needMultiple: "Ajoute au moins deux PDF pour fusionner.",
        needSingle: "Sélectionne exactement un PDF pour cette action.",
        processError: "Impossible de traiter ce PDF. Essaie un autre fichier.",
        working: "Traitement…",
        disclaimer: "Les outils locaux tournent entièrement dans ton navigateur. PDF24 s'ouvre sur tools.pdf24.org.",
      },
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