import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

export function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-28 overflow-visible scroll-mt-24">
      <div className="w-full">
        
        {/* Section title: 'bout me! */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <ScrollRevealTitle>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight tracking-tight heading-gradient">
              'bout me!
            </h2>
          </ScrollRevealTitle>
        </div>

        {/* Two-column layout: the two paragraphs side by side, collage + note underneath */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 xl:gap-x-20 gap-y-8 sm:gap-y-10 items-start">
          <p className="font-sans text-[15px] sm:text-[15.5px] text-[#40403E] leading-[1.68] font-normal">
            I'm a multidisciplinary person, from clay sculpting to zines to oil pastels I have tried multiple things but i keep coming back to <strong className="font-semibold text-ink">Interaction Design</strong>.
          </p>

          <p className="font-sans text-[15px] sm:text-[15.5px] text-[#40403E] leading-[1.68] font-normal">
            Inspired by the beauty of everyday life and human behaviour supported by the skills I've gathered along from my visual craft to my sense of humor I try to make digital experiences <span className="font-medium text-ink">more meaningful</span>.
          </p>

          {/* Hobbies collage: albums, amp, plant, keyboard */}
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full max-w-[540px] select-none"
          >
            <img
              src="./about_hobbies.png"
              alt="Puru Vats musical taste and hobbies: 90s albums, guitar amp, plant, and keyboard"
              className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
              loading="eager"
            />
          </motion.div>

          {/* Reflection text beside the collage */}
          <p className="font-sans text-[13px] sm:text-[13.5px] text-[#71716E] leading-[1.65] max-w-lg md:self-center">
            Other than that I've got the music taste of a divorced dad & I sing my heart out at karaoke, i play the guitar, piano, I killed 2 plants and currently taking care of 3 after learning a lesson.
          </p>
        </div>
      </div>
    </section>
  );
}
