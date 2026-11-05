import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { HERO_CARDS } from '../data/heroCards';

const WOBBLE_AFTER_MS = 6000;

// Same classes the original static card used — visuals are unchanged.
const CARD_CLASS =
  'clay-dialogue-card border border-[#EBEBE8] rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 md:p-10 lg:p-11 relative overflow-hidden w-full max-w-[620px]';
const TEXT_CLASS =
  'font-sans text-[19px] sm:text-[21px] md:text-[24px] xl:text-[26px] font-medium leading-[1.38] tracking-[-0.015em] text-[#60605D] max-w-[95%] pr-6 sm:pr-8 pt-1 sm:pt-2';

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
  closeLabel: string;
  focusOnMount: boolean;
  wobble: boolean;
  reduceMotion: boolean;
  onClose: () => void;
}

function DeckCard({ copy, closeLabel, focusOnMount, wobble, reduceMotion, onClose }: DeckCardProps) {
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
        className="absolute top-4 right-4 sm:top-5 sm:right-5 w-[2.275rem] h-[2.275rem] sm:w-[2.6rem] sm:h-[2.6rem] rounded-full flex items-center justify-center transition-colors cursor-pointer group z-10 before:absolute before:-inset-[11px] outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F9]"
        aria-label={closeLabel}
        title={closeLabel}
      >
        <X
          className="w-[1.1375rem] h-[1.1375rem] sm:w-[1.3rem] sm:h-[1.3rem] text-[#555555] group-hover:text-[#222222] transition-colors"
          strokeWidth={2.4}
        />
      </motion.button>

      <p className={TEXT_CLASS}>{renderCopy(copy)}</p>
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
          <p className={TEXT_CLASS}>{renderCopy(copy)}</p>
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
      />

      <AnimatePresence initial={false}>
        <DeckCard
          key={index}
          copy={HERO_CARDS[index]}
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
