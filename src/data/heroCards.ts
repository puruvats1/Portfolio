/**
 * Hero "card deck" copy. Edit freely.
 *
 * - Wrap text in **double asterisks** to get the blue highlight.
 * - Cards are shown in order. Dismissing the last one loops back to the first
 *   (and plays CAPTION_ON_LOOP).
 * - Sweatdrops on the avatar: see SWEAT_DROPS_PER_CARD below.
 */
export const HERO_CARDS: string[] = [
  'I’m Puru and I resolve conflict between humans & computers so that they can be **best friends**',
  'I’m Puru, a designer who creates intuitive, **user-centered** experiences.',
  'I’m Puru, a detail-oriented designer crafting delightful, **pixel-perfect** experiences.',
];

/**
 * The highlighted word on the first card gets backspaced and retyped as an alternative, then back again:
 *   best friends (long) → buddies → lovers → lovers? → lovers? NO → back to best friends
 * That loop plays `loops` times, then it settles on best friends and stays still, so it never competes with
 * reading the rest of the hero.
 * Times are in ms. `hold` = how long a word stays fully typed before it's backspaced.
 * Screen readers always hear the main word; visitors with reduce-motion turned on just see it, static.
 */
export const HERO_WORD_CYCLE = {
  word: 'best friends', // must match the **highlighted** text in HERO_CARDS[0]
  startMs: 650, // when the card appears, wait this long, then write the main word out
  firstHold: 7500, // after it is first written out on load: long enough to read the whole card before anything moves
  hold: 5500, // best friends, between loops
  loops: 2, // how many times the loop plays before it settles on best friends for good
  /**
   * Each round is a script of steps; after its last step the word goes back to `word` and the next round
   * (or the same one again, if there is only one) starts.
   * A step that only adds letters to the one before it ("lovers" → "lovers?" → "lovers? NO") is typed on
   * the end without erasing anything, so each addition appears as its own beat. The word is only erased
   * when the next step is not an extension of it.
   */
  rounds: [
    [
      { text: 'buddies', hold: 2400 },
      { text: 'lovers', hold: 750 },
      { text: 'lovers?', hold: 1500 },
      { text: 'lovers? NO', hold: 1300 },
    ],
  ],
  typeMs: 125, // per letter while typing (each letter also fades in)
  deleteMs: 75, // per letter while backspacing
  pauseMs: 380, // the beat with the word fully erased, before the new one starts
};

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
