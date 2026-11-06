import { flushSync } from 'react-dom';

/**
 * Home <-> project page transition, built on the View Transitions API (runs off the main thread).
 *
 * Opening a project: the home page dissolves quickly while the project page pops up from the bottom
 * of the screen. Going back: the project page drops away and the home page fades back in.
 * Choreography lives in index.css under `html[data-vt=...]`.
 */
type Direction = 'forward' | 'back';

/** The project being returned to while a "back" transition renders the home page (its card starts in place). */
export const navState = { returningTo: null as string | null };

/** Wait (briefly) for the images the new page shows first (`img[data-vt-ready]`), so it rises in complete. */
const imagesReady = () =>
  Promise.race([
    Promise.all(
      Array.from(document.querySelectorAll<HTMLImageElement>('img[data-vt-ready]')).map((img) =>
        img.decode().catch(() => undefined),
      ),
    ),
    new Promise((resolve) => setTimeout(resolve, 400)),
  ]);

export function navigateWithTransition(update: () => void, { dir, slug }: { dir: Direction; slug: string }) {
  if (!document.startViewTransition) {
    update();
    return;
  }

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.dataset.vt = reduce ? 'reduced' : dir;
  navState.returningTo = dir === 'back' ? slug : null;

  const transition = document.startViewTransition(async () => {
    flushSync(update);
    if (dir === 'forward') {
      // a newly opened project starts at the top (the page's own effect would do this a moment later)
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      await imagesReady();
    }
  });

  transition.finished.finally(() => {
    navState.returningTo = null;
    delete root.dataset.vt;
  });
}

/** Start loading a project's first panel early (on hover / touch), so opening it is instant. */
export function prefetchImage(src: string) {
  const img = new Image();
  img.src = src;
}
