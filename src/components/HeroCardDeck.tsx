import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { EASE_OUT } from "../lib/motion";
import { X } from 'lucide-react';
import { HERO_CARDS, HERO_WORD_CYCLE } from '../data/heroCards';

const WOBBLE_AFTER_MS = 6000;
/** Every card's text is fitted to exactly this many lines. */
const TEXT_LINES = 3;

// Uniform padding on every side. From tablet up the card hugs its text (width is set by FitText);
// on phones it stays full width.
const CARD_CLASS =
  'clay-dialogue-card border border-[#EBEBE8] rounded-[36px] p-9 relative overflow-hidden flex items-start gap-4 w-fit max-w-[620px] justify-self-start self-start';
// Hover hint (mouse only): while the pointer is over the live card, its × gets a soft round backing and
// turns a quarter turn, and the card leans a few px toward the side it will flick off to.
const CARD_HOVER = 'group/card transition-[translate] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:translate-x-[4px]';
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

/**
 * The highlighted word, backspaced and retyped through HERO_WORD_CYCLE (see data/heroCards.ts).
 * A thin light-grey caret shows only while letters are being removed or typed; each new letter fades in.
 * The word writes itself out when the card first appears.
 *
 * The word (and the punctuation after it) sits in a slot as wide as the longest option, so the rest of
 * the sentence and its line breaks never move while it retypes (the card text is text-wrap: balance,
 * which would otherwise re-wrap the lines on every letter).
 */
function TypeCycle({ trailing }: { trailing: string }) {
  const { word, hold, firstHold, loops, rounds, typeMs, deleteMs, pauseMs, startMs } = HERO_WORD_CYCLE;
  // starts empty: the main word is typed out when the card first appears (the slot below already has its width)
  const [shown, setShown] = useState('');
  const [busy, setBusy] = useState(false); // typing or deleting right now

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const wait = (ms: number) => new Promise<void>((r) => (timer = setTimeout(r, ms)));

    const run = async () => {
      let current = '';
      /** moves from the current text to `target`: types on the end if it only adds letters, else erases first */
      const goTo = async (target: string) => {
        setBusy(true);
        let typed = current.length;
        if (!(target.startsWith(current) && target.length > current.length)) {
          for (let n = current.length - 1; n >= 0; n--) {
            await wait(deleteMs);
            if (cancelled) return false;
            setShown(current.slice(0, n));
          }
          await wait(pauseMs); // a beat with the word gone
          typed = 0;
        }
        for (let n = typed + 1; n <= target.length; n++) {
          await wait(typeMs);
          if (cancelled) return false;
          setShown(target.slice(0, n));
        }
        setBusy(false);
        current = target;
        return true;
      };

      // first, write the main word out as the card appears
      await wait(startMs);
      if (cancelled) return;
      if (!(await goTo(word))) return;

      // the first read of the card is undisturbed; then the loop plays `loops` times and settles on the main word
      await wait(firstHold);
      if (cancelled) return;
      let round = 0;
      for (let loop = 0; loop < loops; loop++) {
        for (const step of rounds[round++ % rounds.length]) {
          if (!(await goTo(step.text))) return;
          await wait(step.hold);
          if (cancelled) return;
        }
        if (!(await goTo(word))) return;
        if (loop < loops - 1) {
          await wait(hold);
          if (cancelled) return;
        }
      }
      // done: the main word stays, still
    };
    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [word, hold, firstHold, loops, rounds, typeMs, deleteMs, pauseMs, startMs]);

  // every text the word can show: the slot is sized to the widest, so nothing around it ever moves
  const options = [...new Set([word, ...rounds.flat().map((s) => s.text)])];
  return (
    // inline-grid: every option sits invisibly in the same cell, so the slot is as wide as the longest one
    <span className="inline-grid justify-items-start align-baseline whitespace-nowrap">
      {options.map((o) => (
        <span key={o} aria-hidden className="invisible [grid-area:1/1]">
          <span className="text-[#2B7FFF] font-bold">{o}</span>
          {trailing}
        </span>
      ))}
      <span className="[grid-area:1/1]">
        <span className="text-[#2B7FFF] font-bold">
          {shown.split('').map((ch, i) => (
            <span key={i} className="type-in">
              {ch}
            </span>
          ))}
          {/* zero-width anchor, so the caret never pushes the punctuation along */}
          <span className="relative inline-block w-0 h-[0.95em] -mb-[0.12em]">
            <span
              className={`absolute left-[2px] top-0 w-[2px] h-full rounded-full bg-[#C4C4C0] transition-opacity duration-300 ${
                busy ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </span>
        </span>
        {trailing}
      </span>
    </span>
  );
}

/**
 * "plain **highlight** plain" → text with blue highlighted spans.
 * `animate`: the HERO_WORD_CYCLE word gets the backspace/retype effect (only on the visible card; the hidden
 * copies used to measure the card keep the full word so the card never changes size).
 */
function renderCopy(copy: string, animate = false) {
  const parts = copy.split(/\*\*(.+?)\*\*/g);
  // punctuation straight after the animated word moves into its fixed-width slot, so it stays attached
  const animatedAt = animate ? parts.findIndex((p, i) => i % 2 === 1 && p === HERO_WORD_CYCLE.word) : -1;
  const trailing = animatedAt >= 0 ? (parts[animatedAt + 1] ?? '').match(/^[.,!?;:…]*/)![0] : '';

  return parts.map((part, i) => {
    if (i === animatedAt)
      return (
        <span key={i}>
          <span className="sr-only">
            {part}
            {trailing}
          </span>
          <span aria-hidden>
            <TypeCycle trailing={trailing} />
          </span>
        </span>
      );
    if (i % 2 === 1)
      return (
        <span key={i} className="text-[#2B7FFF] font-bold inline">
          {part}
        </span>
      );
    return <Fragment key={i}>{i === animatedAt + 1 && animatedAt >= 0 ? part.slice(trailing.length) : part}</Fragment>;
  });
}

interface DeckCardProps {
  copy: string;
  cardClass: string;
  copyIndex: number;
  base: BaseSize | null;
  closeLabel: string;
  focusOnMount: boolean;
  wobble: boolean;
  reduceMotion: boolean;
  onClose: () => void;
}

function DeckCard({ copy, copyIndex, base, cardClass, closeLabel, focusOnMount, wobble, reduceMotion, onClose }: DeckCardProps) {
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
          transition: { duration: 0.5, ease: EASE_OUT },
        },
        // dismiss: tilt + flick right while fading
        exit: {
          opacity: 0,
          x: 90,
          rotate: 5,
          // ease-out: the flick responds the instant you click, then settles
          transition: { duration: 0.36, ease: EASE_OUT },
        },
      };

  return (
    <motion.div
      {...motionProps}
      // leaving card sits above the arriving one; it's inert and hidden from AT
      style={{ gridArea: '1 / 1', zIndex: isPresent ? 1 : 2 }}
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
      className={`${cardClass} ${isPresent ? CARD_HOVER : ''}`}
    >
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClose}
        animate={wobble && !reduceMotion ? { rotate: [0, 10, -10, 7, -7, 0] } : { rotate: 0 }}
        transition={{ duration: wobble ? 0.4 : 0 }}
        // before: grows the hit area to ≥44×44px without changing the visual circle
        className={`${CLOSE_BOX} rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer group z-10 before:absolute before:-inset-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]`}
        aria-label={closeLabel}
        title={closeLabel}
      >
        <X
          className="w-[1.3rem] h-[1.3rem] text-[#555555] group-hover:text-[#222222] [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:rotate-90 [@media(hover:hover)_and_(pointer:fine)]:group-hover/card:text-[#3A3A38] transition-[color,rotate] duration-300 ease-out"
          strokeWidth={2.4}
        />
      </motion.button>

      <FitText copyIndex={copyIndex} base={base}>{renderCopy(copy, !reduceMotion)}</FitText>
      <span aria-hidden className={CLOSE_SPACER} />
    </motion.div>
  );
}

interface HeroCardDeckProps {
  index: number;
  onIndexChange: (next: number) => void;
  /** Fired when dismissing the last card loops back to the first. */
  onLoop?: () => void;
  /** Centre the cards in the column (stacked phone/tablet layout). */
  centered?: boolean;
}

/**
 * Stack of dismissible title cards. State (`index`) lives in the parent so the
 * avatar's sweatdrop can react to the last card.
 */
export function HeroCardDeck({ index, onIndexChange, onLoop, centered = false }: HeroCardDeckProps) {
  const cardClass = centered ? CARD_CLASS.replace('justify-self-start', 'justify-self-center') : CARD_CLASS;
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
          className={`${cardClass} invisible pointer-events-none`}
          style={{ gridArea: '1 / 1' }}
        >
          <FitText copyIndex={i} measure={i === 0} base={base} onBase={i === 0 ? setBase : undefined}>{renderCopy(copy)}</FitText>
          <span className={CLOSE_SPACER} />
        </div>
      ))}

      {/* Stack hint: a card edge peeking out behind the active one */}
      <motion.div
        aria-hidden="true"
        className={`${cardClass} pointer-events-none`}
        style={{ gridArea: '1 / 1', zIndex: 0 }}
        initial={false}
        animate={{
          opacity: hasMoreCards ? 0.9 : 0,
          scale: 0.95, // shrinks ~5px per edge about centre…
          y: 12, // …so this leaves ~7px of edge showing below the active card
        }}
        transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: EASE_OUT }}
      >
        {/* invisible copy of the active card so the edge has the same width */}
        <FitText key={index} copyIndex={index} base={base} className="invisible">{renderCopy(HERO_CARDS[index])}</FitText>
        <span className={CLOSE_SPACER} />
      </motion.div>

      <AnimatePresence initial={false}>
        <DeckCard
          key={index}
          copy={HERO_CARDS[index]}
          cardClass={cardClass}
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
