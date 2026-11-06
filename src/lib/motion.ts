/**
 * Shared motion tokens for Motion (motion/react) configs.
 * Mirrors the CSS tokens in index.css (--ease-out, --ease-in-out) so JS and CSS motion feel the same.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const; // strong ease-out: entrances, exits, UI response
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const; // on-screen movement / morphing

/**
 * The first-load intro (hero + nav entrance) plays once per visit, not again when coming back
 * from a project page. Components read this when they first mount; App marks it played after its first mount.
 */
export const intro = { played: false };
