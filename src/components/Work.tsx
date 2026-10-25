import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  domain: string;
}

const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Adaptive Spatial Systems',
    category: 'Spatial interaction & AI',
    year: '2026',
    domain: 'Spatial systems',
  },
  {
    id: '02',
    title: 'Financial Workflow Complexity',
    category: 'Quantitative trading systems',
    year: '2026',
    domain: 'Enterprise finance',
  },
  {
    id: '03',
    title: 'Playful Data Labeling',
    category: 'Machine learning UX',
    year: '2025',
    domain: 'Gamification',
  },
  {
    id: '04',
    title: 'Cognitive Load Optimization',
    category: 'Information architecture',
    year: '2025',
    domain: 'Human factors',
  },
  {
    id: '05',
    title: 'Generative Canvas Studio',
    category: 'Creative tooling',
    year: '2025',
    domain: 'Creative tools',
  },
  {
    id: '06',
    title: 'Decentralized Commerce Protocol',
    category: 'Digital products',
    year: '2024',
    domain: 'Product ecosystems',
  },
];

export function Work() {
  return (
    <section id="work" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-[1240px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10">
        {/* Section title placed directly above project thumbnails */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <ScrollRevealTitle>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight heading-gradient">
              My Work
            </h2>
          </ScrollRevealTitle>
        </div>

        {/* Project cards now span the full width with spacious 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 w-full">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3.5 group cursor-pointer w-full"
            >
              {/* Generous, spacious light rectangular placeholder */}
              <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-[20px] sm:rounded-[26px] bg-[#F2F1ED] border border-neutral-200/70 transition-all duration-300 group-hover:bg-[#ECEBE6] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] group-hover:-translate-y-1 relative overflow-hidden flex items-center justify-center">
                <span className="text-neutral-400/50 font-mono text-sm font-medium tracking-widest group-hover:text-neutral-500/70 transition-colors">
                  {project.id}
                </span>
              </div>

              {/* Clean text formatting with grey gradient title and concise metadata */}
              <div className="flex flex-col gap-1 px-1">
                <h3 className="font-display text-lg sm:text-xl lg:text-2xl font-semibold heading-gradient group-hover:opacity-85 transition-opacity">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-medium">
                  <span>{project.category}</span>
                  <span className="text-neutral-300">·</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
