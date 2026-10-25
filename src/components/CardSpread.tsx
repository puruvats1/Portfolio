import { motion } from 'motion/react';

interface CardSpreadProps {
  label?: string;
}

export function CardSpread({ label = 'Highlights' }: CardSpreadProps) {
  const cards = [
    { id: 1, rot: -14, hoverRot: -28, x: -16, hoverX: -34, bg: 'bg-[#EDEDE8]' },
    { id: 2, rot: -5, hoverRot: -10, x: -5, hoverX: -12, bg: 'bg-[#F2F1ED]' },
    { id: 3, rot: 5, hoverRot: 10, x: 5, hoverX: 12, bg: 'bg-[#F6F5F2]' },
    { id: 4, rot: 14, hoverRot: 28, x: 16, hoverX: 34, bg: 'bg-[#FAF9F6]' },
  ];

  return (
    <div className="mt-6 pt-1">
      <motion.div
        className="relative h-24 w-44 group cursor-pointer flex items-center justify-center select-none"
        whileHover="hover"
        initial="rest"
        title={label}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={{
              rest: { rotate: card.rot, x: card.x, scale: 1 },
              hover: { rotate: card.hoverRot, x: card.hoverX, scale: 1.05 },
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className={`absolute w-14 h-20 rounded-xl ${card.bg} border border-neutral-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transform-gpu origin-bottom`}
          />
        ))}
      </motion.div>
    </div>
  );
}
