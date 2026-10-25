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
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Adaptive Spatial Systems',
    category: 'Spatial interaction & AI',
    year: '2026',
    domain: 'Spatial systems',
    tags: ['UX Design', 'Spatial', 'Prototype'],
    link: 'https://www.behance.net/gallery/235732005/Ek-time-Timetable-Managment-System-UX',
  },
  {
    id: '02',
    title: 'Financial Workflow Complexity',
    category: 'Quantitative trading systems',
    year: '2026',
    domain: 'Enterprise finance',
    tags: ['UX Design', 'App', 'Fintech'],
    link: 'https://www.behance.net/puruvats',
  },
  {
    id: '03',
    title: 'Playful Data Labeling',
    category: 'Machine learning UX',
    year: '2025',
    domain: 'Gamification',
    tags: ['UX Design', 'Prototype', 'AI/ML'],
    link: 'https://www.behance.net/puruvats',
  },
  {
    id: '04',
    title: 'Cognitive Load Optimization',
    category: 'Information architecture',
    year: '2025',
    domain: 'Human factors',
    tags: ['UX Design', 'App', 'Systems'],
    link: 'https://www.behance.net/gallery/235828073/Strava-Ergonomic-Evaluation-Redesign',
  },
  {
    id: '05',
    title: 'Generative Canvas Studio',
    category: 'Creative tooling',
    year: '2025',
    domain: 'Creative tools',
    tags: ['UX Design', 'App', 'Prototype'],
    link: 'https://www.behance.net/gallery/235067237/Tring-Tring-Cycle-Sharing-Platform',
  },
  {
    id: '06',
    title: 'Decentralized Commerce Protocol',
    category: 'Digital products',
    year: '2024',
    domain: 'Product ecosystems',
    tags: ['UX Design', 'App', 'Web3'],
    link: 'https://www.behance.net/gallery/227225375/Leafpit-Website-and-Identity',
  },
];

export function Work() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section id="work" className="py-16 sm:py-20 lg:py-28 scroll-mt-24">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10">
        
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
                  className="md:col-span-4 flex flex-col gap-3 group cursor-pointer w-full transition-all duration-300 hover:scale-[1.015]"
                >
                  {/* Spacious light rectangular placeholder with non-disruptive tags placed inside top-left */}
                  <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-[20px] sm:rounded-[26px] bg-[#F2F1ED] border border-neutral-200/70 transition-all duration-300 group-hover:bg-[#ECEBE6] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] group-hover:-translate-y-1 relative overflow-hidden flex items-center justify-center">
                    {/* Non-disruptive quiet tags badge row */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 flex flex-wrap items-center gap-1.5 z-10 pointer-events-none">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 sm:px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-xs text-[10px] sm:text-[10.5px] font-medium text-neutral-600 border border-neutral-200/60 shadow-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-neutral-400/50 font-mono text-sm font-medium tracking-widest group-hover:text-neutral-500/70 transition-colors">
                      {project.id}
                    </span>
                  </div>

                  {/* Clean text formatting with grey gradient title (max 3 words) and concise metadata */}
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="font-display text-base sm:text-lg lg:text-xl font-semibold heading-gradient group-hover:opacity-85 transition-opacity">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <span>{project.category}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{project.year}</span>
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
                  className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6 group cursor-pointer hover:bg-neutral-50/80 px-2 sm:px-4 rounded-xl transition-all duration-150"
                >
                  <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                    <span className="font-mono text-xs text-neutral-400 font-medium w-6 shrink-0">
                      {project.id}
                    </span>
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
