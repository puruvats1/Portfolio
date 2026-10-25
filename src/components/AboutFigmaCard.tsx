import { motion } from 'motion/react';

export function AboutFigmaCard() {
  return (
    <div className="w-full max-w-[860px] mx-auto lg:mx-0 select-none relative overflow-visible">
      {/* Figma Node 96:176 Collage: Puru tipping cap, 90s albums, amp, plant, and keyboard */}
      <motion.div
        whileHover={{ y: -3, scale: 1.008 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full relative overflow-visible"
      >
        <img
          src="/about_card_96_176.png"
          alt="Puru Vats - Multidisciplinary life: music, plants, guitar, piano, and design"
          className="w-full h-auto object-contain drop-shadow-sm select-none pointer-events-none"
          loading="eager"
        />
      </motion.div>
    </div>
  );
}
