import type { ReactNode } from 'react';

/**
 * Splits text into words that darken one by one as they scroll into reading position
 * (CSS scroll-driven `.ink-word` in index.css). Screen readers still read it as normal text.
 *
 * Usage: <InkText>plain words</InkText>, or keep a styled run together:
 * <InkText wrap={(w) => <strong className="font-semibold">{w}</strong>}>Interaction Design</InkText>
 */
export function InkText({ children, wrap }: { children: string; wrap?: (words: ReactNode) => ReactNode }) {
  const words = children.split(/(\s+)/).map((w, i) =>
    /^\s+$/.test(w) || w === '' ? w : (
      <span key={i} className="ink-word inline-block">
        {w}
      </span>
    ),
  );
  return <>{wrap ? wrap(words) : words}</>;
}
