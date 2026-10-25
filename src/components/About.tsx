import { motion } from 'motion/react';
import { CardSpread } from './CardSpread';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { AboutFigmaCard } from './AboutFigmaCard';

export function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-28 overflow-visible">
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start">
          {/* Columns 1-3: Section title "'bout me!" sticky until scrolled past */}
          <div className="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient">
                'bout me!
              </h2>
            </ScrollRevealTitle>

            {/* Interactive Card Spread: light blank rectangles that fan out on hover with 20% breakout liberty */}
            <div className="hidden lg:block pt-1 -ml-1">
              <CardSpread label="Personal snapshots" />
            </div>
          </div>

          {/* Columns 4-8: Story text and Figma Frame 48 hero component (5 of 8 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8 overflow-visible">
            {/* Story text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
              <p>
                I'm a multidisciplinary person, from clay sculpting to zines to oil pastels I have tried multiple things but i keep coming back to <strong className="font-semibold text-ink">Interaction Design</strong>.
              </p>
              <p>
                Inspired by the beauty of everyday life and human behaviour supported by the skills I've gathered along from my visual craft to my sense of humor I try to make digital experiences <span className="font-medium text-ink">more meaningful</span>.
              </p>
            </div>

            {/* Figma Frame 48 Card: tactile rounded container with portrait & tilted Hello badges */}
            <div className="pt-2">
              <AboutFigmaCard />
            </div>

            <p className="text-neutral-500 text-sm max-w-xl">
              Other than that I've got the music taste of a divorced dad & I sing my heart out at karaoke, i play the guitar, piano, I killed 2 plants and currently taking care of 3 after learning a lesson.
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
