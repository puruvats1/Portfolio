import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * Ensures section headings smoothly reveal as they enter view, with bottom-of-page
 * detection to guarantee the final section's title always triggers and displays.
 */
export function ScrollRevealTitle({ children, className = '' }: ScrollRevealTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Bottom-of-page detection: when user is at or near the bottom, always trigger in-view titles
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 250;

      const menuClearance = window.innerWidth >= 1024 ? 100 : 50;
      const isAboveMenu = rect.top < (windowHeight - menuClearance);
      const isBelowTop = rect.bottom > 20;

      setIsVisible((isAboveMenu && isBelowTop) || (isNearBottom && rect.top < windowHeight));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        initial={false}
        animate={
          isVisible
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0, y: 24, filter: 'blur(4px)' }
        }
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
