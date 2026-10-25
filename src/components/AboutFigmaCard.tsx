import { useState } from 'react';
import { motion } from 'motion/react';

export function AboutFigmaCard() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full max-w-[718px] mx-auto lg:mx-0 select-none">
      {/* Outer Card: Frame 48 & Rectangle 17 */}
      <div
        style={{
          boxShadow: '0px 7px 0px #C7C7C7',
        }}
        className={`
          relative w-full aspect-[718/379]
          rounded-[32px] sm:rounded-[70px] md:rounded-[100px] lg:rounded-[146px]
          bg-gradient-to-b from-[#F4F4F4] to-[#E3E3E3]
          overflow-hidden isolate border border-neutral-300/40
        `}
      >
        {/* Ellipse 13: Top Ambient Gloss Highlight */}
        <div
          style={{
            width: '85.65%',
            height: '25.59%',
            left: '7.10%',
            top: '-6.59%',
          }}
          className="absolute rounded-full bg-white/50 blur-[10.7px] pointer-events-none"
        />

        {/* Group 19 / Rectangle 18: White Portrait Card Frame */}
        <div
          style={{
            width: '39.00%',
            height: '74.68%',
            left: '8.22%',
            top: '13.43%',
          }}
          className="absolute rounded-[22px] sm:rounded-[48px] md:rounded-[70px] lg:rounded-[106px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          {/* Playful Young Man in Black Cap 1 */}
          <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
            {!imgError ? (
              <img
                src="/Playful Young Man in Black Cap.png"
                alt="Playful Young Man in Black Cap"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              // High-fidelity fallback vector illustration of young designer in black cap
              <div className="w-full h-full bg-[#FAFAFA] flex flex-col items-center justify-end relative overflow-hidden">
                <svg
                  viewBox="0 0 280 280"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full object-contain"
                >
                  {/* Subtle warm backdrop */}
                  <rect width="280" height="280" fill="#F4F3EE" />
                  
                  {/* Shoulders & Dark Hoodie */}
                  <path
                    d="M30 280 C35 220 70 190 140 190 C210 190 245 220 250 280 Z"
                    fill="#1A1A1A"
                  />
                  {/* Hoodie collar line */}
                  <path
                    d="M100 195 C120 230 160 230 180 195"
                    stroke="#2D2D2D"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  
                  {/* Neck */}
                  <rect x="122" y="150" width="36" height="48" rx="8" fill="#E8B998" />
                  
                  {/* Head / Face */}
                  <ellipse cx="140" cy="126" rx="42" ry="46" fill="#F7C9A9" />
                  
                  {/* Ears */}
                  <circle cx="97" cy="128" r="9" fill="#E8B998" />
                  <circle cx="183" cy="128" r="9" fill="#E8B998" />
                  
                  {/* Eyes & Friendly Smile */}
                  <circle cx="125" cy="122" r="3.5" fill="#222" />
                  <circle cx="155" cy="122" r="3.5" fill="#222" />
                  <path
                    d="M129 142 C135 150 145 150 151 142"
                    stroke="#A6583A"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  
                  {/* Stylish Modern Black Cap */}
                  {/* Cap dome */}
                  <path
                    d="M94 116 C95 72 185 72 186 116 Z"
                    fill="#151515"
                  />
                  {/* Cap visor pointing sideways / forward */}
                  <path
                    d="M86 114 C90 102 185 102 196 114 C175 124 105 124 86 114 Z"
                    fill="#0F0F0F"
                  />
                  {/* Cap button on top */}
                  <circle cx="140" cy="74" r="5" fill="#282828" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* ================= 6 SCATTERED "HELLO" PILL BADGES ================= */}

        {/* 1. Frame 42: White Pill (top left of cluster, -16.8deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -14, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '50.84%',
            top: '16.93%',
            width: '28.69%',
            height: '16.09%',
            transform: 'matrix(0.96, -0.29, 0.28, 0.96, 0, 0)',
          }}
          className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #181817 0%, #40403E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>

        {/* 2. Frame 45: Dark Pill (top right of cluster, +18deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: 20, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '70.75%',
            top: '25.26%',
            width: '23.54%',
            height: '16.09%',
            transform: 'matrix(0.95, 0.31, -0.3, 0.95, 0, 0)',
          }}
          className="absolute z-10 flex items-center justify-center rounded-full bg-[#202020] shadow-[0_6px_16px_rgba(0,0,0,0.18)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D1D1D1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>

        {/* 3. Frame 43: Dark Pill (middle left, -4.6deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -2, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '46.38%',
            top: '38.70%',
            width: '31.62%',
            height: '16.12%',
            transform: 'matrix(1, -0.08, 0.08, 1, 0, 0)',
          }}
          className="absolute z-10 flex items-center justify-center rounded-full bg-[#202020] shadow-[0_6px_16px_rgba(0,0,0,0.18)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E5E5E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>

        {/* 4. Frame 46: White Pill (middle right, -8deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -5, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '64.19%',
            top: '45.55%',
            width: '29.80%',
            height: '16.12%',
            transform: 'matrix(0.99, -0.14, 0.13, 0.99, 0, 0)',
          }}
          className="absolute z-10 flex items-center justify-center rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #181817 0%, #40403E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>

        {/* 5. Frame 44: Dark Pill (bottom left, +9.8deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: 12, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '47.07%',
            top: '56.97%',
            width: '36.77%',
            height: '16.12%',
            transform: 'matrix(0.99, 0.17, -0.17, 0.99, 0, 0)',
          }}
          className="absolute z-10 flex items-center justify-center rounded-full bg-[#202020] shadow-[0_6px_16px_rgba(0,0,0,0.18)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D0D0D0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>

        {/* 6. Frame 47: Electric Lime Pill (bottom right, -21.36deg) */}
        <motion.div
          whileHover={{ scale: 1.06, rotate: -18, zIndex: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            left: '70.05%',
            top: '63.85%',
            width: '26.88%',
            height: '15.83%',
            transform: 'rotate(-21.36deg)',
          }}
          className="absolute z-20 flex items-center justify-center rounded-full bg-[#A0FF25] shadow-[0_4px_16px_rgba(160,255,37,0.35)] cursor-pointer"
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #181817 0%, #40403E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            className="font-display font-semibold text-[11px] sm:text-[18px] md:text-[22px] lg:text-[28px] tracking-[-0.03em] leading-none"
          >
            Hello
          </span>
        </motion.div>
      </div>
    </div>
  );
}
