export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  domain: string;
  tags: string[];
  /** Behance or external case study */
  link: string;
  thumbnail: string;
  thumbnailVideo?: string;
  /** Hosted PDF, served from public/projects/pdfs/<slug>.pdf */
  pdf: string;
  /** Number of stacked panels in public/projects/<slug>/01.webp, 02.webp, ... (0 = none yet) */
  panelCount: number;
}

const PANEL_COUNTS: Record<string, number> = { 'ek-time': 57, 'strava-redesign': 28, squeezy: 13 };

const make = (p: Omit<Project, 'pdf' | 'panelCount'>): Project => ({
  ...p,
  pdf: `./projects/pdfs/${p.slug}.pdf`,
  panelCount: PANEL_COUNTS[p.slug] ?? 0,
});

export interface Milestone {
  label: string;
  /** 1-based panel number where this stage begins */
  panel: number;
}

/** Process stages used as jump markers on a project page */
export const MILESTONES: Record<string, Milestone[]> = {
  'ek-time': [
    { label: 'Brief', panel: 1 },
    { label: 'Research', panel: 6 },
    { label: 'Insights', panel: 15 },
    { label: 'Design', panel: 22 },
    { label: 'Evaluation', panel: 45 },
  ],
  squeezy: [
    { label: 'Problem', panel: 1 },
    { label: 'Prototype', panel: 4 },
    { label: 'Testing', panel: 5 },
    { label: 'Refinement', panel: 6 },
    { label: 'Evaluation', panel: 10 },
  ],
  'strava-redesign': [
    { label: 'Context', panel: 1 },
    { label: 'Analyse', panel: 5 },
    { label: 'Define', panel: 8 },
    { label: 'Redesign', panel: 20 },
    { label: 'Reflect', panel: 25 },
  ],
};

export const panelUrl = (slug: string, i: number) => `./projects/${slug}/${String(i).padStart(2, '0')}.webp`;

export const isVideo = (url?: string) => Boolean(url && /\.(mp4|webm|ogg|mov)$/i.test(url));

export const PROJECTS: Project[] = [
  make({
    id: '01',
    slug: 'deshaw-case-study',
    title: 'Re-thinking Data visualization for better company wide adoption.',
    category: 'Enterprise Data Visualization',
    year: '2026',
    domain: 'FinTech / Enterprise AI',
    tags: ['UI/UX', 'Data Vis', 'AI Systems'],
    link: 'https://puruvats1.github.io/deshaw-case-study/',
    thumbnail: './projects/final_thumbnail_deshaw_documentation_V3.mp4',
    thumbnailVideo: './projects/final_thumbnail_deshaw_documentation_V3.mp4',
  }),
  make({
    id: '02',
    slug: 'ek-time',
    title: 'Ek-time',
    category: 'Timetable Management System',
    year: '2025',
    domain: 'EdTech / Productivity',
    tags: ['UI/UX', 'System Design', 'Figma'],
    link: 'https://www.behance.net/gallery/235732005/Ek-time-Timetable-Managment-System-UX',
    thumbnail: './projects/project_01_Ek-time-Timetable-Managment-System-UX.png',
  }),
  make({
    id: '03',
    slug: 'strava-redesign',
    title: 'Strava Redesign',
    category: 'Ergonomic Evaluation & Redesign',
    year: '2025',
    domain: 'Fitness / Mobile',
    tags: ['UI/UX', 'Mobile App', 'Heuristic'],
    link: 'https://www.behance.net/gallery/235828073/Strava-Ergonomic-Evaluation-Redesign',
    thumbnail: './projects/project_02_Strava-Ergonomic-Evaluation-Redesign.png',
  }),
  make({
    id: '04',
    slug: 'squeezy',
    title: 'Squeezy',
    category: 'Pressure & Gesture based Interaction',
    year: '2025',
    domain: 'Interaction / Physical Computing',
    tags: ['Interaction', 'Gesture', 'Prototyping'],
    link: 'https://www.behance.net/gallery/258055263/SQUEEZY-Pressure-Gesture-based-Interaction',
    thumbnail: './projects/project_07_SQUEEZY-Pressure-Gesture-based-Interaction.png',
  }),
  make({
    id: '05',
    slug: 'tring-tring',
    title: 'Tring Tring',
    category: 'Cycle Sharing Platform',
    year: '2025',
    domain: 'Urban Mobility',
    tags: ['Interaction', 'Branding', 'Bubble.io'],
    link: 'https://www.behance.net/gallery/235067237/Tring-Tring-Cycle-Sharing-Platform',
    thumbnail: './projects/project_03_Tring-Tring-Cycle-Sharing-Platform.png',
  }),
  make({
    id: '06',
    slug: 'one-step-two-step',
    title: 'One Step Two Step',
    category: 'Immersive Web Storybook',
    year: '2025',
    domain: 'Interactive Web',
    tags: ['Web Design', 'Illustration', 'Framer'],
    link: 'https://www.behance.net/gallery/227102487/One-Step-Two-Step-Immersive-web-storybook',
    thumbnail: './projects/project_04_One-Step-Two-Step-Immersive-web-storybook.png',
  }),
  make({
    id: '07',
    slug: 'mood-indigo-2024',
    title: 'Mood Indigo 2024',
    category: 'Brand Identity & Festival Design',
    year: '2025',
    domain: 'Branding & Culture',
    tags: ['Brand Identity', 'Motion', 'Visual Design'],
    link: 'https://www.behance.net/gallery/235661139/MOOD-INDIGO-2024-BRAND-IDENTITY',
    thumbnail: './projects/project_06_MOOD-INDIGO-2024-BRAND-IDENTITY.jpg',
  }),
];

/** Projects with uploaded documentation open on-site; the rest go straight to Behance or their external case study. */
export const projectLinkProps = (p: Project) =>
  p.panelCount > 0
    ? { href: `#/project/${p.slug}` }
    : { href: p.link, target: '_blank', rel: 'noopener noreferrer' };
