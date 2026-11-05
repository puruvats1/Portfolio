import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';

/**
 * ─── TWEAK ME ──────────────────────────────────────────────────────────────
 * One entry per drop. Drop #1 shows first; drop #2 joins it, etc.
 * How many are visible per card is set in src/data/heroCards.ts
 * (SWEAT_DROPS_PER_CARD).
 *
 * Positions are in % of the avatar IMAGE (so they hold on resize). Each drop is
 * anchored by its centre; values are on-screen, i.e. after the avatar mirror.
 *
 *   left / top : centre of the drop (0% = top-left of the image)
 *   width      : drop width, as % of the image width
 *   rotate     : tilt of the drop
 *   slide      : px the drop slowly creeps down after popping in
 *   delay      : seconds before it pops in
 *
 * Can also be overridden from CSS: --sweat-1-left, --sweat-1-top,
 * --sweat-1-width, --sweat-1-rotate (and -2-, …) on any ancestor.
 */
export const SWEATDROPS = [
  { left: '47%', top: '33%', width: '10%', rotate: '10deg', slide: 6, delay: 0 },
  { left: '33%', top: '35%', width: '8%', rotate: '-14deg', slide: 5, delay: 0.12 },
] as const;

export function Sweatdrop({ count }: { count: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {SWEATDROPS.slice(0, count).map((d, i) => {
        const n = i + 1;
        const wrapperStyle = {
          left: `var(--sweat-${n}-left, ${d.left})`,
          top: `var(--sweat-${n}-top, ${d.top})`,
          width: `var(--sweat-${n}-width, ${d.width})`,
          rotate: `var(--sweat-${n}-rotate, ${d.rotate})`,
          // centre-anchor; translate is a separate CSS property so it composes with `rotate`
          translate: '-50% -50%',
        } as CSSProperties;
        const gradId = `sweat-fill-${n}`;

        return (
          <div
            key={n}
            aria-hidden="true"
            className="absolute z-20 pointer-events-none select-none"
            style={wrapperStyle}
          >
            <motion.svg
              viewBox="0 0 24 32"
              className="block w-full h-auto overflow-visible drop-shadow-[0_2px_2px_rgba(60,110,170,0.25)]"
              style={{ originX: 0.5, originY: 0.35 }}
              initial={reduceMotion ? { opacity: 0 } : { scale: 0, y: 0, opacity: 1 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1, y: d.slide, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.15 : 0.2, delay: 0 } }}
              transition={
                reduceMotion
                  ? { duration: 0.15 }
                  : {
                      // underdamped spring → overshoots to ~1.15 then settles at 1
                      scale: { type: 'spring', stiffness: 420, damping: 12, delay: d.delay },
                      y: { duration: 1.5, ease: 'easeOut', delay: d.delay },
                    }
              }
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#EAF6FF" />
                  <stop offset="0.55" stopColor="#B4DDFF" />
                  <stop offset="1" stopColor="#7CC0FA" />
                </linearGradient>
              </defs>
              {/* teardrop body, soft outline */}
              <path
                d="M12 1.5C12 1.5 3.2 12.8 3.2 20.4a8.8 8.8 0 0 0 17.6 0C20.8 12.8 12 1.5 12 1.5Z"
                fill={`url(#${gradId})`}
                stroke="#8DC8F7"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* white highlight */}
              <ellipse
                cx="8.4"
                cy="20"
                rx="2"
                ry="3.6"
                fill="#fff"
                opacity="0.9"
                transform="rotate(14 8.4 20)"
              />
              <circle cx="9.6" cy="14.4" r="0.9" fill="#fff" opacity="0.85" />
            </motion.svg>
          </div>
        );
      })}
    </AnimatePresence>
  );
}
