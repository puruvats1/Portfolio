import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { pop } from './ui/Pop';

/**
 * Companies Puru has worked with / for. Logos sit in a calm 3-column wall, in their own colours.
 *
 * Every logo is sized to cover roughly the same area (not the same height), so a tall stacked mark like
 * E-Cell and a long wordmark like AKAISPACE read as the same size. `ratio` is the logo's width / height;
 * `weight` nudges marks that look heavier (< 1) or lighter (> 1) than their area suggests.
 */
type Company = { name: string; src: string; ratio: number; weight?: number };

/**
 * Order = position in the 3x3 wall. Laid out as a checkerboard so colour is spread evenly:
 * the colourful logos sit on the corners and in the centre, the black / grey ones on the edges between them.
 * Rows also alternate shape: wide wordmarks top and bottom, the stacked marks together in the middle.
 *
 *   GE3S (colour)      D. E. Shaw (mono)       Akai Space (colour)
 *   E-Cell (mono)      Billow & Stone (colour) Mood Indigo (mono)
 *   napptix (colour)   wizora (mono)           absolute (colour)
 */
const COMPANIES: Company[] = [
  { name: 'GE3S', src: './ge3s_logo.png', ratio: 400 / 171 },
  { name: 'D. E. Shaw & Co.', src: './deshaw_logo.svg', ratio: 90 / 21, weight: 1.12 },
  { name: 'Akai Space', src: './logo2.png', ratio: 918 / 139, weight: 0.86 },
  { name: 'E-Cell, IIT Bombay', src: './logos/companies/ecell-iitb.png', ratio: 363 / 421, weight: 0.92 },
  { name: 'Billow & Stone', src: './logos/companies/billow-and-stone.svg', ratio: 223 / 84 },
  { name: 'Mood Indigo, IIT Bombay', src: './logos/companies/mood-indigo.png', ratio: 576 / 332, weight: 1.12 },
  { name: 'napptix', src: './logos/companies/napptix.png', ratio: 779 / 259 },
  { name: 'wizora', src: './logos/companies/wizora.svg', ratio: 267 / 73, weight: 0.95 },
  { name: 'absolute', src: './logos/companies/absolute.png', ratio: 802 / 265 },
];

/** the area (px²) every logo is scaled to cover */
const LOGO_AREA = 3700; // 70% of the earlier width/height (7600 × 0.7²)

const sizeOf = ({ ratio, weight = 1 }: Company) => {
  const height = Math.sqrt(LOGO_AREA / ratio) * weight;
  return { height, width: height * ratio };
};

export function Companies() {
  return (
    <section id="companies" className="py-20 sm:py-24 lg:py-32 overflow-visible scroll-mt-24">
      <div className="mb-10 sm:mb-12 lg:mb-14 text-center">
        <ScrollRevealTitle>
          <h2 className="font-display t-display heading-gradient">
            Companies I’ve worked with
          </h2>
        </ScrollRevealTitle>
      </div>

      <motion.ul {...pop(0)} className="grid grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-14 lg:gap-y-16 items-center">
        {COMPANIES.map((c) => {
          const { width } = sizeOf(c);
          return (
            <li key={c.name} className="flex items-center justify-center min-h-[64px] sm:min-h-[88px]">
              <img
                src={c.src}
                alt={c.name}
                title={c.name}
                loading="lazy"
                draggable={false}
                // scales down with the column on small screens, never past its own size
                style={{ width, maxWidth: '100%', height: 'auto', aspectRatio: `${c.ratio}` }}
                className="company-logo object-contain select-none"
              />
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
}
