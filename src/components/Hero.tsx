import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Code2, Compass, Music, Palette } from 'lucide-react';

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
    <section id="hero" className="relative min-h-[80vh] flex flex-col justify-center pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-18 lg:pb-20 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 xl:px-14">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-center">
          
          {/* CENTER NARRATIVE & DIALOGUE CARD (Cols 1-7 on xl desktop) */}
          <div className="xl:col-span-7 flex flex-col justify-center">
            <div className="flex flex-col gap-6 sm:gap-7 max-w-2xl xl:max-w-none">
              
              {/* Clay Dialogue Card (Matching Figma node 58:2972, w=601.26, h=249.65) */}
              <AnimatePresence mode="wait">
                {isDialogueOpen ? (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="clay-dialogue-card border border-[#EDEDED] rounded-[24px] sm:rounded-[30px] px-6 sm:px-8 md:px-9 pt-3 sm:pt-3.5 pb-6 sm:pb-8 relative overflow-hidden"
                  >
                    {/* Compact top bar with close circle button */}
                    <div className="flex items-center justify-end h-7 sm:h-8">
                      <button
                        onClick={() => setIsDialogueOpen(false)}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#D9D9D9] hover:bg-[#C8C8C8] flex items-center justify-center transition-colors cursor-pointer group shadow-xs"
                        aria-label="Close dialog"
                        title="Dismiss card"
                      >
                        <img
                          src="./close_icon.svg"
                          alt="Close"
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    {/* Edge-to-edge subtle hairline divider */}
                    <div className="h-[1px] -mx-6 sm:-mx-8 md:-mx-9 bg-[#EAEAEA] mt-2 sm:mt-2.5 mb-4 sm:mb-5" />

                    {/* Dialogue Main Statement - DM Sans SemiBold 32.29px / 1.2em */}
                    <p className="font-sans text-[20px] sm:text-[24px] md:text-[28px] xl:text-[32.3px] font-semibold leading-[1.25] sm:leading-[1.2] tracking-[-0.015em]">
                      <span className="bg-gradient-to-b from-[#42423E] via-[#60605A] to-[#80807A] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] inline">
                        I’m Puru and I resolve conflict between humans & computers so that they can be{' '}
                      </span>
                      <span className="text-[#468FFD] [-webkit-text-fill-color:#468FFD] font-bold inline">best friends.</span>
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
                {/* DM Sans Regular 16.15px / 26.24px (#525252) */}
                <p className="font-sans text-[15px] sm:text-[16.15px] text-[#525252] leading-[26.24px] max-w-xl font-normal">
                  B.Des '27 student at IDC, IIT Bombay. I’m drawn to challenging challenges ;) Always growing as an individual and as a professional.
                </p>

                {/* Previously At Logos */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
                  {/* Previously at - DM Sans Medium 12.11px / 16.15px (#A3A3A3) */}
                  <span className="font-sans text-[12.11px] leading-[16.15px] font-medium text-[#A3A3A3] shrink-0 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                    Previously at
                  </span>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-7">
                    {/* D. E. Shaw Logo */}
                    <div className="h-6 flex items-center hover:opacity-100 opacity-85 transition-opacity" title="D. E. Shaw & Co.">
                      <img
                        src="./deshaw_logo.svg"
                        alt="D. E. Shaw & Co."
                        className="h-4 sm:h-4.5 w-auto object-contain"
                      />
                    </div>

                    {/* GE3S Sustainability Logo - Cropped exact 400x171 aspect ratio matching Figma 56x24 */}
                    <div className="h-6 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="GE3S Sustainability Corp">
                      <img
                        src="./ge3s_logo.png"
                        alt="GE3S"
                        className="h-[21px] sm:h-[23px] w-auto object-contain"
                      />
                    </div>

                    {/* Akai Space Logo */}
                    <div className="h-6 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="AKAISPACE">
                      <img
                        src="./logo2.png"
                        alt="AKAISPACE"
                        className="h-3.5 sm:h-4 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: The 3D Profile Card with Left Icons, Avatar, & Snappy Grey Word Switcher */}
          <div className="xl:col-span-5 flex flex-col items-center xl:items-end justify-center pt-2 sm:pt-4 xl:pt-0">
            <div className="flex flex-col items-center xl:items-end gap-3.5 w-full sm:w-auto">
              
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
                  {/* Yellow Organic Blob Background (#FEEE94) */}
                  <div className="absolute top-2 right-2 w-[220px] h-[220px] rounded-full bg-[#FEEE94] opacity-95 blur-[0.5px] pointer-events-none" />
                  <div className="absolute top-12 right-6 w-[170px] h-[150px] rounded-[40px] bg-[#FEF3A8] opacity-80 pointer-events-none" />

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

                {/* 3. BOTTOM ANIMATING STRIP: Continuous horizontal sliding track (Greyscale, active bold, others light) */}
                <div className="w-full overflow-hidden whitespace-nowrap py-2.5 bg-[#F4F4F4]/90 backdrop-blur-xs border-t border-[#EAEAEA] relative z-20 mt-auto">
                  <div className="h-[48px] flex items-center overflow-hidden">
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
                        const isLead = i === 0;
                        return (
                          <span
                            key={`${word.id}-${i}-${wordIdx}`}
                            ref={i === 0 ? firstWordRef : i === 1 ? secondWordRef : null}
                            className={`inline-block whitespace-nowrap text-[32px] sm:text-[36px] lg:text-[40px] font-display leading-none tracking-tight transition-colors duration-200 ${
                              isLead
                                ? 'text-neutral-900 font-bold'
                                : 'text-neutral-400 font-light'
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

              {/* know me through my work ↓ CTA - DM Sans SemiBold 12.11px / 16.15px (#747373) (node 58:2965) */}
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 font-sans text-[12.11px] leading-[16.15px] font-semibold text-[#747373] hover:text-[#111110] transition-colors cursor-pointer group mt-1"
              >
                <span>know me through my work</span>
                <img
                  src="./cta_arrow.svg"
                  alt=""
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-1"
                />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
