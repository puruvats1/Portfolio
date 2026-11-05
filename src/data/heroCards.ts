/**
 * Hero "card deck" copy. Edit freely.
 *
 * - Wrap text in **double asterisks** to get the blue highlight.
 * - Cards are shown in order. Dismissing the last one loops back to the first
 *   (and plays CAPTION_ON_LOOP).
 * - Sweatdrops on the avatar: see SWEAT_DROPS_PER_CARD below.
 */
export const HERO_CARDS: string[] = [
  'I’m Puru and I resolve conflict between humans & computers so that they can be **best friends**.',
  'I’m Puru, a designer who creates intuitive, **user-centered** experiences.',
  'I’m Puru, a passionate, detail-oriented designer crafting seamless, delightful, **pixel-perfect** experiences that make an impact.',
];

/** Speech bubble by the avatar's head, shown for ~3s when the deck loops from the last card back to the first. */
export const CAPTION_ON_LOOP = 'this one’s better';

/**
 * How many sweatdrops the avatar shows for each card (same order as HERO_CARDS).
 * Drop positions are set in Sweatdrop.tsx (SWEATDROPS).
 */
export const SWEAT_DROPS_PER_CARD: number[] = [0, 1, 2];

/**
 * Tap-to-sweat: tapping the avatar fast makes it nervous. Taps are counted over a rolling window;
 * the drops go away again once the tapping slows down.
 *   TAPS_FOR_ONE_DROP  – this many taps inside the window → one sweatdrop ("taps a lot")
 *   TAPS_FOR_TWO_DROPS – this many → both sweatdrops ("taps a lot, lot")
 * The per-card drops above still apply; the avatar shows whichever is higher.
 */
export const TAP_WINDOW_MS = 5000;
export const TAPS_FOR_ONE_DROP = 8;
export const TAPS_FOR_TWO_DROPS = 16;
