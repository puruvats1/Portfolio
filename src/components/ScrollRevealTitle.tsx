import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * Ensures section headings are strictly hidden while in the lower 400px of the viewport,
 * preventing them from ever being seen coming through or behind the bottom-left menu dock.
 * As soon as the heading clears above the menu dock height, it smoothly reveals.
 */
export function ScrollRevealTitle({ children, className = '' }: ScrollRevealTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // On desktop, the menu buttons occupy the bottom ~360px of the screen.
      // With generous 430px clearance, headings are strictly hidden (opacity 0)
      // until they have safely cleared above the top of the menu dock.
      const menuClearance = window.innerWidth >= 1024 ? 430 : 80;
      const isAboveMenu = rect.top < (windowHeight - menuClearance);
      const isBelowTop = rect.bottom > 40;

      setIsVisible(isAboveMenu && isBelowTop);
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
            : { opacity: 0, y: 30, filter: 'blur(5px)' }
        }
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
