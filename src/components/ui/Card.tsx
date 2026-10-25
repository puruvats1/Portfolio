import { motion } from 'motion/react';
import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  color?: 'white' | 'blue' | 'yellow' | 'green' | 'coral' | 'lavender' | 'pink' | 'grey';
  hover?: boolean;
}

const colorMap = {
  white: 'bg-white',
  blue: 'bg-pastel-blue',
  yellow: 'bg-butter',
  green: 'bg-soft-green',
  coral: 'bg-coral',
  lavender: 'bg-lavender',
  pink: 'bg-pink',
  grey: 'bg-warm-grey',
};

export function Card({ children, className, color = 'white', hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        'rounded-3xl border border-black/5 shadow-sm p-6 overflow-hidden',
        colorMap[color],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
