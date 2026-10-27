import { useState, useEffect } from 'react';
import { Quote, Plus, Trash2, Sparkles } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { GreyWords } from './ui/GreyWords';
import { AddTestimonialModal, CustomTestimonial } from './AddTestimonialModal';

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
  const [customList, setCustomList] = useState<CustomTestimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('puru_user_testimonials');
      if (saved) {
        setCustomList(JSON.parse(saved));
      }
    } catch {
      // ignore local storage parse errors
    }
  }, []);

  const handleAddTestimonial = (item: CustomTestimonial) => {
    setCustomList((prev) => [item, ...prev]);
  };

  const handleDeleteTestimonial = (id: string) => {
    setCustomList((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('puru_user_testimonials', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-28 overflow-visible scroll-mt-24">
      <div className="w-full">
        
        {/* Title area with 'Leave a testimonial' button */}
        <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <ScrollRevealTitle>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight tracking-tight heading-gradient">
              About me from others
            </h2>
          </ScrollRevealTitle>

          {/* Leave a testimonial without signup */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-[#EAEAEA] hover:bg-[#DFDFDC] text-ink font-sans text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer group"
          >
            <Plus size={15} className="text-[#555] group-hover:text-ink transition-colors" />
            <span>Leave a testimonial</span>
          </button>
        </div>

        {/* Testimonial cards grid: Custom submissions + 4 core cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* User-submitted custom testimonials */}
          {customList.map((t) => {
            const isHovered = hoveredCard === t.id;
            return (
              <div
                key={t.id}
                onMouseEnter={() => setHoveredCard(t.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`
                  flex flex-col justify-between p-6 sm:p-8 rounded-[20px] sm:rounded-2xl border border-blue-200/80 transition-shadow duration-300
                  bg-gradient-to-br from-white to-blue-50/20
                  ${isHovered ? 'shadow-[0_12px_28px_rgba(43,127,255,0.08)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}
                `}
              >
                {t.redacted ? (
                  /* Redacted preview */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Quote size={20} className="text-neutral-400 shrink-0" />
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                        title="Delete this testimonial"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <GreyWords
                      text={t.quote}
                      height="h-3.5"
                      roundness="rounded-[3px]"
                      color="bg-neutral-200/90"
                    />
                  </div>
                ) : (
                  /* Real quote display */
                  <div className="flex flex-col gap-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <Quote size={20} className="text-[#2B7FFF] shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#2B7FFF] text-[10.5px] font-semibold tracking-tight">
                          <Sparkles size={10} />
                          New
                        </span>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Delete this testimonial"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="font-sans text-sm sm:text-[14.5px] text-[#444440] leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                )}

                {/* Footer for custom card */}
                {t.redacted ? (
                  <div className="mt-8 pt-5 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EAEAE6] border border-neutral-300/80 flex items-center justify-center shrink-0">
                        <div className="w-3.5 h-3.5 rounded-full bg-neutral-300/80" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <GreyWords text={t.name} height="h-3.5" roundness="rounded-[3px]" color="bg-neutral-300" />
                        <GreyWords text={t.role} height="h-2.5" roundness="rounded-[2px]" color="bg-neutral-200/90" />
                      </div>
                    </div>
                    <span className="h-5 rounded-[4px] bg-neutral-200/80 inline-block w-20 shrink-0" />
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#2B7FFF]/10 border border-[#2B7FFF]/25 text-[#2B7FFF] font-display font-bold text-xs flex items-center justify-center shrink-0">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans text-sm font-semibold text-ink leading-tight">
                          {t.name}
                        </span>
                        <span className="font-sans text-xs text-[#777774] leading-tight">
                          {t.role}
                        </span>
                      </div>
                    </div>

                    {t.company && (
                      <span className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-medium shrink-0">
                        {t.company}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Core 4 Testimonials */}
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

      {/* Add Testimonial Modal (No signup required) */}
      <AddTestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTestimonial={handleAddTestimonial}
      />
    </section>
  );
}
