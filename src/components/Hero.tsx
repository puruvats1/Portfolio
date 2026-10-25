import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Code2, Compass, Sparkles } from 'lucide-react';

// Sequence of tokens for the bottom animating strip in refined grey tones
const WORDS_SEQUENCE = [
  { id: 'design', text: '<Design>', color: 'text-[#555555] font-semibold' },
  { id: 'code', text: '{code}', color: 'text-[#666666] font-medium' },
  { id: 'research', text: '(research)', color: 'text-[#777777] font-normal' },
  { id: 'music', text: '^Music^', color: 'text-[#468FFD] font-bold' },
  { id: 'art', text: '[Art]', color: 'text-[#666666] font-semibold' },
];

export function Hero() {
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);

  // Snappy sequential switching where each word sticks to the left end
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS_SEQUENCE.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Capability icons taking up the left side's top half space on the profile card
  const profileLeftIcons = [
    { id: 'design', label: 'Design', icon: PenTool },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'art', label: 'Art', icon: Sparkles },
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* CENTER NARRATIVE & DIALOGUE CARD (Cols 1-7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-col gap-7 sm:gap-8 max-w-2xl">
              
              {/* Clay Dialogue Card (Matching Figma node 58:2972, w=601.26, h=249.65) */}
              <AnimatePresence mode="wait">
                {isDialogueOpen ? (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="clay-dialogue-card border border-[#EDEDED] rounded-[28px] sm:rounded-[30px] p-6 sm:p-9 relative overflow-hidden"
                  >
                    {/* Top line with close circle button */}
                    <div className="flex items-center justify-end pb-3 sm:pb-4 mb-2">
                      <button
                        onClick={() => setIsDialogueOpen(false)}
                        className="w-7 h-7 rounded-full bg-[#D9D9D9] hover:bg-[#C8C8C8] flex items-center justify-center transition-colors cursor-pointer group shadow-xs"
                        aria-label="Close dialog"
                        title="Dismiss card"
                      >
                        <img
                          src="./close_icon.svg"
                          alt="Close"
                          className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    <div className="h-[1px] w-full bg-[#EAEAEA] mb-6 -mt-2" />

                    {/* Dialogue Main Statement - DM Sans SemiBold 32.29px / 1.2em */}
                    <p className="font-sans text-[23px] sm:text-[27px] lg:text-[32.3px] font-semibold leading-[1.2] tracking-[-0.015em]">
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
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-0">
            <div className="flex flex-col items-center lg:items-end gap-3.5 w-full sm:w-auto">
              
              {/* Profile Card (matching Figma node 58:2955, w=312.13, h=390.63, radius=27.5px) */}
              <motion.div
                whileHover={{ rotate: 0, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full max-w-[340px] sm:w-[316px] xl:w-[330px] h-[405px] clay-binder-card border border-[#EBEBEB] rounded-[28px] sm:rounded-[30px] relative overflow-hidden flex flex-col justify-between -rotate-[2deg] hover:rotate-0 transition-transform duration-300 mx-auto select-none shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                {/* 1. TOP-HALF LEFT END ICONS: Design, Code, Research, Art (nodes 58:2960 to 58:2963) */}
                <div
                  className="absolute left-3.5 sm:left-4 top-4 flex flex-col gap-2 z-20"
                  aria-label="Capabilities: Design, Code, Research, Art"
                >
                  {profileLeftIcons.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        title={item.label}
                        className="w-[36px] h-[40px] flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-default group"
                      >
                        <IconComponent className="w-5 h-5 transition-transform group-hover:scale-115" />
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

                {/* 3. BOTTOM ANIMATING STRIP: Snappy switching where words stick to left end in grey tones */}
                <div className="w-full overflow-hidden whitespace-nowrap py-2.5 bg-[#F4F4F4]/90 backdrop-blur-xs border-t border-[#EAEAEA] relative z-20 mt-auto pl-4 sm:pl-5 pr-2">
                  <div className="h-[48px] flex items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={wordIndex}
                        initial={{ x: 38, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -38, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.75 }}
                        className="flex items-center gap-3.5 text-[34px] sm:text-[38px] lg:text-[44px] leading-[1.2] font-display tracking-tight select-none whitespace-nowrap"
                      >
                        {/* Active word sticking cleanly to the left end (in grey tones, not black) */}
                        <span className={WORDS_SEQUENCE[wordIndex].color}>
                          {WORDS_SEQUENCE[wordIndex].text}
                        </span>

                        {/* Trailing upcoming words in soft, subtle grey */}
                        <span className="text-neutral-400/60 font-medium text-[32px] sm:text-[36px] lg:text-[42px]">
                          {WORDS_SEQUENCE[(wordIndex + 1) % WORDS_SEQUENCE.length].text}
                        </span>
                        <span className="text-neutral-300/40 font-normal text-[30px] sm:text-[34px] lg:text-[40px]">
                          {WORDS_SEQUENCE[(wordIndex + 2) % WORDS_SEQUENCE.length].text}
                        </span>
                      </motion.div>
                    </AnimatePresence>
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
