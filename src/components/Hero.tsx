import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { PenTool, Code2, Compass, Music, Palette } from 'lucide-react';
import { HeroCardDeck } from './HeroCardDeck';
import { Sweatdrop } from './Sweatdrop';
import { HeadBubble } from './HeadBubble';
import { AvatarBubbles } from './AvatarBubbles';
import {
  CAPTION_ON_LOOP,
  SWEAT_DROPS_PER_CARD,
  TAP_WINDOW_MS,
  TAPS_FOR_ONE_DROP,
  TAPS_FOR_TWO_DROPS,
} from '../data/heroCards';

/** Logo with a small hover description (role held there). */
function LogoTip({ tip, children }: { tip: string; children: React.ReactNode }) {
  return (
    <div className="group relative h-7 sm:h-8 flex items-center opacity-90 hover:opacity-100 transition-opacity cursor-default">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[10px] bg-white border border-neutral-200/80 px-3 py-1.5 font-sans text-[13px] font-medium leading-none text-[#555552] shadow-[0_10px_24px_rgba(0,0,0,0.07),0_2px_6px_rgba(0,0,0,0.04)] opacity-0 transition-[opacity,translate] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        {tip}
      </span>
    </div>
  );
}

// Sequence of tokens for the bottom animating strip in pure greyscale
const WORDS_SEQUENCE = [
  { id: 'design', text: '<Design>' },
  { id: 'code', text: '{code}' },
  { id: 'research', text: '(research)' },
  { id: 'music', text: '^Music^' },
  { id: 'art', text: '[Art]' },
];

export function Hero() {
  const [cardIndex, setCardIndex] = useState(0);
  const [bubbleKey, setBubbleKey] = useState<number | null>(null);

  // Tap-to-sweat: count avatar taps over a rolling window (thresholds in heroCards.ts)
  const [tapDrops, setTapDrops] = useState(0);
  const tapTimes = useRef<number[]>([]);
  const evaluateTaps = useCallback(() => {
    const now = Date.now();
    tapTimes.current = tapTimes.current.filter((t) => now - t < TAP_WINDOW_MS);
    const n = tapTimes.current.length;
    setTapDrops(n >= TAPS_FOR_TWO_DROPS ? 2 : n >= TAPS_FOR_ONE_DROP ? 1 : 0);
  }, []);
  const handleAvatarTap = useCallback(() => {
    tapTimes.current.push(Date.now());
    evaluateTaps();
  }, [evaluateTaps]);
  // While sweating, keep re-checking so the drops disappear once the tapping stops
  useEffect(() => {
    if (tapDrops === 0) return;
    const id = setInterval(evaluateTaps, 400);
    return () => clearInterval(id);
  }, [tapDrops, evaluateTaps]);
  const [queue, setQueue] = useState([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
  const [translateX, setTranslateX] = useState(0);

  // Speech bubble auto-hides after ~3s, or as soon as the next card is dismissed.
  useEffect(() => {
    if (bubbleKey === null) return;
    const t = setTimeout(() => setBubbleKey(null), 3000);
    return () => clearTimeout(t);
  }, [bubbleKey]);
  useEffect(() => {
    if (cardIndex !== 0) setBubbleKey(null);
  }, [cardIndex]);
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
              
              {/* Clay Dialogue Card deck (copy lives in src/data/heroCards.ts) */}
              <HeroCardDeck
                index={cardIndex}
                onIndexChange={setCardIndex}
                onLoop={() => setBubbleKey(Date.now())}
              />

              {/* Narrative Subtitle & Previous Experience */}
              <div className="flex flex-col gap-6 pl-1 sm:pl-2">
                {/* DM Sans Regular, prominent and legible supporting text */}
                <p className="font-sans text-[15px] sm:text-[15.5px] text-[#555552] leading-[1.68] max-w-xl font-normal">
                  B.Des ‘27 at IDC, IIT Bombay. I dig until I understand the problem, design until it feels obvious, and build until it actually works.
                </p>

                {/* Previously At Logos */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
                  {/* Previously at - DM Sans Medium */}
                  <span className="font-sans text-[13px] sm:text-[14px] md:text-[14.5px] leading-[18px] font-medium text-[#888884] shrink-0 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                    Previously at
                  </span>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                    {/* D. E. Shaw Logo */}
                    <LogoTip tip="Interaction Design Intern">
                      <img
                        src="./deshaw_logo.svg"
                        alt="D. E. Shaw & Co."
                        className="h-[22px] sm:h-[26.5px] md:h-[31px] w-auto object-contain"
                      />
                    </LogoTip>

                    {/* GE3S Sustainability Logo */}
                    <LogoTip tip="UI/UX Intern">
                      <img
                        src="./ge3s_logo.png"
                        alt="GE3S"
                        className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                      />
                    </LogoTip>

                    {/* Akai Space Logo */}
                    <LogoTip tip="Product Design Intern">
                      <img
                        src="./logo2.png"
                        alt="AKAISPACE"
                        className="h-5 sm:h-5.5 md:h-6 w-auto object-contain"
                      />
                    </LogoTip>
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
                        className={`w-[34px] h-[34px] flex items-center justify-center transition-all duration-300 group ${
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
                  {/* The wrapper bobs and is the positioning box for the sweatdrop (% of image). */}
                  <div className="relative z-10 flex items-center justify-center translate-x-1 sm:translate-x-2">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                      className="relative"
                    >
                      <motion.div
                        className="relative"
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                      >
                        <img
                          src="./avatar_bust.png"
                          alt="Puru Vats 3D Avatar"
                          className="block -scale-x-100 w-[168px] xl:w-[182px] h-auto object-contain select-none pointer-events-none drop-shadow-md"
                        />
                        {/* Drops per card: heroCards.ts. Placement: Sweatdrop.tsx. Bubble placement: HeadBubble.tsx */}
                        <Sweatdrop count={Math.max(SWEAT_DROPS_PER_CARD[cardIndex] ?? 0, tapDrops)} />
                        <HeadBubble text={CAPTION_ON_LOOP} showKey={bubbleKey} />
                        <AvatarBubbles onTap={handleAvatarTap} />
                      </motion.div>
                    </motion.div>
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
