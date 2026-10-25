import { useState } from 'react';
import { Quote } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { GreyWords } from './ui/GreyWords';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Siddharth R.',
    role: 'Senior Product Designer',
    company: 'D. E. Shaw & Co.',
    quote:
      'Puru has an uncanny talent for taking hyper-dense financial dashboards and cutting right to the core interaction model. His engineering literacy meant he never designed in a vacuum—engineers loved his specs and interactive demos.',
  },
  {
    id: '2',
    name: 'Prof. Ananya Sen',
    role: 'Interaction Design Faculty',
    company: 'IDC, IIT Bombay',
    quote:
      'Puru approaches interaction problems with deep intellectual curiosity. He refuses to settle for superficial UI polish; he interrogates the underlying human mental models and emerges with genuinely novel solutions.',
  },
  {
    id: '3',
    name: 'Kabir Verma',
    role: 'Full-Stack Lead',
    company: 'Akai Space',
    quote:
      'Designing with Puru felt fast and effortless. His prototypes accounted for edge cases, asynchronous latency, and keyboard accessibility before we even brought them up. He elevates the standard of the entire room.',
  },
  {
    id: '4',
    name: 'Rohan Sharma',
    role: 'VP Technology & ESG',
    company: 'Ge3s Sustainability',
    quote:
      'Puru transformed an unmanageable regulatory reporting portal into a structured, delightful digital tool. He has a rare ability to simplify without compromising data integrity.',
  },
];

export function Testimonials() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-28 overflow-visible scroll-mt-24">
      <div className="w-full">
        
        {/* Title shifted to top, no longer column-divided */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <ScrollRevealTitle>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight tracking-tight heading-gradient">
              About me from others
            </h2>
          </ScrollRevealTitle>
        </div>

        {/* 4 Testimonial cards shifted below title, taking full horizontal width */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {TESTIMONIALS.map((t) => {
            const isHovered = hoveredCard === t.id;
            return (
              <div
                key={t.id}
                onMouseEnter={() => setHoveredCard(t.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  flex flex-col justify-between p-6 sm:p-8 rounded-[20px] sm:rounded-2xl border border-neutral-200/80 transition-shadow duration-300
                  bg-[#FDFDFD]
                  ${isHovered ? 'shadow-[0_12px_28px_rgba(0,0,0,0.08)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}
                `}
              >
                {/* Content quote replaced with rectangular grey shapes instead of words */}
                <div className="flex flex-col gap-4">
                  <Quote size={20} className="text-neutral-400 shrink-0" />
                  <GreyWords
                    text={t.quote}
                    height="h-3.5"
                    roundness="rounded-[3px]"
                    color="bg-neutral-200/90"
                  />
                </div>

                {/* Footer with redacted Name, Role, Company, and Anonymized Avatar */}
                <div className="mt-8 pt-5 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Anonymized profile icon */}
                    <div className="w-9 h-9 rounded-full bg-[#EAEAE6] border border-neutral-300/80 flex items-center justify-center shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-300/80" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {/* Redacted Name */}
                      <GreyWords
                        text={t.name}
                        height="h-3.5"
                        roundness="rounded-[3px]"
                        color="bg-neutral-300"
                      />
                      {/* Redacted Role */}
                      <GreyWords
                        text={t.role}
                        height="h-2.5"
                        roundness="rounded-[2px]"
                        color="bg-neutral-200/90"
                      />
                    </div>
                  </div>

                  {/* Redacted Company logo / name */}
                  <div className="flex items-center justify-end shrink-0">
                    <span
                      style={{ width: `${Math.max(64, Math.min(100, t.company.length * 5 + 30))}px` }}
                      className="h-5 rounded-[4px] bg-neutral-200/80 inline-block shrink-0"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
