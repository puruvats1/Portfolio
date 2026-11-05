import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { HERO_CARDS } from '../data/heroCards';

const WOBBLE_AFTER_MS = 6000;
/** Every card's text is fitted to exactly this many lines. */
const TEXT_LINES = 3;

// Uniform padding on every side. From tablet up the card hugs its text (width is set by FitText);
// on phones it stays full width.
const CARD_CLASS =
  'clay-dialogue-card border border-[#EBEBE8] rounded-[36px] p-9 relative overflow-hidden flex items-start gap-4 w-fit max-w-[620px] justify-self-start self-start';
const TEXT_CLASS =
  'font-sans text-[29px] lg:text-[26px] font-medium leading-[1.38] tracking-[-0.015em] text-[#60605D] [text-wrap:balance] flex-none';
// keeps the layout box of the × button (used by the hidden sizers)
// × button: pinned near the card's top-right corner (tighter than the text padding)
const CLOSE_BOX = 'absolute top-5 right-5 w-[2.6rem] h-[2.6rem]';
// invisible spacer in the row: keeps the text clear of the × and lets the card hug the text
const CLOSE_SPACER = 'shrink-0 w-[22px] h-0';

/** Size of the default (first) card's text box. Every other card is fitted into the same box. */
interface BaseSize {
  w: number; // text column width (px, before any zoom)
  h: number; // text block height
  fs: number; // font size
}

/** How much larger than the default a shorter card's text may get while still fitting the box. */
const MAX_GROW = 1.15;

/**
 * Card text. The FIRST card sets the default size: its text hugs its copy and wraps to exactly
 * TEXT_LINES lines. All other cards use that exact box (same width and height), so the container
 * never changes between cards; their font size is adjusted to fit inside it instead.
 */
function FitText({
  children,
  className = '',
  copyIndex,
  measure = false,
  base,
  onBase,
}: {
  children: React.ReactNode;
  className?: string;
  copyIndex: number;
  /** true for the single instance that measures the default size */
  measure?: boolean;
  base: BaseSize | null;
  onBase?: (b: BaseSize) => void;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const p = ref.current;
    const card = p?.parentElement;
    const deck = card?.parentElement;
    if (!p || !card || !deck) return;

    const lineCount = () => Math.round(p.offsetHeight / parseFloat(getComputedStyle(p).lineHeight));
    const widthFor = (w: number) => {
      p.style.width = w + 'px';
      return lineCount();
    };
    const reset = () => {
      p.style.fontSize = '';
      p.style.width = '';
      p.style.height = '';
      p.style.paddingTop = '';
    };

    // default card: hug the text, exactly TEXT_LINES lines
    const measureDefault = () => {
      reset();
      // space the text may use = deck width minus the card's padding, border, gap and × spacer
      p.style.width = '100px';
      const avail = Math.max(140, deck.clientWidth - (card.offsetWidth - 100));

      // too long for TEXT_LINES: shrink the font a little
      let size = parseFloat(getComputedStyle(p).fontSize);
      while (widthFor(avail) > TEXT_LINES && size > 13) {
        size -= 0.5;
        p.style.fontSize = size + 'px';
      }
      // narrowest column that still fits → the card hugs the text
      let lo = 100;
      let hi = avail;
      while (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        if (widthFor(mid) <= TEXT_LINES) hi = mid;
        else lo = mid;
      }
      p.style.width = hi + 'px';
      return { w: hi, h: p.offsetHeight, fs: parseFloat(getComputedStyle(p).fontSize) };
    };

    // other cards: same box as the default, font adjusted to fit inside it
    const fitIntoBase = (b: BaseSize) => {
      reset();
      p.style.width = b.w + 'px';
      if (copyIndex === 0) {
        p.style.fontSize = b.fs + 'px'; // the default copy itself: exactly the default
      } else {
        for (let size = b.fs * MAX_GROW; size >= 13; size -= 0.5) {
          p.style.fontSize = size + 'px';
          if (p.offsetHeight <= b.h + 0.5 && lineCount() <= TEXT_LINES) break;
        }
      }
      // keep the box height identical: centre the (possibly shorter) text vertically
      p.style.height = 'auto';
      const natural = p.offsetHeight;
      p.style.paddingTop = Math.max(0, (b.h - natural) / 2) + 'px';
      p.style.height = b.h + 'px';
    };

    const fit = () => {
      if (measure) {
        const b = measureDefault();
        onBase?.(b);
      } else if (base) {
        fitIntoBase(base);
      } else {
        measureDefault(); // default size not known yet: temporary hug, refits once it arrives
      }
    };

    fit();
    let lastWidth = deck.clientWidth;
    const ro = new ResizeObserver(() => {
      if (deck.clientWidth !== lastWidth) {
        lastWidth = deck.clientWidth;
        fit();
      }
    });
    ro.observe(deck);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base?.w, base?.h, base?.fs]);

  return (
    <p ref={ref} className={`${TEXT_CLASS} ${className}`}>
      {children}
    </p>
  );
}

/** "plain **highlight** plain" → text with blue highlighted spans. */
function renderCopy(copy: string) {
  return copy.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-[#2B7FFF] font-bold inline">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

interface DeckCardProps {
  copy: string;
  copyIndex: number;
  base: BaseSize | null;
  closeLabel: string;
  focusOnMount: boolean;
  wobble: boolean;
  reduceMotion: boolean;
  onClose: () => void;
}

function DeckCard({ copy, copyIndex, base, closeLabel, focusOnMount, wobble, reduceMotion, onClose }: DeckCardProps) {
  const isPresent = useIsPresent();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusOnMount) buttonRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const motionProps = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        // reveal: rises from slightly behind
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.35, ease: 'easeOut' as const },
        },
        // dismiss: tilt + flick right while fading
        exit: {
          opacity: 0,
          x: 90,
          rotate: 5,
          transition: { duration: 0.3, ease: 'easeIn' as const },
        },
      };

  return (
    <motion.div
      {...motionProps}
      // leaving card sits above the arriving one; it's inert and hidden from AT
      style={{ gridArea: '1 / 1', zIndex: isPresent ? 1 : 2 }}
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
      className={CARD_CLASS}
    >
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClose}
        animate={wobble && !reduceMotion ? { rotate: [0, 10, -10, 7, -7, 0] } : { rotate: 0 }}
        transition={{ duration: wobble ? 0.4 : 0 }}
        // before: grows the hit area to ≥44×44px without changing the visual circle
        className={`${CLOSE_BOX} rounded-full flex items-center justify-center transition-colors cursor-pointer group z-10 before:absolute before:-inset-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]`}
        aria-label={closeLabel}
        title={closeLabel}
      >
        <X
          className="w-[1.3rem] h-[1.3rem] text-[#555555] group-hover:text-[#222222] transition-colors"
          strokeWidth={2.4}
        />
      </motion.button>

      <FitText copyIndex={copyIndex} base={base}>{renderCopy(copy)}</FitText>
      <span aria-hidden className={CLOSE_SPACER} />
    </motion.div>
  );
}

interface HeroCardDeckProps {
  index: number;
  onIndexChange: (next: number) => void;
  /** Fired when dismissing the last card loops back to the first. */
  onLoop?: () => void;
}

/**
 * Stack of dismissible title cards. State (`index`) lives in the parent so the
 * avatar's sweatdrop can react to the last card.
 */
export function HeroCardDeck({ index, onIndexChange, onLoop }: HeroCardDeckProps) {
  const reduceMotion = !!useReducedMotion();
  const [base, setBaseState] = useState<BaseSize | null>(null);
  const setBase = useCallback((b: BaseSize) => {
    setBaseState((prev) => (prev && prev.w === b.w && prev.h === b.h && prev.fs === b.fs ? prev : b));
  }, []);
  const lastIndex = HERO_CARDS.length - 1;

  const [hasInteracted, setHasInteracted] = useState(false);
  const [wobble, setWobble] = useState(false);
  const wobbledRef = useRef(false); // once per page load

  // Idle hint: one small wobble of × if card 1 is ignored for 6s.
  useEffect(() => {
    if (hasInteracted || wobbledRef.current) return;
    const t = setTimeout(() => {
      wobbledRef.current = true;
      setWobble(true);
    }, WOBBLE_AFTER_MS);
    return () => clearTimeout(t);
  }, [hasInteracted]);

  const advance = useCallback(() => {
    setHasInteracted(true);
    setWobble(false);
    if (index >= lastIndex) {
      onIndexChange(0);
      onLoop?.();
    } else {
      onIndexChange(index + 1);
    }
  }, [index, lastIndex, onIndexChange, onLoop]);

  const closeLabel = index === lastIndex ? 'Show original card' : 'Dismiss card';
  const hasMoreCards = index < lastIndex;

  return (
    // Persistent live region: announces the new card text politely.
    <div
      aria-live="polite"
      className="relative isolate grid w-full max-w-[620px]"
    >
      {/*
        Height sizer: every card is rendered invisibly in the same grid cell so
        the stack is always as tall as the tallest card (no layout jump below).
      */}
      {HERO_CARDS.map((copy, i) => (
        <div
          key={i}
          aria-hidden="true"
          inert
          className={`${CARD_CLASS} invisible pointer-events-none`}
          style={{ gridArea: '1 / 1' }}
        >
          <FitText copyIndex={i} measure={i === 0} base={base} onBase={i === 0 ? setBase : undefined}>{renderCopy(copy)}</FitText>
          <span className={CLOSE_SPACER} />
        </div>
      ))}

      {/* Stack hint: a card edge peeking out behind the active one */}
      <motion.div
        aria-hidden="true"
        className={`${CARD_CLASS} pointer-events-none`}
        style={{ gridArea: '1 / 1', zIndex: 0 }}
        initial={false}
        animate={{
          opacity: hasMoreCards ? 0.9 : 0,
          scale: 0.95, // shrinks ~5px per edge about centre…
          y: 12, // …so this leaves ~7px of edge showing below the active card
        }}
        transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
      >
        {/* invisible copy of the active card so the edge has the same width */}
        <FitText key={index} copyIndex={index} base={base} className="invisible">{renderCopy(HERO_CARDS[index])}</FitText>
        <span className={CLOSE_SPACER} />
      </motion.div>

      <AnimatePresence initial={false}>
        <DeckCard
          key={index}
          copy={HERO_CARDS[index]}
          copyIndex={index}
          base={base}
          closeLabel={closeLabel}
          focusOnMount={hasInteracted}
          wobble={wobble && index === 0}
          reduceMotion={reduceMotion}
          onClose={advance}
        />
      </AnimatePresence>

    </div>
  );
}
