import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';

/**
 * ─── TWEAK ME ──────────────────────────────────────────────────────────────
 * Speech bubble over the avatar's head. Position is in % of the avatar IMAGE;
 * the bubble is anchored by its bottom-centre (the tail tip points at the head).
 */
export const HEAD_BUBBLE_POSITION = {
  left: '60%', // horizontal centre of the bubble
  top: '9%', // where the tail tip lands (just above the hair)
} as const;

export function HeadBubble({ text, showKey }: { text: string; showKey: number | null }) {
  const reduceMotion = useReducedMotion();

  const style = {
    left: `var(--bubble-left, ${HEAD_BUBBLE_POSITION.left})`,
    top: `var(--bubble-top, ${HEAD_BUBBLE_POSITION.top})`,
    translate: '-50% -100%',
  } as CSSProperties;

  return (
    // Always-mounted status region so screen readers announce the text when it appears.
    <div role="status" className="absolute z-30 pointer-events-none select-none" style={style}>
      <AnimatePresence>
        {showKey !== null && (
          <motion.div
            key={showKey}
            style={{ originX: 0.5, originY: 1 }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.15 : 0.25 } }}
            transition={
              reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 420, damping: 18 }
            }
            className="relative whitespace-nowrap rounded-[14px] bg-white border border-[#EBEBE8] shadow-[0_6px_16px_rgba(0,0,0,0.08)] px-3 py-1.5 font-sans text-[13px] font-semibold leading-none text-[#4A4A47]"
          >
            {text}
            {/* tail */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 -bottom-[5px] w-2.5 h-2.5 -translate-x-1/2 rotate-45 bg-white border-r border-b border-[#EBEBE8]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
