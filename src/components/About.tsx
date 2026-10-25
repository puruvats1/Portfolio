import { motion } from 'motion/react';
import { CardSpread } from './CardSpread';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { AboutFigmaCard } from './AboutFigmaCard';

export function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Columns 1-4: Section title "'bout me!" sticky until scrolled past */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                'bout me!
              </h2>
            </ScrollRevealTitle>

            {/* Interactive Card Spread: light blank rectangles that fan out on hover */}
            <div className="hidden lg:block pt-1">
              <CardSpread label="Personal snapshots" />
            </div>
          </div>

          {/* Columns 5-12: Story text and Figma Frame 48 hero component */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Story text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                I'm <strong className="font-semibold text-ink">Puru</strong>, an interaction designer graduating from <strong className="font-semibold text-ink">IDC, IIT Bombay</strong>. I'm fascinated by the strange space between human intuition, software architecture, and the mental models we form around tools.
              </p>
              <p>
                I naturally gravitate toward problems that are <span className="font-medium text-ink">dense, ambiguous, or difficult to explain</span>. I enjoy dissecting them, finding the hidden structure beneath the noise, and shaping interfaces that feel deceptively effortless.
              </p>
            </div>

            {/* Figma Frame 48 Card: tactile rounded container with portrait & tilted Hello badges */}
            <div className="pt-2">
              <AboutFigmaCard />
            </div>

            <p className="text-neutral-500 text-sm max-w-xl">
              Outside of Figma and code terminals, you’ll usually find me composing electronic music, experimenting with creative technology, or building quirky internet tools that make people smile.
            </p>

            {/* Mobile card spread display */}
            <div className="lg:hidden mt-2">
              <CardSpread label="Personal snapshots" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
