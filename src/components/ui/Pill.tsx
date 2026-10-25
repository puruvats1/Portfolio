import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface PillProps {
  children: ReactNode;
  className?: string;
  color?: 'white' | 'blue' | 'yellow' | 'green' | 'coral' | 'lavender' | 'pink' | 'grey' | 'ink';
}

const colorMap = {
  white: 'bg-white text-ink border-black/5',
  blue: 'bg-pastel-blue text-ink border-black/5',
  yellow: 'bg-butter text-ink border-black/5',
  green: 'bg-soft-green text-ink border-black/5',
  coral: 'bg-coral text-ink border-black/5',
  lavender: 'bg-lavender text-ink border-black/5',
  pink: 'bg-pink text-ink border-black/5',
  grey: 'bg-warm-grey text-ink border-black/5',
  ink: 'bg-ink text-canvas border-ink',
};

export function Pill({ children, className, color = 'white' }: PillProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm w-max',
        colorMap[color],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
