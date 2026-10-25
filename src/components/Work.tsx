import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  domain: string;
  tags: string[];
  link: string;
  thumbnail: string;
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Ek-time',
    category: 'Timetable Management System',
    year: '2025',
    domain: 'EdTech / Productivity',
    tags: ['UI/UX', 'System Design', 'Figma'],
    link: 'https://www.behance.net/gallery/235732005/Ek-time-Timetable-Managment-System-UX',
    thumbnail: './projects/project_01_Ek-time-Timetable-Managment-System-UX.png',
  },
  {
    id: '02',
    title: 'Strava Redesign',
    category: 'Ergonomic Evaluation & Redesign',
    year: '2025',
    domain: 'Fitness / Mobile',
    tags: ['UI/UX', 'Mobile App', 'Heuristic'],
    link: 'https://www.behance.net/gallery/235828073/Strava-Ergonomic-Evaluation-Redesign',
    thumbnail: './projects/project_02_Strava-Ergonomic-Evaluation-Redesign.png',
  },
  {
    id: '03',
    title: 'Tring Tring',
    category: 'Cycle Sharing Platform',
    year: '2025',
    domain: 'Urban Mobility',
    tags: ['Interaction', 'Branding', 'Bubble.io'],
    link: 'https://www.behance.net/gallery/235067237/Tring-Tring-Cycle-Sharing-Platform',
    thumbnail: './projects/project_03_Tring-Tring-Cycle-Sharing-Platform.png',
  },
  {
    id: '04',
    title: 'One Step Two Step',
    category: 'Immersive Web Storybook',
    year: '2025',
    domain: 'Interactive Web',
    tags: ['Web Design', 'Illustration', 'Framer'],
    link: 'https://www.behance.net/gallery/227102487/One-Step-Two-Step-Immersive-web-storybook',
    thumbnail: './projects/project_04_One-Step-Two-Step-Immersive-web-storybook.png',
  },
  {
    id: '05',
    title: 'Honey Trails',
    category: 'Playful Exhibition Design',
    year: '2025',
    domain: 'Spatial & Experience',
    tags: ['Exhibition', 'Spatial', 'Blender 3D'],
    link: 'https://www.behance.net/gallery/235895251/Honey-Trails-Exhibition-Design',
    thumbnail: './projects/project_05_Honey-Trails-Exhibition-Design.png',
  },
  {
    id: '06',
    title: 'Mood Indigo 2024',
    category: 'Brand Identity & Festival Design',
    year: '2025',
    domain: 'Branding & Culture',
    tags: ['Brand Identity', 'Motion', 'Visual Design'],
    link: 'https://www.behance.net/gallery/235661139/MOOD-INDIGO-2024-BRAND-IDENTITY',
    thumbnail: './projects/project_06_MOOD-INDIGO-2024-BRAND-IDENTITY.jpg',
  },
];

export function Work() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section id="work" className="py-16 sm:py-20 lg:py-28 scroll-mt-24">
      <div className="w-full">
        
        {/* Section title & View Mode Toggle (Grid / List) in the Blue Nav Clay style */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex items-center justify-between gap-4 flex-wrap">
          <ScrollRevealTitle>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight heading-gradient">
              My Work
            </h2>
          </ScrollRevealTitle>

          {/* Toggle option in the blue clay style of the nav buttons */}
          <div
            className="inline-flex items-center p-1 sm:p-1.5 rounded-[16px] sm:rounded-[18px] bg-[#EEF6FE] border border-[#BBDCFE] shadow-[inset_0px_1px_3px_rgba(43,127,255,0.08)] gap-1 sm:gap-1.5 select-none"
            role="group"
            aria-label="Project layout view toggle"
          >
            {/* Grid Option: icon-only when selected; shows text when not selected */}
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`h-9 sm:h-9.5 rounded-[12px] flex items-center justify-center cursor-pointer font-sans font-semibold text-[12px] sm:text-[13px] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] select-none transition-all duration-200 ease-out ${
                viewMode === 'grid'
                  ? 'px-2.5 sm:px-3 bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] border border-[#B7D9FF] pill-clay-blue text-[#1D4ED8] shadow-xs cursor-default'
                  : 'px-3 sm:px-3.5 text-[#2B7FFF] bg-white/45 hover:bg-white/90 hover:text-[#1D4ED8] hover:border-[#B7D9FF]/70 hover:shadow-2xs active:scale-95 active:bg-[#D5E7FD] active:text-[#1E3A8A] border border-transparent'
              }`}
              aria-pressed={viewMode === 'grid'}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2] text-current shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap text-current ${
                  viewMode === 'grid' ? 'max-w-0 opacity-0 -ml-1 pointer-events-none' : 'max-w-[50px] opacity-100 ml-1.5'
                }`}
              >
                Grid
              </span>
            </button>

            {/* List Option: icon-only when selected; shows text when not selected */}
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`h-9 sm:h-9.5 rounded-[12px] flex items-center justify-center cursor-pointer font-sans font-semibold text-[12px] sm:text-[13px] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] select-none transition-all duration-200 ease-out ${
                viewMode === 'list'
                  ? 'px-2.5 sm:px-3 bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] border border-[#B7D9FF] pill-clay-blue text-[#1D4ED8] shadow-xs cursor-default'
                  : 'px-3 sm:px-3.5 text-[#2B7FFF] bg-white/45 hover:bg-white/90 hover:text-[#1D4ED8] hover:border-[#B7D9FF]/70 hover:shadow-2xs active:scale-95 active:bg-[#D5E7FD] active:text-[#1E3A8A] border border-transparent'
              }`}
              aria-pressed={viewMode === 'list'}
              title="List view"
              aria-label="List view"
            >
              <List className="w-4 h-4 stroke-[2] text-current shrink-0" />
              <span
                className={`overflow-hidden transition-all duration-200 ease-out whitespace-nowrap text-current ${
                  viewMode === 'list' ? 'max-w-0 opacity-0 -ml-1 pointer-events-none' : 'max-w-[50px] opacity-100 ml-1.5'
                }`}
              >
                List
              </span>
            </button>
          </div>
        </div>

        {/* View Mode Switching: Grid or List (smooth instantaneous transition, zero layout jumps) */}
        <div>
          {viewMode === 'grid' ? (
            /* GRID VIEW (Default): 2 columns with generous cards and quiet micro-tags */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-8 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 w-full overflow-visible"
            >
              {PROJECTS.map((project) => (
                <a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:col-span-4 flex flex-col gap-3 group cursor-pointer w-full transition-all duration-300 hover:scale-[1.012]"
                >
                  {/* Clean thumbnail container (no gradient, no numbering) */}
                  <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-[20px] sm:rounded-[26px] bg-[#F2F1ED] border border-neutral-200/70 transition-all duration-300 group-hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] group-hover:-translate-y-1 relative overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Clean metadata section: tags placed right below thumbnail, above title */}
                  <div className="flex flex-col gap-2 px-1">
                    {/* Micro-tags cleanly spaced below thumbnail */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full bg-[#F3F2EE] text-[10.5px] sm:text-[11px] font-medium text-neutral-600 border border-neutral-200/60 transition-colors group-hover:bg-[#EAE8E2] group-hover:text-neutral-900"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title with hover arrow & category */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base sm:text-lg lg:text-xl font-semibold heading-gradient group-hover:opacity-85 transition-opacity">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                        <span>{project.category}</span>
                        <span className="text-neutral-300">·</span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </motion.div>
          ) : (
            /* LIST VIEW: Streamlined, high-craft editorial table rows */
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col divide-y divide-neutral-200/60 border-y border-neutral-200/60 w-full"
            >
              {PROJECTS.map((project) => (
                <a
                  key={project.id}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 group cursor-pointer hover:bg-neutral-50/80 px-2 sm:px-4 rounded-xl transition-all duration-150"
                >
                  <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                    <span className="font-mono text-xs text-neutral-400 font-medium w-6 shrink-0">
                      {project.id}
                    </span>
                    {/* Mini Thumbnail */}
                    <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-200/70 bg-neutral-100 hidden sm:block">
                      <img
                        src={project.thumbnail}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-semibold heading-gradient group-hover:opacity-85 transition-opacity truncate">
                        {project.title}
                      </h3>
                      {/* Non-disruptive Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-medium border border-neutral-200/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium pl-10 md:pl-0 shrink-0 self-end md:self-auto">
                    <span className="hidden lg:inline">{project.category}</span>
                    <span className="hidden lg:inline text-neutral-300">·</span>
                    <span>{project.year}</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}
