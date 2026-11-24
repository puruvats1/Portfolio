import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { InkText } from './ui/InkText';
import { Pop, pop } from './ui/Pop';

export function About() {
  return (
    <section id="about" className="py-20 sm:py-24 lg:py-32 overflow-visible scroll-mt-24">
      <div className="w-full">

        {/* Section title: 'bout me! */}
        <div className="mb-10 sm:mb-12 lg:mb-14">
          <ScrollRevealTitle>
            <h2 className="font-display t-display heading-gradient">
              ’bout me!
            </h2>
          </ScrollRevealTitle>
        </div>

        {/* Two-column layout: the two paragraphs side by side, collage + note underneath.
            The copy darkens word by word as it scrolls up (InkText). */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 xl:gap-x-20 gap-y-8 sm:gap-y-10 items-start">
          <motion.p {...pop(0)} className="font-sans t-body text-ink-body">
            <InkText>My passion for computers, technology and art has got me from breaking toy cars to build a glider, building my own pc and drawing my favorite cartoons at an early age to now designing digital products, experiences and brand identities.</InkText>
          </motion.p>

          <motion.p {...pop(0.08)} className="font-sans t-body text-ink-body">
            <InkText>To me design means making navigation through everyday life smooth, delightful and memorable. I’m really intrigued by design philosophies and positioning which makes working even more enjoyable when I have a goal and I know how my work would make an impact.</InkText>
          </motion.p>

          {/* Hobbies collage: the academic prize trophy at the front of the row, then albums, amp, plant, keyboard, and a guitar leaning on the end.
              The whole group drifts gently against the scroll. */}
          <Pop className="w-full max-w-[600px]">
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="drift relative w-full select-none"
          >
            <img
              src="./about_hobbies.png"
              alt="Puru Vats musical taste and hobbies: 90s albums, guitar amp, plant, and keyboard"
              className="block ml-auto w-[86%] h-auto object-contain select-none pointer-events-none drop-shadow-sm"
              loading="eager"
            />
            <img
              src="./about_trophy.png"
              alt="Institute Academic Prize trophy"
              className="absolute left-0 bottom-[-4%] w-[25%] h-auto -rotate-[4deg] select-none pointer-events-none drop-shadow-sm"
              loading="eager"
            />
            {/* the electric guitar, leaning against the keyboard at the other end of the row from the trophy */}
            <img
              src="./about_guitar.png"
              alt="Electric guitar"
              className="absolute right-[-5%] bottom-[-2%] w-[17%] h-auto rotate-[9deg] select-none pointer-events-none drop-shadow-sm"
              loading="eager"
            />
          </motion.div>
          </Pop>

          {/* Reflection text beside the collage */}
          <motion.p {...pop(0.1)} className="font-sans t-meta !font-normal !leading-[1.65] text-ink-subtle max-w-lg md:self-center">
            <InkText>Other than that I have received the academic prize 2 times, I’ve got the music taste of a divorced dad & I sing my heart out at karaoke, i play the guitar, piano, I killed 2 plants and currently taking care of 3 after learning a lesson.</InkText>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
