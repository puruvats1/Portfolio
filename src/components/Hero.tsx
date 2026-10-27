import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Code2, Compass, Music, Palette, X } from 'lucide-react';

// Sequence of tokens for the bottom animating strip in pure greyscale
const WORDS_SEQUENCE = [
  { id: 'design', text: '<Design>' },
  { id: 'code', text: '{code}' },
  { id: 'research', text: '(research)' },
  { id: 'music', text: '^Music^' },
  { id: 'art', text: '[Art]' },
];

export function Hero() {
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);
  const [queue, setQueue] = useState([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
  const [translateX, setTranslateX] = useState(0);
  const firstWordRef = useRef<HTMLSpanElement>(null);
  const secondWordRef = useRef<HTMLSpanElement>(null);

  // Snappy continuous sliding transition without any opacity drop or disappearing words
  useEffect(() => {
    const timer = setInterval(() => {
      setTranslateX((current) => {
        if (current === 0) {
          const shift =
            secondWordRef.current && firstWordRef.current
              ? secondWordRef.current.offsetLeft - firstWordRef.current.offsetLeft
              : 140;
          return -shift;
        }
        return current;
      });
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5 Capability icons taking up the left side's top half space on the profile card
  const profileLeftIcons = [
    { id: 'design', label: 'Design', icon: PenTool },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'art', label: 'Art', icon: Palette },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden sm:overflow-visible">
      <div className="w-full my-auto flex flex-col justify-center items-center">
        <div className="flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-14 2xl:gap-20 w-full max-w-6xl mx-auto overflow-visible">
          
          {/* CENTER NARRATIVE & DIALOGUE CARD */}
          <div className="flex-1 min-w-0 sm:min-w-[400px] lg:min-w-[440px] max-w-[620px] w-full flex flex-col items-center xl:items-start justify-center">
            <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-[620px]">
              
              {/* Clay Dialogue Card (Matching reference image) */}
              <AnimatePresence mode="wait">
                {isDialogueOpen ? (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="clay-dialogue-card border border-[#EBEBE8] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-10 lg:p-11 relative overflow-hidden w-full max-w-[620px]"
                  >
                    {/* Top-right circular close button matching reference image */}
                    <button
                      onClick={() => setIsDialogueOpen(false)}
                      className="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D9D9D9] hover:bg-[#CCCCCC] flex items-center justify-center transition-colors cursor-pointer group shadow-2xs z-10"
                      aria-label="Close dialogue"
                      title="Dismiss card"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#555555] group-hover:text-[#222222] transition-colors" strokeWidth={2.4} />
                    </button>

                    {/* Dialogue Main Statement - clean typography and layout matching reference image */}
                    <p className="font-sans text-[19px] sm:text-[21px] md:text-[24px] xl:text-[26px] font-medium leading-[1.38] tracking-[-0.015em] text-[#60605D] max-w-[95%] pr-6 sm:pr-8 pt-1 sm:pt-2">
                      I’m Puru and I resolve conflict between humans & computers so that they can be{' '}
                      <span className="text-[#2B7FFF] font-bold inline">best friends.</span>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={() => setIsDialogueOpen(true)}
                      className="px-4 py-2.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs sm:text-sm font-medium text-neutral-600 hover:text-ink hover:border-neutral-300 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>💬 Show message: "I resolve conflict between humans & computers..."</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Narrative Subtitle & Previous Experience */}
              <div className="flex flex-col gap-6 pl-1 sm:pl-2">
                {/* DM Sans Regular, prominent and legible supporting text */}
                <p className="font-sans text-[16px] sm:text-[17.5px] md:text-[18.5px] text-[#555552] leading-[27px] sm:leading-[30px] max-w-xl font-normal">
                  B.Des '27 student at IDC, IIT Bombay. I’m drawn to challenging challenges ;) Always growing as an individual and as a professional.
                </p>

                {/* Previously At Logos */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 lg:gap-5 pt-1">
                  {/* Previously at - DM Sans Medium */}
                  <span className="font-sans text-[12.5px] sm:text-[13.5px] md:text-[14px] leading-[18px] font-medium text-[#888884] shrink-0 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                    Previously at
                  </span>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-5 lg:gap-6">
                    {/* D. E. Shaw Logo */}
                    <div className="h-10 sm:h-11 md:h-12 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="D. E. Shaw & Co.">
                      <img
                        src="./deshaw_logo.svg"
                        alt="D. E. Shaw & Co."
                        className="h-9 sm:h-10 md:h-[44px] w-auto object-contain"
                      />
                    </div>

                    {/* GE3S Sustainability Logo */}
                    <div className="h-8 sm:h-9 md:h-10 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="GE3S Sustainability Corp">
                      <img
                        src="./ge3s_logo.png"
                        alt="GE3S"
                        className="h-6 sm:h-[26px] md:h-7 w-auto object-contain"
                      />
                    </div>

                    {/* Akai Space Logo */}
                    <div className="h-8 sm:h-9 md:h-10 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="AKAISPACE">
                      <img
                        src="./logo2.png"
                        alt="AKAISPACE"
                        className="h-5 sm:h-[22px] md:h-[24px] w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: The 3D Profile Card */}
          <div className="shrink-0 w-full max-w-[312px] sm:w-[316px] xl:w-[326px] flex flex-col items-center justify-start pt-2 sm:pt-4 xl:pt-0 relative overflow-visible">
            <div className="flex flex-col items-center gap-3.5 w-full sm:w-auto">
              
              {/* Profile Card (matching Figma node 58:2955, w=312.13, h=390.63, radius=27.5px) */}
              <motion.div
                whileHover={{ rotate: 0, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full max-w-[312px] sm:w-[316px] xl:w-[326px] h-[395px] sm:h-[405px] clay-binder-card border border-[#EBEBEB] rounded-[26px] sm:rounded-[30px] relative overflow-hidden flex flex-col justify-between rotate-0 sm:-rotate-[2deg] hover:rotate-0 transition-transform duration-300 mx-auto select-none shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                {/* 1. TOP-HALF LEFT END ICONS: Design, Code, Research, Music, Art */}
                <div
                  className="absolute left-3.5 sm:left-4 top-3.5 flex flex-col gap-1.5 z-20"
                  aria-label="Capabilities: Design, Code, Research, Music, Art"
                >
                  {profileLeftIcons.map((item) => {
                    const IconComponent = item.icon;
                    const isCurrent = WORDS_SEQUENCE[queue[0]].id === item.id;
                    return (
                      <div
                        key={item.id}
                        title={item.label}
                        className={`w-[34px] h-[34px] flex items-center justify-center transition-all duration-300 cursor-default group ${
                          isCurrent
                            ? 'text-neutral-900 scale-110'
                            : 'text-neutral-400/80 hover:text-neutral-900'
                        }`}
                      >
                        <IconComponent className="w-[19px] h-[19px] transition-transform group-hover:scale-115" />
                      </div>
                    );
                  })}
                </div>

                {/* 2. AVATAR AREA: Yellow organic blob backdrop and 3D curly avatar bust */}
                <div className="relative w-full flex-1 flex items-center justify-center pt-2 pl-8 overflow-hidden">
                  {/* Yellow Organic Blob Background (#FEEE94) directly from user SVG */}
                  <svg
                    width="231"
                    height="251"
                    viewBox="0 0 231 251"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -top-1.5 -right-1 pointer-events-none select-none w-[215px] sm:w-[231px] h-auto"
                  >
                    <path
                      d="M144.299 160.209C65.155 153.315 4.10114 112.083 7.93096 68.1144C11.7608 24.1457 79.024 -5.90948 158.168 0.9842C237.311 7.87788 298.365 49.11 294.535 93.0786C290.706 137.047 223.442 167.103 144.299 160.209Z"
                      fill="#FEEE94"
                    />
                    <path
                      d="M136.538 249.373C57.3948 242.479 -3.65906 201.247 0.170766 157.279C4.00059 113.31 71.2638 83.2548 150.407 90.1485C229.551 97.0421 290.605 138.274 286.775 182.243C282.945 226.212 215.682 256.267 136.538 249.373Z"
                      fill="#FEEE94"
                    />
                  </svg>

                  {/* 3D Clay Curly-Haired Avatar Bust (Flipped horizontally to face inwards towards content) */}
                  <div className="-scale-x-100 relative z-10 flex items-center justify-center translate-x-1 sm:translate-x-2">
                    <motion.img
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      src="./avatar_bust.png"
                      alt="Puru Vats 3D Avatar"
                      className="w-[168px] xl:w-[182px] h-auto object-contain select-none pointer-events-none drop-shadow-md"
                    />
                  </div>
                </div>

                {/* 3. BOTTOM ANIMATING STRIP: Transparent background, no stroke, shifted slightly up from card bottom */}
                <div className="w-full max-w-full overflow-hidden whitespace-nowrap py-1 bg-transparent relative z-20 mt-auto mb-3 sm:mb-4 select-none [contain:paint]">
                  <div className="h-[48px] w-full max-w-full flex items-center overflow-hidden [contain:paint]">
                    <motion.div
                      animate={{ x: translateX }}
                      transition={
                        translateX === 0
                          ? { duration: 0 }
                          : { duration: 0.58, ease: [0.16, 1, 0.3, 1] }
                      }
                      onAnimationComplete={() => {
                        if (translateX !== 0) {
                          setQueue((prev) => [
                            ...prev.slice(1),
                            (prev[prev.length - 1] + 1) % WORDS_SEQUENCE.length,
                          ]);
                          setTranslateX(0);
                        }
                      }}
                      className="flex items-center gap-4 sm:gap-5 whitespace-nowrap pl-4 sm:pl-5 select-none"
                    >
                      {queue.map((wordIdx, i) => {
                        const word = WORDS_SEQUENCE[wordIdx];
                        const isSliding = translateX !== 0;
                        const isBlack = isSliding ? i === 1 : i === 0;

                        return (
                          <span
                            key={`${word.id}-${i}-${wordIdx}`}
                            ref={i === 0 ? firstWordRef : i === 1 ? secondWordRef : null}
                            className={`inline-block whitespace-nowrap text-[22px] sm:text-[25px] lg:text-[27px] font-display font-bold leading-none tracking-tight transition-all duration-500 ${
                              isBlack
                                ? 'text-ink opacity-100'
                                : 'text-[#9B9B96] opacity-40'
                            }`}
                          >
                            {word.text}
                          </span>
                        );
                      })}
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* know me through my work ↓ CTA */}
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2.5 font-sans text-[13px] sm:text-[14px] leading-[18px] font-semibold text-[#666663] hover:text-[#111110] transition-colors cursor-pointer group mt-2"
              >
                <span>know me through my work</span>
                <img
                  src="./cta_arrow.svg"
                  alt=""
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-1"
                />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
