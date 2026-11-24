import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { EASE_OUT } from '../../lib/motion';

/**
 * Easter egg shared by the nav buttons and the skill keys: tapping the same button over and over
 * makes it burst into confetti and then pop back in.
 */
export const BURST_WINDOW_MS = 2200; // taps must land inside this window

export type BurstPhase = 'idle' | 'pop' | 'gone' | 'back';

/** What the burst does to the button itself, per phase (used as its animate prop). */
export const BURST_ANIMATE = {
  pop: { scale: 1.4, opacity: 0, transition: { duration: 0.18, ease: 'easeOut' as const } },
  gone: { scale: 0, opacity: 0, transition: { duration: 0 } },
  back: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 11 } },
};

/** Phase timings after the burst starts (ms): gone, back, done. */
export const BURST_TIMES = [180, 700, 1400] as const;

/** Confetti flying out from (x, y) in viewport coordinates. Rendered in a portal so no overflow clips it. */
export function BurstParticles({ x, y, colors, count = 16 }: { x: number; y: number; colors: string[]; count?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 46 + Math.random() * 54;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 6 + Math.random() * 6,
          color: colors[i % colors.length],
          round: i % 3 !== 0,
          spin: (Math.random() - 0.5) * 240,
          delay: Math.random() * 0.05,
        };
      }),
    [colors, count],
  );
  return createPortal(
    <div aria-hidden="true" className="fixed z-[200] pointer-events-none" style={{ left: x, top: y }}>
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className={`absolute block ${b.round ? 'rounded-full' : 'rounded-[3px]'}`}
          style={{ width: b.size, height: b.size, left: -b.size / 2, top: -b.size / 2, background: b.color }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
          animate={{ x: b.dx, y: b.dy + 14, scale: [0.4, 1.1, 0], opacity: [1, 1, 0], rotate: b.spin }}
          transition={{ duration: 0.75, delay: b.delay, ease: EASE_OUT }}
        />
      ))}
    </div>,
    document.body,
  );
}
