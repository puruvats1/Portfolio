import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Hand, Music } from 'lucide-react';
import { SmileyNavIcon } from './LeftSidebar';

/**
 * ─── TWEAK ME ──────────────────────────────────────────────────────────────
 * Each tap on the avatar releases ONE bubble holding an icon. Icons come out in
 * a random order (a shuffled "bag": every icon once, reshuffled when empty).
 * Tap a lot and bubbles accumulate. Positions are in % of the avatar IMAGE;
 * bubbles are anchored by their centre.
 */
export const BUBBLE_ORIGIN = { left: '50%', top: '18%' } as const; // crown of the head
const BUBBLE_SIZE_PX = 40; // base diameter (±10% random)
const BUBBLE_LIFETIME_S = 2.4;
const MAX_LIVE_BUBBLES = 14;
const SPREAD_PX = 28; // horizontal gap between consecutive taps' bubbles

// ── Icons ──────────────────────────────────────────────────────────────────
// Music: lucide's Music (same icon as the hero's capability list).
// Smiley: SmileyNavIcon from the site's left nav (Figma node 99:301).
// Waving hand: new — lucide's Hand with two "wave" arcs, wobbling in the bubble.
// Each bubble is skinned like one of the site's 3D clay nav buttons (LeftSidebar
// palette + the .btn-clay-* shadows in index.css).

function WavingHandIcon({ className }: { className?: string }) {
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <motion.span
        className="block w-full h-full"
        style={{ originX: 0.6, originY: 0.9 }}
        animate={{ rotate: [-8, 14, -8, 14, -8] }}
        transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity }}
      >
        <Hand className="w-full h-full" strokeWidth={2.2} />
      </motion.span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        aria-hidden="true"
      >
        <path d="M1.5 5.5c.8-1.4 1.9-2.3 3.2-2.8" opacity="0.7" />
        <path d="M22.5 5.5c-.8-1.4-1.9-2.3-3.2-2.8" opacity="0.7" />
      </svg>
    </span>
  );
}

const ICONS = {
  hand: {
    skin: 'from-[#FFF9CE] to-[#FEEA80] border-[#F7DF59]/75 btn-clay-yellow text-[#A8730F]',
    render: () => <WavingHandIcon className="w-[52%] h-[52%]" />,
  },
  music: {
    skin: 'from-[#E6F1FE] to-[#72BDFF] border-[#B7D9FF]/75 btn-clay-blue text-[#3F74E3]',
    render: () => <Music className="w-[52%] h-[52%]" strokeWidth={2.4} />,
  },
  smile: {
    skin: 'from-[#FFE9DC] to-[#FED2BE] border-[#FDBA74]/75 btn-clay-peach text-[#D8693B]',
    render: () => <SmileyNavIcon className="w-[60%] h-[60%]" />,
  },
} as const;
type IconKey = keyof typeof ICONS;
const ICON_KEYS = Object.keys(ICONS) as IconKey[];

function shuffled<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Bubble {
  id: number;
  icon: IconKey;
  size: number;
  dx: number; // final horizontal drift (px)
  rise: number; // vertical travel (px)
}

let nextId = 0;

/**
 * Transparent tap target over the avatar plus the bubbles it releases.
 * Render inside the avatar's `relative` wrapper so % positions track the image.
 */
export function AvatarBubbles({ onTap }: { onTap?: () => void }) {
  const reduceMotion = useReducedMotion();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bag = useRef<IconKey[]>([]);
  const taps = useRef(0);
  const lastIcon = useRef<IconKey | null>(null);

  const release = useCallback(() => {
    onTap?.();
    if (bag.current.length === 0) {
      // refill with a fresh shuffle; the next pop is the LAST element, so make sure
      // it isn't the icon we just showed
      const next = shuffled(ICON_KEYS);
      const end = next.length - 1;
      if (next[end] === lastIcon.current) [next[0], next[end]] = [next[end], next[0]];
      bag.current = next;
    }
    const icon = bag.current.pop() as IconKey;
    lastIcon.current = icon;

    // walk across 5 lanes so rapid taps fan out instead of stacking
    const lane = taps.current++ % 5;
    const bubble: Bubble = {
      id: nextId++,
      icon,
      size: BUBBLE_SIZE_PX * (0.9 + Math.random() * 0.2),
      dx: (lane - 2) * SPREAD_PX + (Math.random() - 0.5) * 12,
      rise: 40 + Math.random() * 18,
    };
    setBubbles((prev) => [...prev, bubble].slice(-MAX_LIVE_BUBBLES));
  }, [onTap]);

  const remove = useCallback((id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={release}
        aria-label="Tap Puru's avatar to blow bubbles"
        className="absolute inset-0 z-10 rounded-[40%] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF]"
      />

      {/* decorative; position anchor for the bubbles */}
      <div
        aria-hidden="true"
        className="absolute z-30 w-0 h-0 pointer-events-none"
        style={{ left: BUBBLE_ORIGIN.left, top: BUBBLE_ORIGIN.top }}
      >
        {bubbles.map((b) => {
          const { skin, render } = ICONS[b.icon];
          return (
            <motion.div
              key={b.id}
              onAnimationComplete={() => remove(b.id)}
              className={`absolute flex items-center justify-center rounded-full border bg-gradient-to-b ${skin}`}
              style={{
                width: b.size,
                height: b.size,
                left: -b.size / 2,
                top: -b.size / 2,
              }}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={
                reduceMotion
                  ? { opacity: [0, 1, 1, 0], scale: 1, x: b.dx, y: -BUBBLE_SIZE_PX }
                  : {
                      opacity: [0, 1, 1, 0],
                      scale: [0, 1, 1, 1.3], // last step = pop
                      x: [0, b.dx * 0.8, b.dx * 0.95, b.dx],
                      y: [0, -b.rise * 0.4, -b.rise * 0.75, -b.rise],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 1.4, times: [0, 0.1, 0.85, 1] }
                  : {
                      duration: BUBBLE_LIFETIME_S,
                      times: [0, 0.14, 0.88, 1],
                      ease: 'easeOut',
                    }
              }
            >
              {render()}
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
