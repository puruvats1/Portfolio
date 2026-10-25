import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export function FloatingElement({ children, className, delay = 0, yOffset = 10 }: FloatingElementProps) {
  return (
    <motion.div
      className={cn('absolute pointer-events-none z-0', className)}
      initial={{ y: 0 }}
      animate={{ y: [0, -yOffset, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
}
