import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { pop } from './ui/Pop';
import { EASE_OUT } from '../lib/motion';
import {
  BURST_ANIMATE,
  BURST_TIMES,
  BURST_WINDOW_MS,
  BurstParticles,
  type BurstPhase,
} from './ui/Burst';

/* ========================================================
   Content (from the resume). Edit the lists here.
   ======================================================== */

type Tone = 'lime' | 'grey';

const SKILL_GROUPS: { title: string; tone: Tone; skills: string[] }[] = [
  {
    title: 'Core design',
    tone: 'lime', // the same clay as the nav's "skills" button
    skills: [
      'UI/UX Design',
      'Interaction Design',
      'Design Systems',
      'Information Architecture',
      'Wireframing',
      'AI Assisted Rapid Prototyping',
      'Accessibility',
      'Micro interactions',
    ],
  },
  {
    title: 'Research & evaluation',
    tone: 'grey',
    skills: [
      'Quantitative Research',
      'Focus Groups',
      'User Journey',
      'Contextual Inquiry',
      'Personas',
      'Usability Testing',
      'Heuristics',
      'HTA',
      'SHERPA',
      'SUS',
      'NASA-TLX',
    ],
  },
  {
    title: 'Code & data',
    tone: 'grey',
    skills: ['HTML', 'CSS', 'Java', 'Tableau', 'Power BI'],
  },
];

type Tool = {
  name: string;
  /** file in public/tools */
  src: string;
  /** true: the logo is a full app icon and fills its tile; false: a mark that sits on a white tile */
  full: boolean;
};

/** Grouped like a Mac dock: a thin divider is drawn between groups. */
const TOOL_GROUPS: Tool[][] = [
  [
    { name: 'Figma', src: 'figma.png', full: true },
    { name: 'Adobe Creative Suite', src: 'adobe.png', full: true },
    { name: 'Framer', src: 'framer.jpg', full: true },
    { name: 'Spline', src: 'spline.png', full: false },
    { name: 'Google Stitch', src: 'stitch.jpg', full: true },
  ],
  [
    { name: 'Cursor', src: 'cursor.png', full: true },
    { name: 'Claude Code', src: 'claude.png', full: true },
    { name: 'Antigravity', src: 'antigravity.png', full: false },
  ],
];

/* ========================================================
   Skills: clay keys (the nav's buttons). Pressing the same key quickly
   a few times bursts it into confetti, like the nav buttons.
   ======================================================== */

const KEY_BURST_TAPS = 4; // presses on one key inside BURST_WINDOW_MS that make it burst

const KEY_CONFETTI: Record<Tone, string[]> = {
  lime: ['#A3CF1A', '#84CC16', '#D5F24B', '#65A30D'],
  grey: ['#BDBDB8', '#A3A39E', '#D9D9D5', '#8A8A85'],
};

function Keycap({ label, tone }: { label: string; tone: Tone }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<BurstPhase>('idle');
  const [burstAt, setBurstAt] = useState<{ id: number; x: number; y: number } | null>(null);
  const taps = useRef<number[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const press = () => {
    const el = ref.current;
    if (!el || phase !== 'idle') return;
    const box = el.getBoundingClientRect();
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < BURST_WINDOW_MS), now];

    if (taps.current.length >= KEY_BURST_TAPS) {
      taps.current = [];
      setBurstAt({ id: now, x: box.left + box.width / 2, y: box.top + box.height / 2 });
      setPhase('pop');
      timers.current.push(
        setTimeout(() => setPhase('gone'), BURST_TIMES[0]),
        setTimeout(() => setPhase('back'), BURST_TIMES[1]),
        setTimeout(() => {
          setPhase('idle');
          setBurstAt(null);
        }, BURST_TIMES[2]),
      );
    }
  };

  return (
    <>
      <motion.span
        ref={ref}
        role="listitem"
        data-skill={label}
        className={`keycap keycap-${tone} btn-clay-${tone}`}
        animate={phase === 'idle' ? { scale: 1, opacity: 1 } : BURST_ANIMATE[phase]}
        whileHover={phase === 'idle' ? { y: -2, scale: 1.04 } : undefined}
        whileTap={phase === 'idle' ? { scale: 0.94 } : undefined}
        transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.6 }}
        onClick={press}
      >
        {label}
      </motion.span>
      {burstAt && <BurstParticles key={burstAt.id} x={burstAt.x} y={burstAt.y} colors={KEY_CONFETTI[tone]} />}
    </>
  );
}

/**
 * Packs keys into rows of even length, so a group reads as a tidy block:
 * each row starts with the widest key left, then takes the widest keys that still fit beside it.
 * Long keys therefore end up alone (or nearly) on their own line, and short keys are gathered together.
 * The row width is the narrowest one that needs no more rows than the column allows,
 * which makes all the rows about the same length.
 */
function packRows(items: { label: string; width: number }[], gap: number, limit: number): string[][] {
  const pack = (max: number) => {
    const left = [...items].sort((a, b) => b.width - a.width);
    const rows: { labels: string[]; width: number }[] = [];
    while (left.length) {
      const first = left.shift()!;
      const row = { labels: [first.label], width: first.width };
      for (let i = 0; i < left.length; ) {
        if (row.width + gap + left[i].width <= max) {
          row.width += gap + left[i].width;
          row.labels.push(left[i].label);
          left.splice(i, 1);
        } else i++;
      }
      rows.push(row);
    }
    return rows;
  };

  const widest = Math.max(...items.map((i) => i.width));
  const fewest = pack(limit).length;
  let lo = widest;
  let hi = limit;
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2;
    if (pack(mid).length <= fewest) hi = mid;
    else lo = mid;
  }
  // a short key alone on the last line looks stray: allow one more row if that settles it
  let rows = pack(hi);
  const last = rows[rows.length - 1];
  if (rows.length > 1 && last.labels.length === 1 && last.width < hi * 0.6) {
    const alt = (() => {
      let a = widest;
      let b = hi;
      while (b - a > 1) {
        const mid = (a + b) / 2;
        if (pack(mid).length <= fewest + 1) b = mid;
        else a = mid;
      }
      return pack(b);
    })();
    const altLast = alt[alt.length - 1];
    if (altLast.labels.length > 1 || altLast.width >= hi * 0.6) rows = alt;
  }
  return rows.map((r) => r.labels);
}

function SkillGroup({ title, tone, skills, delay }: { title: string; tone: Tone; skills: string[]; delay: number }) {
  const listRef = useRef<HTMLDivElement>(null);
  // null until measured: the keys first render as a plain wrapping list, then get packed into rows
  const [rows, setRows] = useState<string[][] | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const column = list?.parentElement;
    if (!list || !column) return;
    const measure = () => {
      const keys = Array.from(list.querySelectorAll<HTMLElement>('[data-skill]'));
      if (!keys.length) return;
      // +1: offsetWidth rounds, so this keeps the packing on the safe side
      const items = keys.map((k) => ({ label: k.dataset.skill!, width: k.offsetWidth + 1 }));
      const gap = parseFloat(getComputedStyle(list).columnGap) || 12;
      const next = packRows(items, gap, column.clientWidth);
      setRows((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? cur : next));
    };
    measure();
    document.fonts?.ready.then(measure);
    let lastWidth = column.clientWidth;
    const observer = new ResizeObserver(() => {
      if (column.clientWidth === lastWidth) return;
      lastWidth = column.clientWidth;
      measure();
    });
    observer.observe(column);
    return () => observer.disconnect();
  }, []);

  const gaps = 'gap-x-2.5 gap-y-3 sm:gap-x-3 sm:gap-y-3.5';
  return (
    <motion.div {...pop(delay)} className="min-w-0">
      <h3 className="mb-4 sm:mb-5 font-sans t-meta font-semibold text-ink-muted">
        {title}
      </h3>
      <div ref={listRef} role="list" aria-label={title} className={`flex flex-wrap ${gaps}`}>
        {rows
          ? rows.map((row) => (
              <div key={row.join('|')} className={`flex basis-full ${gaps}`}>
                {row.map((skill) => (
                  <Keycap key={skill} label={skill} tone={tone} />
                ))}
              </div>
            ))
          : skills.map((skill) => <Keycap key={skill} label={skill} tone={tone} />)}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="pt-20 sm:pt-24 lg:pt-32 pb-14 sm:pb-16 lg:pb-20 overflow-visible scroll-mt-24">
      <div className="mb-10 sm:mb-12 lg:mb-14">
        <ScrollRevealTitle>
          <h2 className="font-display t-display heading-gradient">
            Skills
          </h2>
        </ScrollRevealTitle>
      </div>

      {/* Three groups side by side once there is room for it (column widths follow how much each group holds);
          two columns on smaller laptops (Code & data moves under Core design); stacked on phones and tablets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-[1400px]:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(232px,0.55fr)] gap-x-12 2xl:gap-x-16 gap-y-10 items-start">
        {SKILL_GROUPS.map((group, g) => (
          <SkillGroup key={group.title} {...group} delay={g * 0.06} />
        ))}
      </div>
    </section>
  );
}

/* ========================================================
   Tools: a Mac-style dock, left aligned, with the same padding on all four sides.
   Icons swell under the cursor by scaling (rising out of the top of the tray),
   so the tray itself never changes size. Phones and tablets get a grid of icons with names.
   ======================================================== */

const DOCK_PEAK = 1.26; // scale right under the cursor (kept small enough not to touch the neighbours)
const DOCK_REACH = 170; // how far (px) the swell spreads either side of the cursor

function ToolTile({ tool, className = '' }: { tool: Tool; className?: string }) {
  return (
    <span className={`tool-tile ${className}`}>
      <img
        src={`./tools/${tool.src}`}
        alt={tool.name}
        loading="lazy"
        draggable={false}
        className={
          tool.full
            ? 'w-full h-full object-cover scale-[1.12]' // trims the favicon's own rounded corners
            : 'w-full h-full object-contain p-[19%]'
        }
      />
    </span>
  );
}

function DockIcon({ tool, mouseX, still }: { tool: Tool; mouseX: MotionValue<number>; still: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const [hover, setHover] = useState(false);

  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    return box ? x - box.left - box.width / 2 : Infinity;
  });
  const target = useTransform(distance, [-DOCK_REACH, 0, DOCK_REACH], [1, DOCK_PEAK, 1]);
  const scale = useSpring(target, { mass: 0.1, stiffness: 180, damping: 14 });
  // keeps the name label just above the swollen icon
  const labelY = useTransform(scale, (s) => -(s - 1) * (ref.current?.offsetHeight ?? 0));

  return (
    <li
      ref={ref}
      className="relative shrink-0 w-[60px] h-[60px] xl:w-[68px] xl:h-[68px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.span className="block w-full h-full origin-bottom" style={still ? undefined : { scale }}>
        <ToolTile tool={tool} className="w-full h-full" />
      </motion.span>
      <motion.span
        style={still ? undefined : { y: labelY }}
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 pointer-events-none"
      >
        <AnimatePresence>
          {hover && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2, transition: { duration: 0.1 } }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              aria-hidden
              className="block whitespace-nowrap rounded-[9px] bg-ink px-2.5 py-1 font-sans t-caption text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)]"
            >
              {tool.name}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </li>
  );
}

function Dock() {
  const mouseX = useMotionValue(Infinity);
  const still = !!useReducedMotion();

  return (
    <ul
      aria-label="Tools I use"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="clay-dialogue-card border border-[#EBEBE8] rounded-[28px] inline-flex items-end gap-5 p-5"
    >
      {TOOL_GROUPS.map((group, g) => [
        g > 0 && <li key={`divider-${g}`} aria-hidden className="self-center w-px h-10 bg-[#DADAD5]" />,
        ...group.map((tool) => <DockIcon key={tool.name} tool={tool} mouseX={mouseX} still={still} />),
      ])}
      <li aria-hidden className="self-center w-px h-10 bg-[#DADAD5]" />
      <li className="self-center pr-1 font-sans t-ui text-ink-muted whitespace-nowrap">
        + many others
      </li>
    </ul>
  );
}

export function Tools() {
  return (
    <section id="tools" className="pt-14 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-32 overflow-visible scroll-mt-24">
      <div className="mb-10 sm:mb-12 lg:mb-14">
        <ScrollRevealTitle>
          <h2 className="font-display t-display heading-gradient">
            Tools I use
          </h2>
        </ScrollRevealTitle>
      </div>

      {/* Laptops and up: the dock, full width (the top padding leaves room for icons swelling out of it) */}
      <motion.div {...pop(0)} className="hidden lg:block pt-6">
        <Dock />
      </motion.div>

      {/* Phones and tablets: a full-width grid of icons with their names */}
      <motion.ul
        {...pop(0)}
        aria-label="Tools I use"
        className="lg:hidden grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-6 sm:gap-y-7 w-full"
      >
        {TOOL_GROUPS.flat().map((tool) => (
          <li key={tool.name} className="flex flex-col items-center gap-2 text-center">
            <motion.span whileTap={{ scale: 0.92 }} className="block w-14 h-14 sm:w-16 sm:h-16">
              <ToolTile tool={tool} className="w-full h-full" />
            </motion.span>
            <span aria-hidden className="font-sans t-meta text-ink-muted">
              {tool.name}
            </span>
          </li>
        ))}
        <li className="flex flex-col items-center gap-2 text-center">
          <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-[24%] border border-dashed border-[#D6D6D1] flex items-center justify-center font-sans t-lead text-ink-muted">
            +
          </span>
          <span className="font-sans t-meta text-ink-muted">many others</span>
        </li>
      </motion.ul>
    </section>
  );
}
