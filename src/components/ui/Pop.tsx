import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, type HTMLMotionProps } from 'motion/react';
import { EASE_OUT } from '../../lib/motion';

/**
 * Scroll "pop": the element springs up into place (slight overshoot) every time it scrolls into view,
 * and quietly resets once it has scrolled out, so it pops again on the way back.
 * The transition lives on the whileInView target, so hover/tap animations on the same element keep their own feel.
 * Spread onto any motion element: <motion.p {...pop(0.08)}>, or wrap: <Pop delay={0.08}>…</Pop>.
 */
const HIDDEN = { opacity: 0, y: 32, scale: 0.94 };
const VIEWPORT = { once: false, margin: '0px 0px -10% 0px' };

export const pop = (delay = 0) => ({
  initial: HIDDEN,
  whileInView: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, duration: 0.8, bounce: 0.28, delay },
  },
  viewport: VIEWPORT,
});

export function Pop({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div {...pop(delay)} className={className}>
      {children}
    </motion.div>
  );
}

const POP_VARIANTS = {
  hidden: { ...HIDDEN, transition: { duration: 0.25, ease: EASE_OUT } },
  shown: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, duration: 0.8, bounce: 0.28, delay },
  }),
};

/**
 * A link that pops like `pop()`, with one extra: `skipFirst` starts it already in place
 * (used for the project card you are returning to, so the page transition lands on a visible card).
 * After it has been on screen once it behaves like every other pop.
 */
export function PopAnchor({
  skipFirst = false,
  delay = 0,
  ...props
}: HTMLMotionProps<'a'> & { skipFirst?: boolean; delay?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const [startShown] = useState(skipFirst);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);
  const visible = inView || (startShown && !seen);

  return (
    <motion.a
      ref={ref}
      variants={POP_VARIANTS}
      custom={delay}
      initial={startShown ? 'shown' : 'hidden'}
      animate={visible ? 'shown' : 'hidden'}
      {...props}
    />
  );
}
