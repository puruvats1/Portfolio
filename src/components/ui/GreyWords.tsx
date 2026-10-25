import React from 'react';

interface GreyWordsProps {
  text: string;
  height?: string;
  roundness?: string;
  color?: string;
  className?: string;
}

export function GreyWords({
  text,
  height = 'h-3.5',
  roundness = 'rounded-[3px]',
  color = 'bg-neutral-200/90',
  className = '',
}: GreyWordsProps) {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-2 select-none ${className}`}>
      {words.map((word, i) => {
        // Natural width calculation based on word length
        const charLen = word.replace(/[^a-zA-Z0-9]/g, '').length;
        const width = Math.max(22, Math.min(110, charLen * 8.5 + 12));
        return (
          <span
            key={i}
            style={{ width: `${width}px` }}
            className={`${height} ${roundness} ${color} inline-block shrink-0 transition-opacity hover:opacity-75`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
