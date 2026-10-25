import { useState } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  quote: string;
  renderLogo: () => React.ReactNode;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Siddharth R.',
    initials: 'SR',
    role: 'Senior Product Designer',
    company: 'D. E. Shaw & Co.',
    quote:
      'Puru has an uncanny talent for taking hyper-dense financial dashboards and cutting right to the core interaction model. His engineering literacy meant he never designed in a vacuum—engineers loved his specs and interactive demos.',
    renderLogo: () => (
      <svg
        viewBox="18 250 620 140"
        className="h-4.5 w-auto fill-current text-ink opacity-85"
        aria-label="D. E. Shaw & Co."
      >
        <path d="M157.3,313.8v18.5h-3.1c-3.1-13.2-5.3-15-16.2-15h-12v28.2c15.1-0.2,17.4-2.6,17.8-11.1h3.4V360h-3.5c-0.4-8.3-2.8-10.7-17.7-10.8v32.4h2c23.2,0,25.9-5.4,27.6-17.9h3.5l-1.8,21.4H106v-3.5h9.1v-64.4H106v-3.4H157.3 M502.9,288.7h115.3v3.5H502.9L502.9,288.7z M491,255.2l-80.2,33.7H21.6v3.5h389.9l80.9-33.8l-1.4-3.1 M65.9,383.1c-6.3,1.7-12.7,2.3-19.2,2H21.6v-3.5h9.1v-64.4h-9.1v-3.4h25.1c6.4-0.3,12.9,0.4,19.1,2c14.1,4.2,21.3,15.7,21.3,33.7S80,379,65.9,383.1 M63.3,319.8c-5.3-2-11-2.8-16.6-2.6h-5.1v64.4h5.1c5.7,0.3,11.3-0.6,16.6-2.4c8.3-3.9,11.8-12.6,11.8-29.7S71.8,323.7,63.3,319.8L63.3,319.8z M394,385.2l11.2-48h7v-3.5h-19.5v3.5h8.6l-8.8,37.2l-2.1-8.5l-8-27.4h-7.3l-10.3,35.9l-1.7-8.6l-6.8-28.7h7.8v-3.5h-23.9v3.5h6.8l11.5,47.9h7.3l10.4-36.8l2.4,9.4l8.1,27.4L394,385.2 M597.7,332.9c16.2,0,23.9,8.3,23.9,26.7s-7.7,26.7-23.9,26.7s-23.8-8.6-23.8-26.8c0-18.3,7.6-26.7,23.8-26.7 M597.7,336.2c-5.8,0-13.1,2.8-13.1,23.2s7.3,23.2,13.1,23.2s13.2-2.8,13.2-23.2s-7.3-23.4-13.2-23.4V336.2z M565.7,315.9c-6.4-2.3-13.3-3.4-20.1-3.1c-23.9,0-35.9,12.8-35.9,36.7c0,23.4,11.9,36.7,35.9,36.7c6.9,0.1,13.7-1.2,20-3.9l1.6-18.4h-3.5c-2.3,11.8-8.6,18.6-18.8,18.6c-5.1,0.4-10.1-1.3-14-4.7c-5.4-5.2-8.3-14.4-8.3-28.2c0-13.8,3-23.8,8.9-28.9c3.4-2.9,7.8-4.3,12.2-4.2c11,0,16.9,6.8,18.8,15.7h3.1L565.7,315.9 M225.2,316.1c-5.7-2.2-11.8-3.3-18-3.1c-15,0-23.5,7.2-23.5,18.6c0,10.2,5.5,15.4,15,19.3l9.7,4.1c0,0,10,7.8,10,14.4c0,8.5-4.8,13.2-13.8,13.2s-16.3-6.7-19.1-18.8h-3.1l1.6,18.6c5.9,2.6,12.4,3.9,18.8,3.8c15.3,0,25.5-7.8,25.5-21.3c0-11.5-6.3-16-15.7-19.9l-9.4-3.9c-6.6-2.7-9.4-6-9.4-13.2c0-7.2,5.3-11.3,12.1-11.3c8.9,0,13.9,5.4,15.9,15.9h3.4L225.2,316.1 M282.1,347.2c0-10.4-6.6-14.8-14.1-14.8c-7-0.2-13.5,3.4-17,9.4v-28.2h-16.9v3.5h7v64.5h-7v3.5h24.3v-3.5H251v-28.2c-0.1-3.4,0.8-6.7,2.4-9.7c2.2-3.9,6.3-6.4,10.9-6.5c5.1,0,7.9,3.6,7.9,10v34.5h-7.3v3.5h24.2v-3.6h-7V347 M334.2,369.3v-22.6c0-10.4-7.5-14.1-19-14.1s-19.5,4.1-19.5,11.5c0,2.9,2.3,5.2,5.2,5.3h0.6c1.8,0.2,3.6-0.5,4.9-1.9v-2.4c0-5.9,2.9-9.2,8.6-9.2c4.5-0.6,8.6,2.6,9.1,7c0.1,0.6,0.1,1.2,0,1.9v7.7l-17,5.4c-4.7,1.7-12.6,4.5-12.6,13.7c0,10.2,7.1,14.7,16.4,14.7c7.5,0,12.6-2.6,15.1-8.3c1.4,6.3,7.5,8.8,14.6,7.4v-3.1c-3.5-1.1-6.3-5.4-6.3-12.9 M324.6,369.3c0,8.3-3.4,12.2-9.7,12.2c-5.6,0-8.8-3.8-8.8-10c0-8.9,4.6-10.5,10.7-12.6l7.8-2.7V369.3z M479.6,376.1c6.3-6.6,9.6-15.5,9.1-24.7c-0.1-4.3-0.8-8.5-2.1-12.6h-16.9v3.1c3.9-0.2,7.8,1.1,10.7,3.7c2.6,2.9,4,6.8,3.7,10.7c0,6.4-2.5,12.6-6.9,17.3c-0.7-0.8-2-2-2.7-2.8c-10.4-10.5-19.4-22.4-26.5-35.3c-1.5-2.8-2.4-6-2.5-9.2c-0.4-5.3,3.6-9.9,8.9-10.3c0.5,0,0.9,0,1.4,0c6.7,0,11.8,3.9,14.1,15.7h3.1V316c-5-2.3-10.5-3.4-16-3.1c-11.9,0-20.3,5.6-20.3,17.1c0.1,3.8,1,7.5,2.7,11c-8.5,2.9-14,11-13.7,20c0,12.4,9.4,25.6,28.2,25.6c6.5,0.2,12.9-1.4,18.6-4.6c5.2,2.6,10.8,4.1,16.6,4.4l1-2.8c-3.8-2-7.3-4.5-10.5-7.3 M459.2,382.2c-6.4,0.1-12.6-2.3-17.3-6.8c-4.6-4.8-7.1-11.2-7-17.9c-0.4-5.4,1.5-10.7,5.3-14.5c6.6,12.4,15.2,23.7,25.3,33.5c1.2,1.2,2.5,2.4,3.9,3.5C466.3,381.4,462.8,382.2,459.2,382.2L459.2,382.2z" />
      </svg>
    ),
  },
  {
    id: '2',
    name: 'Prof. Ananya Sen',
    initials: 'AS',
    role: 'Interaction Design Faculty',
    company: 'IDC, IIT Bombay',
    quote:
      'Puru approaches interaction problems with deep intellectual curiosity. He refuses to settle for superficial UI polish; he interrogates the underlying human mental models and emerges with genuinely novel solutions.',
    renderLogo: () => (
      <span className="text-xs font-semibold text-neutral-800 tracking-tight">
        IDC, IIT Bombay
      </span>
    ),
  },
  {
    id: '3',
    name: 'Kabir Verma',
    initials: 'KV',
    role: 'Full-Stack Lead',
    company: 'Akai Space',
    quote:
      'Designing with Puru felt fast and effortless. His prototypes accounted for edge cases, asynchronous latency, and keyboard accessibility before we even brought them up. He elevates the standard of the entire room.',
    renderLogo: () => (
      <img
        src="./logo2.png"
        alt="Akai Space"
        className="h-3.5 sm:h-4 w-auto object-contain opacity-85"
      />
    ),
  },
  {
    id: '4',
    name: 'Rohan Sharma',
    initials: 'RS',
    role: 'VP Technology & ESG',
    company: 'Ge3s Sustainability',
    quote:
      'Puru transformed an unmanageable regulatory reporting portal into a structured, delightful digital tool. He has a rare ability to simplify without compromising data integrity.',
    renderLogo: () => (
      <img
        src="./ge3s_logo.png"
        alt="Ge3s"
        className="h-5 sm:h-5.5 w-auto object-contain opacity-85"
      />
    ),
  },
  {
    id: '5',
    name: 'Maya Kulkarni',
    initials: 'MK',
    role: 'Design Peer & Researcher',
    company: 'IDC, IIT Bombay',
    quote:
      'Whenever our cohort gets stuck on interaction loops, Puru is the person we brainstorm with. He builds functional interactive demos overnight that turn circular arguments into concrete decisions.',
    renderLogo: () => (
      <span className="text-xs font-semibold text-neutral-800 tracking-tight">
        IDC, IIT Bombay
      </span>
    ),
  },
];

export function Testimonials() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columns 1-4: Section title "About me from others" sticky until scrolled past */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                About me from others
              </h2>
            </ScrollRevealTitle>
          </div>

          {/* Columns 5-12: Testimonial cards */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {TESTIMONIALS.map((t) => {
                const isHovered = hoveredCard === t.id;
                return (
                  <div
                    key={t.id}
                    onMouseEnter={() => setHoveredCard(t.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`
                      flex flex-col justify-between p-5 sm:p-7 rounded-[20px] sm:rounded-2xl border border-neutral-200/80 transition-shadow duration-300
                      bg-[#FDFDFD]
                      ${isHovered ? 'shadow-[0_12px_28px_rgba(0,0,0,0.08)]' : 'shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}
                    `}
                  >
                    <div className="flex flex-col gap-4">
                      <Quote size={20} className="text-neutral-400" />
                      <p className="text-sm text-neutral-700 leading-relaxed font-normal">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Name initial profile icon */}
                        <div className="w-9 h-9 rounded-full bg-[#EAEAE6] border border-neutral-300/80 flex items-center justify-center font-display font-bold text-xs text-ink shrink-0">
                          {t.initials}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-display font-semibold text-sm text-ink">
                            {t.name}
                          </span>
                          <span className="text-xs text-neutral-500 font-normal">
                            {t.role}
                          </span>
                        </div>
                      </div>

                      {/* Company logo inside testimonial card */}
                      <div className="flex items-center justify-end shrink-0 max-w-[120px]">
                        {t.renderLogo()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
