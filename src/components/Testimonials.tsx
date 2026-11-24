import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { pop } from './ui/Pop';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { ApprovedTestimonial, fetchApprovedTestimonials } from '../lib/testimonials';
import { TESTIMONIAL_FORM_URL, TESTIMONIAL_HIGHLIGHTS } from '../config';
import { EASE_OUT } from '../lib/motion';

/** The highlight phrase for a person, looked up by first name (see TESTIMONIAL_HIGHLIGHTS in config.ts). */
const highlightFor = (name: string) => {
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  return Object.entries(TESTIMONIAL_HIGHLIGHTS).find(([n]) => n.toLowerCase() === first)?.[1];
};
import { companyDomains, faviconUrl, logoScale, MIN_LOGO_PX } from '../lib/companyLogo';

/** Cards rise in as they scroll into view, both columns together (same as the Work grid). */
const rise = () => pop();

/** Clay colours from the nav's palette: each testimonial's initial circle takes one, in turn. */
export const CLAY = [
  { skin: 'from-[#FFF9CE] to-[#FEEA80] border-[#F7DF59]/75 btn-clay-yellow', ink: 'text-[#9D6E2F]', text: 'from-[#8B5E2B] to-[#713F12]' },
  { skin: 'from-[#E6F1FE] to-[#72BDFF] border-[#B7D9FF]/75 btn-clay-blue', ink: 'text-[#3F74E3]', text: 'from-[#1D4ED8] to-[#1E3A8A]' },
  { skin: 'from-[#FFE9DC] to-[#FED2BE] border-[#FDBA74]/75 btn-clay-peach', ink: 'text-[#D8693B]', text: 'from-[#C2410C] to-[#9A3412]' },
  { skin: 'from-[#D7F8E8] to-[#B2F2D1] border-[#6EE7B7]/75 btn-clay-mint', ink: 'text-[#1C9A72]', text: 'from-[#047857] to-[#064E3B]' },
  { skin: 'from-[#FFE3EA] to-[#FFC3D1] border-[#FDA4AF]/75 btn-clay-pink', ink: 'text-[#D4375F]', text: 'from-[#BE123C] to-[#881337]' },
  { skin: 'from-[#EDFA7E] to-[#D5F24B] border-[#BEF264]/75 btn-clay-lime', ink: 'text-[#6E9A1F]', text: 'from-[#3F6212] to-[#294109]' },
];

/**
 * The company's logo, looked up from the name (see lib/companyLogo.ts). A found logo stands on its own,
 * flat, with no container or fill. While it loads, or when no logo can be found, a building icon in a
 * clay tile (the card's colour) is shown instead.
 */
export function CompanyBadge({ company, clay, size = 40 }: { company: string; clay: (typeof CLAY)[number]; size?: number }) {
  const domains = companyDomains(company);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const domain = domains[attempt];

  return (
    <span
      role="img"
      aria-label={`Company: ${company}`}
      title={company}
      style={{ width: size, height: size, borderRadius: loaded ? undefined : Math.round(size / 3) }}
      className={`relative flex items-center justify-center shrink-0 ${
        loaded ? '' : `border bg-gradient-to-b overflow-hidden ${clay.skin}`
      }`}
    >
      {!loaded && <Building2 size={Math.round(size * 0.45)} strokeWidth={2} aria-hidden="true" className={clay.ink} />}
      {domain && (
        <img
          key={domain}
          src={faviconUrl(domain)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          referrerPolicy="no-referrer"
          draggable={false}
          style={{ scale: logoScale(domain) }}
          onLoad={(e) => {
            // the service answers "not found" with a 16px placeholder picture; only a real logo is wider
            if (e.currentTarget.naturalWidth > MIN_LOGO_PX) setLoaded(true);
            else setAttempt((n) => n + 1); // try the next guess, or fall back to the building icon
          }}
          onError={() => setAttempt((n) => n + 1)}
          className={`absolute inset-0 w-full h-full object-contain select-none mix-blend-multiply transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
}


/* ========================================================
   Testimonial "folder": two cards tucked into a clay pocket.
   Front card: the strongest phrase, big. Back card: the full testimonial.
   Hover nudges the back card out a little; a tap swaps the cards.
   ======================================================== */

// The pocket hugs its contents (20px padding all round), so its height is measured. The cards' lower
// OVERLAP px always sit behind it, wherever its top edge ends up.
const OVERLAP = 64;
const POCKET_H_GUESS = 110; // used until the pocket has been measured
const CARD_PAD_BOTTOM = OVERLAP + 22; // keeps card text clear of the pocket
// closed cards share one height so a row of folders lines up; stacked on phones they can be shorter
const MIN_CARD_H = 300;
const MIN_CARD_H_STACKED = 250;
const AUTO_CLOSE_MS = 10_000; // an open folder closes after this long without the mouse over it // closed cards share one height, so the row lines up

type Pose = { x: number; y: number; rotate: number };
/**
 * Each folder gets its own set of angles (in turn), so a row of them looks hand-placed rather than stamped.
 * front: the phrase card; read: the full quote once opened (kept nearly straight); back: the card behind;
 * On hover both cards move: the back card fans out (peek) while the front card lifts and turns the other way (lift).
 */
type Poses = { front: Pose; lift: Pose; read: Pose; back: Pose; peek: Pose };
const POSE_SETS: Poses[] = [
  {
    front: { x: 0, y: 0, rotate: -3 },
    lift: { x: -6, y: -6, rotate: -4.5 },
    read: { x: 0, y: 0, rotate: -1 },
    back: { x: 14, y: -12, rotate: 3 },
    peek: { x: 26, y: -26, rotate: 5.5 },
  },
  {
    front: { x: 2, y: 2, rotate: 1.5 },
    lift: { x: 8, y: -5, rotate: 3 },
    read: { x: 0, y: 0, rotate: 0.6 },
    back: { x: -12, y: -14, rotate: -4 },
    peek: { x: -24, y: -28, rotate: -6.5 },
  },
  {
    front: { x: -2, y: 0, rotate: -1 },
    lift: { x: -8, y: -6, rotate: -2.5 },
    read: { x: 0, y: 0, rotate: -0.5 },
    back: { x: 10, y: -16, rotate: 5 },
    peek: { x: 20, y: -30, rotate: 7.5 },
  },
];

const norm = (s: string) => s.replace(/[’‘]/g, "'").toLowerCase();

/** "a [[b]] c" -> nodes with the bracketed part coloured */
function renderMarked(s: string) {
  return s.split(/\[\[(.+?)\]\]/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-semibold text-[#3F7FE8]">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** The full quote, with the highlighted words (if they appear in it) marked the same blue. */
function renderQuote(quote: string, phrase: string | undefined) {
  const marked = phrase?.match(/\[\[(.+?)\]\]/)?.[1]?.replace(/[.!?,\s]+$/, '');
  const at = marked ? norm(quote).indexOf(norm(marked)) : -1;
  if (!marked || at < 0) return quote;
  return (
    <>
      {quote.slice(0, at)}
      <span className="font-medium text-[#3F7FE8]">{quote.slice(at, at + marked.length)}</span>
      {quote.slice(at + marked.length)}
    </>
  );
}

/**
 * Full company wordmarks shown under a testimonial, matched on the start of the company name
 * (so "Akai Space (YC'27)" still matches). Anyone else gets the favicon lookup from lib/companyLogo.ts.
 */
// label: an app icon that needs its name beside it. height: px, tuned by eye so every mark carries the same visual weight
// (a wide, heavy all-caps wordmark needs less height than a light one with descenders).
type CompanyMark = { match: RegExp; src: string; label?: string; height: number };
const WORDMARKS: CompanyMark[] = [
  { match: /^google\b/i, src: './logos/google.svg', height: 19 },
  { match: /^akai\s*space\b/i, src: './logo2.png', height: 12 },
  { match: /^undisclosed\b/i, src: './logos/undisclosed.jpg', label: 'Undisclosed', height: 16 },
];
const wordmarkFor = (company: string) => WORDMARKS.find((m) => m.match.test(company.trim()));

function CompanyLogo({ company, clay }: { company: string; clay: (typeof CLAY)[number] }) {
  const mark = wordmarkFor(company);
  if (!mark) return <CompanyBadge company={company} clay={clay} size={22} />;
  if (mark.label)
    return (
      <span title={company} className="inline-flex items-center gap-1.5">
        <img src={mark.src} alt="" aria-hidden draggable={false} style={{ width: mark.height, height: mark.height }} className="rounded-[4px] object-cover select-none" />
        <span className="font-sans t-meta font-bold !leading-none text-ink">{mark.label}</span>
      </span>
    );
  // anything in brackets after the name, e.g. "Akai Space (YC'27)" -> YC'27, sits beside the wordmark
  const note = company.match(/\(([^)]+)\)/)?.[1]?.trim();
  return (
    <span title={company} className="inline-flex items-center gap-2">
      <img src={mark.src} alt={company} draggable={false} style={{ height: mark.height }} className="w-auto object-contain select-none" />
      {note && (
        <span className="font-sans t-caption font-bold !leading-none text-ink-subtle">
          {note}
        </span>
      )}
    </span>
  );
}

function firstSentence(quote: string) {
  const s = quote.split(/(?<=[.!?])\s/)[0];
  return s.length > 110 ? `${s.slice(0, 107).trimEnd()}…` : s;
}

/** One of the two cards. Swapping sends the cards out to opposite sides and back, trading places half way. */
function FolderCard({
  front,
  pose,
  height,
  outward,
  innerRef,
  bottom,
  children,
}: {
  front: boolean;
  pose: Pose;
  height: number;
  bottom: number; // distance from the container's bottom to the card's bottom edge
  outward: number; // which way it slides out while swapping (-1 left, 1 right)
  innerRef: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  const wasFront = useRef(front);
  const swapping = wasFront.current !== front;
  useEffect(() => {
    wasFront.current = front;
  });

  const animate = swapping
    ? {
        x: [null, outward * 46, pose.x],
        y: [null, -18, pose.y],
        rotate: [null, pose.rotate + outward * 6, pose.rotate],
        zIndex: front ? [1, 1, 2] : [2, 2, 1],
        height,
      }
    : { ...pose, zIndex: front ? 2 : 1, height };

  return (
    <motion.div
      initial={false}
      animate={animate}
      transition={
        swapping
          ? { duration: 0.55, times: [0, 0.45, 1], ease: EASE_OUT, height: { type: 'spring', stiffness: 260, damping: 30 } }
          : { type: 'spring', stiffness: 320, damping: 26 }
      }
      style={{ bottom }}
      // Flat, like the site's other surfaces (no drop shadow): front card is the #F9F9F9 card surface with a
      // 6px soft-grey stroke; back card is a lighter sheet with a hairline edge, so the front stroke reads against it
      className={`absolute left-[3%] right-[8%] rounded-[28px] overflow-hidden ${
        front ? 'bg-[#F9F9F9] border-[6px] border-[#E4E4E4]/80' : 'bg-[#F6F6F4] border border-[#ECECEA]'
      } transition-colors duration-300`}
    >
      <motion.div
        ref={innerRef}
        animate={{ opacity: front ? 1 : 0 }}
        transition={{ duration: 0.25, delay: front ? 0.18 : 0 }}
        className="px-7 sm:px-8 pt-7 sm:pt-8"
        style={{ paddingBottom: CARD_PAD_BOTTOM }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function TestimonialFolder({
  t,
  clay,
  phrase,
  poses,
}: {
  t: ApprovedTestimonial;
  clay: (typeof CLAY)[number];
  phrase?: string;
  poses: Poses;
}) {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);
  const figureRef = useRef<HTMLElement>(null);

  // An open folder closes by itself after 10s without the mouse over it (on touch screens: 10s after opening)…
  useEffect(() => {
    if (!open || pointerInside) return;
    const timer = setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [open, pointerInside]);

  // …or as soon as it is scrolled out of view
  useEffect(() => {
    const el = figureRef.current;
    if (!open || !el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setOpen(false);
        setPeek(false);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [open]);
  const phraseRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState({ phrase: 0, full: 0, min: MIN_CARD_H });

  // natural heights of both cards' contents (they change with the column width)
  useEffect(() => {
    const measure = () =>
      setHeights({
        phrase: phraseRef.current?.offsetHeight ?? 0,
        full: fullRef.current?.offsetHeight ?? 0,
        min: window.innerWidth < 768 ? MIN_CARD_H_STACKED : MIN_CARD_H,
      });
    measure();
    const ro = new ResizeObserver(measure);
    if (phraseRef.current) ro.observe(phraseRef.current);
    if (fullRef.current) ro.observe(fullRef.current);
    return () => ro.disconnect();
  }, []);

  // the pocket's own height (it hugs its contents)
  const pocketRef = useRef<HTMLElement>(null);
  const [pocketH, setPocketH] = useState(POCKET_H_GUESS);
  useEffect(() => {
    const el = pocketRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPocketH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const cardBottom = pocketH - OVERLAP;

  const cardH = Math.max(open ? heights.full : heights.phrase, heights.min);
  const toggle = () => setOpen((o) => !o);
  const backPose = peek ? poses.peek : poses.back;
  const frontPose = peek ? poses.lift : poses.front;
  const readPose = peek ? { ...poses.read, y: poses.read.y - 5 } : poses.read; // the open quote lifts a touch too

  return (
    <motion.figure
      {...rise()}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`Testimonial from ${t.name}. ${open ? 'Showing the full testimonial.' : 'Press to read it in full.'}`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      ref={figureRef}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        setPeek(true);
        setPointerInside(true);
      }}
      onPointerLeave={() => {
        setPeek(false);
        setPointerInside(false);
      }}
      className="relative w-full cursor-pointer select-none outline-none rounded-[28px] focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-4"
    >
      <motion.div
        initial={false}
        animate={{ height: cardH + cardBottom + 22 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="relative w-full"
      >
        {/* Full testimonial: behind until tapped */}
        <FolderCard front={open} pose={open ? readPose : backPose} height={cardH} outward={1} innerRef={fullRef} bottom={cardBottom}>
          <blockquote className="font-sans t-body text-ink-body whitespace-pre-line select-text">
            “{renderQuote(t.quote, phrase)}”
          </blockquote>
        </FolderCard>

        {/* Strongest phrase: in front by default */}
        <FolderCard front={!open} pose={open ? backPose : frontPose} height={cardH} outward={-1} innerRef={phraseRef} bottom={cardBottom}>
          <p className="font-display text-[24px] sm:text-[26px] leading-[1.3] font-medium tracking-[-0.2px] text-ink-subtle">
            {phrase ? renderMarked(phrase) : firstSentence(t.quote)}
          </p>
        </FolderCard>

        {/* The pocket: who said it. Hugs its contents with the same 20px padding on every side, centred vertically */}
        <figcaption
          ref={pocketRef}
          className="clay-dialogue-card absolute inset-x-0 bottom-0 z-10 border border-[#EBEBE8] rounded-[28px] p-5 flex items-center gap-4"
        >
          <span
            aria-hidden="true"
            className={`w-12 h-12 rounded-full border bg-gradient-to-b flex items-center justify-center shrink-0 ${clay.skin}`}
          >
            <span className={`font-display font-bold text-[20px] bg-gradient-to-b ${clay.text} bg-clip-text text-transparent`}>
              {t.name.trim()[0]?.toUpperCase()}
            </span>
          </span>
          {/* name, role and logo rows each have a fixed height with one even gap, so every pocket is the same height */}
          <div className="flex flex-col items-start gap-1.5 min-w-0">
            <span className="font-display t-ui font-semibold !leading-[20px] text-ink truncate max-w-full">{t.name}</span>
            {t.role && (
              <span title={t.role} className="font-sans t-meta !font-normal !leading-[16px] text-ink-subtle truncate max-w-full">
                {t.role}
              </span>
            )}
            {t.company && (
              <span className="h-5 flex items-center">
                <CompanyLogo company={t.company} clay={clay} />
              </span>
            )}
          </div>
        </figcaption>
      </motion.div>
    </motion.figure>
  );
}

export function Testimonials() {
  // Only testimonials Puru has approved (published from the Google Sheet) are shown.
  const [approved, setApproved] = useState<ApprovedTestimonial[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchApprovedTestimonials(controller.signal).then(setApproved);
    return () => controller.abort();
  }, []);

  return (
    <section id="testimonials" className="py-20 sm:py-24 lg:py-32 overflow-visible scroll-mt-24">
      <div className="w-full">
        
        {/* Title area with 'Leave a testimonial' button */}
        <div className="mb-10 sm:mb-12 lg:mb-14 flex flex-row items-center justify-between gap-3 sm:gap-4">
          <ScrollRevealTitle>
            <h2 className="font-display t-display heading-gradient">
              About me from others
            </h2>
          </ScrollRevealTitle>

          {/* Tertiary action: plain text link (same family as the nav's Behance link), opens the Google Form */}
          <a
            href={TESTIMONIAL_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 whitespace-nowrap inline-flex items-center gap-1 h-[40px] rounded-[10px] font-sans t-ui text-ink-muted hover:text-ink-strong active:scale-[0.97] transition-[color,scale] duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <span className="relative">
              Leave a testimonial
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.2}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        {/* One folder per testimonial: three across on wide screens, two on tablets, stacked on phones */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 lg:gap-x-16 2xl:gap-x-20 gap-y-16 sm:gap-y-20 items-start">
          {approved.map((t, i) => (
            <TestimonialFolder key={t.id} t={t} clay={CLAY[i % CLAY.length]} phrase={highlightFor(t.name)} poses={POSE_SETS[i % POSE_SETS.length]} />
          ))}
        </div>

      </div>
    </section>
  );
}
