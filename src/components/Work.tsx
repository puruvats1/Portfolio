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
    <section id="work" className="pt-24 pb-24 lg:pt-32 lg:pb-32">
      <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columns 1-4: Section title "My Work" sticky until scrolled past */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                My Work
              </h2>
            </ScrollRevealTitle>
          </div>

          {/* Columns 5-12: 6 spacious project cards with minimal clean copy */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 group cursor-pointer w-full"
                >
                  {/* Generous, spacious light rectangular placeholder */}
                  <div className="w-full aspect-[4/3] rounded-2xl bg-[#F2F1ED] border border-neutral-200/70 transition-all duration-300 group-hover:bg-[#ECEBE6] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]" />

                  {/* Clean text formatting with grey gradient title and concise metadata */}
                  <div className="flex flex-col gap-1 px-1">
                    <h3 className="font-display text-lg sm:text-xl font-semibold heading-gradient group-hover:opacity-85 transition-opacity">
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                      <span>{project.category}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
