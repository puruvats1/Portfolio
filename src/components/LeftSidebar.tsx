import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { SHOW_WORKING_WITH_ME } from '../config';

export type SectionId = 'hero' | 'work' | 'about' | 'skills' | 'testimonials' | 'contact';

export type NavIconComponent = React.ComponentType<{
  className?: string;
  strokeWidth?: number;
  size?: number | string;
}>;

export interface NavItem {
  id: SectionId;
  label: string;
  hoverLabel: string;
  icon: NavIconComponent;
  iconColor: string;
  gradient: string;
  border: string;
  textGradient: string;
  btnShadow: string;
  pillShadow: string;
}

// 1. Home / House icon from Figma node 99:295
function HomeNavIcon({ className, strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.25 6.74952L8.99939 1.5L15.7488 6.74952V14.9988C15.7488 15.3966 15.5907 15.7781 15.3095 16.0593C15.0282 16.3406 14.6467 16.4986 14.2489 16.4986H3.74986C3.35207 16.4986 2.97058 16.3406 2.6893 16.0593C2.40802 15.7781 2.25 15.3966 2.25 14.9988V6.74952Z" />
      <path d="M6.75 16.499V8.99902H11.25V16.499" />
    </svg>
  );
}

// 2. Briefcase icon from Figma node 99:298
function BriefcaseNavIcon({ className, strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 15V3C12 2.60218 11.842 2.22064 11.5607 1.93934C11.2794 1.65804 10.8978 1.5 10.5 1.5H7.5C7.10218 1.5 6.72064 1.65804 6.43934 1.93934C6.15804 2.22064 6 2.60218 6 3V15" />
      <path d="M2.99989 4.49951H14.999C15.8274 4.49951 16.4989 5.17104 16.4989 5.9994V13.4989C16.4989 14.3272 15.8274 14.9987 14.999 14.9987H2.99989C2.17152 14.9987 1.5 14.3272 1.5 13.4989V5.9994C1.5 5.17104 2.17152 4.49951 2.99989 4.49951Z" />
    </svg>
  );
}

// 3. Smiley face icon from Figma node 99:301 (sentiment_satisfied_alt)
export function SmileyNavIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12.3101 8.25C12.8394 8.25 13.2686 7.82087 13.2686 7.2915C13.2686 6.76214 12.8394 6.33301 12.3101 6.33301C11.7807 6.33301 11.3516 6.76214 11.3516 7.2915C11.3516 7.82087 11.7807 8.25 12.3101 8.25Z" />
      <path d="M5.39307 8.25C5.92243 8.25 6.35156 7.82087 6.35156 7.2915C6.35156 6.76214 5.92243 6.33301 5.39307 6.33301C4.8637 6.33301 4.43457 6.76214 4.43457 7.2915C4.43457 7.82087 4.8637 8.25 5.39307 8.25Z" />
      <path d="M8.93906 10.5C7.95517 10.5 7.09503 10.0227 6.54666 9.29269C6.41571 9.11836 6.21769 9 5.99965 9C5.56657 9 5.27415 9.43696 5.51535 9.79665C6.25514 10.8998 7.51208 11.625 8.93906 11.625C10.3667 11.625 11.6241 10.8992 12.3638 9.79513C12.6043 9.43606 12.3125 9 11.8803 9C11.6613 9 11.4628 9.11965 11.3317 9.29504C10.7871 10.0237 9.9219 10.5 8.93906 10.5ZM8.9925 1.5C4.8525 1.5 1.5 4.86 1.5 9C1.5 13.14 4.8525 16.5 8.9925 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 8.9925 1.5ZM9 15C5.685 15 3 12.315 3 9C3 5.685 5.685 3 9 3C12.315 3 15 5.685 15 9C15 12.315 12.315 15 9 15Z" />
    </svg>
  );
}

// 4. Handshake icon from Figma node 99:303 (handshake)
function HandshakeNavIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M9.168 14.8914C9.033 15.0264 8.793 15.0489 8.6355 14.8914C8.5005 14.7564 8.478 14.5164 8.6355 14.3589L11.178 11.8164L10.1205 10.7589L7.578 13.3014C7.4355 13.4514 7.1955 13.4439 7.0455 13.3014C6.888 13.1439 6.9105 12.9039 7.0455 12.7689L9.588 10.2264L8.5305 9.16891L5.988 11.7114C5.853 11.8464 5.613 11.8689 5.4555 11.7114C5.313 11.5689 5.313 11.3289 5.4555 11.1789L7.998 8.63641L6.933 7.57891L4.3905 10.1214C4.2555 10.2564 4.0155 10.2789 3.858 10.1214C3.7155 9.97141 3.7155 9.73891 3.858 9.58891L7.143 6.30391L8.5455 7.69891C9.258 8.41141 10.488 8.40391 11.2005 7.69891C11.9355 6.96391 11.9355 5.77891 11.2005 5.04391L9.8055 3.64891L10.0155 3.43891C10.6005 2.85391 11.553 2.85391 12.138 3.43891L15.318 6.61891C15.903 7.20391 15.903 8.15641 15.318 8.74141L9.168 14.8914ZM16.3755 9.80641C17.5455 8.63641 17.5455 6.73891 16.3755 5.56141L13.1955 2.38141C12.0255 1.21141 10.128 1.21141 8.9505 2.38141L8.7405 2.59141L8.5305 2.38141C7.3605 1.21141 5.463 1.21141 4.2855 2.38141L1.6305 5.03641C0.565499 6.10141 0.467999 7.75891 1.3305 8.92891L2.418 7.84141C2.1255 7.27891 2.223 6.56641 2.6955 6.09391L5.3505 3.43891C5.9355 2.85391 6.888 2.85391 7.473 3.43891L10.143 6.10891C10.278 6.24391 10.3005 6.48391 10.143 6.64141C9.9855 6.79891 9.7455 6.77641 9.6105 6.64141L7.143 4.18141L2.793 8.52391C2.058 9.25141 2.058 10.4439 2.793 11.1789C3.0855 11.4714 3.4605 11.6514 3.858 11.7039C3.9105 12.0939 4.083 12.4689 4.383 12.7689C4.683 13.0689 5.058 13.2414 5.448 13.2939C5.5005 13.6839 5.673 14.0589 5.973 14.3589C6.273 14.6589 6.648 14.8314 7.038 14.8839C7.0905 15.2889 7.2705 15.6564 7.563 15.9489C7.9155 16.3014 8.388 16.4964 8.8905 16.4964C9.393 16.4964 9.8655 16.3014 10.218 15.9489L16.3755 9.80641Z" />
    </svg>
  );
}

// 5. Quotes icon from Figma node 99:304
function QuotesNavIcon({ className, strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 19"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.25006 15.7513C4.50025 15.7513 7.50051 15.0013 7.50051 9.75084V3.75033C7.50051 2.81276 6.93346 2.23746 6.00038 2.25021H3.00013C2.06255 2.25021 1.5 2.81276 1.5 3.72933V8.25071C1.5 9.18829 2.06255 9.75084 3.00013 9.75084C3.75019 9.75084 3.75019 9.75084 3.75019 10.5009V11.251C3.75019 12.001 3.00013 12.7511 2.25006 12.7511C1.5 12.7511 1.5 12.7571 1.5 13.5244V15.0013C1.5 15.7513 1.5 15.7513 2.25006 15.7513Z" />
      <path d="M11.2501 15.7513C13.5003 15.7513 16.5005 15.0013 16.5005 9.75084V3.75033C16.5005 2.81276 15.9327 2.23746 15.0004 2.25021H12.0001C11.0625 2.25021 10.5 2.81276 10.5 3.72933V8.25071C10.5 9.18829 11.0625 9.75084 12.0001 9.75084C12.7502 9.75084 12.7502 9.75084 12.7502 10.5009V11.251C12.7502 12.001 12.0001 12.7511 11.2501 12.7511C10.5 12.7511 10.5 12.7571 10.5 13.5244V15.0013C10.5 15.7513 10.5 15.7513 11.2501 15.7513Z" />
    </svg>
  );
}

// 6. Mail icon from Figma node 99:307
function MailNavIcon({ className, strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3.00023 3H15.0002C15.8286 3 16.5001 3.67157 16.5001 4.49999V13.4999C16.5001 14.3283 15.8286 14.9999 15.0002 14.9999H3.00023C2.17181 14.9999 1.50024 14.3283 1.50024 13.4999V4.49999C1.50024 3.67157 2.17181 3 3.00023 3Z" />
      <path d="M16.5001 5.24988L9.77269 9.52485C9.54114 9.66992 9.27343 9.74686 9.00019 9.74686C8.72696 9.74686 8.45924 9.66992 8.2277 9.52485L1.50024 5.24988" />
    </svg>
  );
}

// Default labels are clean names without fancy symbols.
// Hover labels contain the expressive punctuations/symbols (e.g. 'about', :work:, <skills>).
const ALL_NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello',
    hoverLabel: 'hello!',
    icon: HomeNavIcon,
    iconColor: 'text-[#A8730F]',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]/75',
    textGradient: 'from-[#8B5E2B] to-[#713F12]',
    btnShadow: 'btn-clay-yellow',
    pillShadow: 'pill-clay-yellow',
  },
  {
    id: 'work',
    label: 'work',
    hoverLabel: ':work:',
    icon: BriefcaseNavIcon,
    iconColor: 'text-[#3F74E3]',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]',
    border: 'border-[#B7D9FF]/75',
    textGradient: 'from-[#1D4ED8] to-[#1E3A8A]',
    btnShadow: 'btn-clay-blue',
    pillShadow: 'pill-clay-blue',
  },
  {
    id: 'about',
    label: 'about',
    hoverLabel: "'about'",
    icon: SmileyNavIcon,
    iconColor: 'text-[#D8693B]',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]/75',
    textGradient: 'from-[#C2410C] to-[#9A3412]',
    btnShadow: 'btn-clay-peach',
    pillShadow: 'pill-clay-peach',
  },
  {
    id: 'skills',
    label: 'skills',
    hoverLabel: '<skills>',
    icon: HandshakeNavIcon,
    iconColor: 'text-[#6E9A1F]',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]/75',
    textGradient: 'from-[#3F6212] to-[#294109]',
    btnShadow: 'btn-clay-lime',
    pillShadow: 'pill-clay-lime',
  },
  {
    id: 'testimonials',
    label: 't’monials',
    hoverLabel: "/t'monials",
    icon: QuotesNavIcon,
    iconColor: 'text-[#1C9A72]',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]/75',
    textGradient: 'from-[#047857] to-[#064E3B]',
    btnShadow: 'btn-clay-mint',
    pillShadow: 'pill-clay-mint',
  },
  {
    id: 'contact',
    label: 'contact',
    hoverLabel: '#contact',
    icon: MailNavIcon,
    iconColor: 'text-[#D4375F]',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]/75',
    textGradient: 'from-[#BE123C] to-[#881337]',
    btnShadow: 'btn-clay-pink',
    pillShadow: 'pill-clay-pink',
  },
];

// Sections that are still in draft (see src/config.ts) are left out of the navigation
/** 'work' + ':work:' → { prefix: ':', suffix: ':' } (apostrophe styles are treated as equal) */
export function splitHoverLabel(label: string, hoverLabel: string) {
  const norm = (t: string) => t.replace(/[’‘]/g, "'");
  const i = norm(hoverLabel).indexOf(norm(label));
  if (i < 0) return { prefix: '', suffix: '' };
  return { prefix: hoverLabel.slice(0, i), suffix: hoverLabel.slice(i + label.length) };
}

export const NAV_ITEMS: NavItem[] = ALL_NAV_ITEMS.filter(
  (item) => item.id !== 'skills' || SHOW_WORKING_WITH_ME
);

interface LeftSidebarProps {
  mode?: 'desktop' | 'mobile' | 'both';
}

/**
 * Easter egg: tapping the nav button that is ALREADY selected over and over makes it burst
 * into confetti and then pop back in.
 */
const BURST_TAPS = 6; // taps ...
const BURST_WINDOW_MS = 2200; // ... inside this window
const BURST_COLORS: Record<SectionId, string[]> = {
  hero: ['#F5C518', '#F59E0B', '#FFD84D', '#D98E04'],
  work: ['#4DA6FF', '#3F74E3', '#72BDFF', '#2563EB'],
  about: ['#F59E78', '#D8693B', '#FDBA74', '#EA7C4A'],
  skills: ['#A3CF1A', '#84CC16', '#D5F24B', '#65A30D'],
  testimonials: ['#34D399', '#1C9A72', '#6EE7B7', '#10B981'],
  contact: ['#FB7185', '#E11D48', '#F9A8D4', '#F43F5E'],
};

type BurstPhase = 'idle' | 'pop' | 'gone' | 'back';

/** What the burst does to the button itself, per phase (used as its animate prop). */
const BURST_ANIMATE = {
  pop: { scale: 1.4, opacity: 0, transition: { duration: 0.18, ease: 'easeOut' as const } },
  gone: { scale: 0, opacity: 0, transition: { duration: 0 } },
  back: { scale: 1, opacity: 1, transition: { type: 'spring' as const, stiffness: 420, damping: 11 } },
};

/** Confetti flying out from (x, y) in viewport coordinates. Rendered in a portal so no overflow clips it. */
function BurstParticles({ x, y, colors }: { x: number; y: number; colors: string[] }) {
  const bits = React.useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 46 + Math.random() * 54;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 6 + Math.random() * 6,
          color: colors[i % colors.length],
          round: i % 3 !== 0,
          spin: (Math.random() - 0.5) * 240,
          delay: Math.random() * 0.05,
        };
      }),
    [colors],
  );
  return createPortal(
    <div aria-hidden="true" className="fixed z-[200] pointer-events-none" style={{ left: x, top: y }}>
      {bits.map((b, i) => (
        <motion.span
          key={i}
          className={`absolute block ${b.round ? 'rounded-full' : 'rounded-[3px]'}`}
          style={{ width: b.size, height: b.size, left: -b.size / 2, top: -b.size / 2, background: b.color }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
          animate={{ x: b.dx, y: b.dy + 14, scale: [0.4, 1.1, 0], opacity: [1, 1, 0], rotate: b.spin }}
          transition={{ duration: 0.75, delay: b.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>,
    document.body,
  );
}

/** Natural width of the dock with the longest label open (5 buttons + 4 gaps, px); narrower screens scale it down to fit. */
const DOCK_CONTENT_WIDTH = 399;
/** Upper bound of the room the dock may use (it only ever takes its natural width, centred). */
const DOCK_MAX_WIDTH = 440;

export function LeftSidebar({ mode = 'both' }: LeftSidebarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isHoveredNear, setIsHoveredNear] = useState(false);
  // Mobile dock is 30% bigger than the original; on narrow phones it scales down just enough to fit
  // The gap under the dock equals the gap at its sides (24px phone, 32px tablet), so the spacing
  // looks even; the phone's gesture bar is deliberately NOT added on top of it.
  const [dockZoom, setDockZoom] = useState(1);
  const [dockGap, setDockGap] = useState(24);
  useEffect(() => {
    const fit = () => {
      const gap = window.innerWidth >= 640 ? 32 : 24;
      const room = Math.min(window.innerWidth - 2 * gap, DOCK_MAX_WIDTH);
      const zoom = Math.min(1, room / DOCK_CONTENT_WIDTH);
      setDockGap(gap);
      setDockZoom(zoom);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);

  // Easter egg state
  const [burst, setBurst] = useState<{ id: SectionId; phase: BurstPhase; x: number; y: number } | null>(null);
  const tapLog = useRef<{ id: SectionId; times: number[] }>({ id: 'hero', times: [] });
  const burstTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => burstTimers.current.forEach(clearTimeout), []);

  /** Returns true when this tap set off the burst (so the caller can skip its normal action). */
  const registerTap = (id: SectionId, isActive: boolean, el: HTMLElement | null): boolean => {
    if (!isActive || burst) {
      tapLog.current = { id, times: [] };
      return false;
    }
    const now = Date.now();
    const log = tapLog.current.id === id ? tapLog.current.times : [];
    const times = [...log.filter((t) => now - t < BURST_WINDOW_MS), now];
    tapLog.current = { id, times };
    if (times.length < BURST_TAPS || !el) return false;

    tapLog.current = { id, times: [] };
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    setBurst({ id, phase: 'pop', x, y });
    burstTimers.current.forEach(clearTimeout);
    burstTimers.current = [
      setTimeout(() => setBurst({ id, phase: 'gone', x, y }), 180),
      setTimeout(() => setBurst({ id, phase: 'back', x, y }), 700),
      setTimeout(() => setBurst(null), 1400),
    ];
    return true;
  };

  // Manual scroll flag to prevent scroll-spy from rapidly overriding activeSection during programmatic smooth scroll
  const isManualScroll = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Don't fight programmatic smooth scrolling
      if (isManualScroll.current) return;

      // If user reaches the bottom of the page, activate contact
      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (isNearBottom) {
        setActiveSection('contact');
        return;
      }

      // Viewport anchor: 35% down from top
      const viewportAnchor = window.innerHeight * 0.35;

      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((s): s is { id: SectionId; el: HTMLElement } => s.el !== null);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportAnchor) {
          setActiveSection(id);
          return;
        }
      }

      setActiveSection('hero');
    };

    // If the user manually uses the wheel or touches the screen during smooth scroll, release the lock immediately
    const handleUserInterrupt = () => {
      if (isManualScroll.current) {
        isManualScroll.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    isManualScroll.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Release lock after smooth scroll arrives
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 850);
  };

  // Focal point for cascading: The hovered item if any, otherwise the active/selected item
  const focalId = hoveredId ?? activeSection;
  const focalIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((it) => it.id === focalId)
  );

  return (
    <>
      {/* DESKTOP SMART NAVBAR: Dedicated Sticky Column in Page Layout Grid */}
      {mode !== 'mobile' && (
        <aside
          onMouseEnter={() => setIsHoveredNear(true)}
          onMouseLeave={() => {
            setIsHoveredNear(false);
            setHoveredId(null);
          }}
          className="hidden lg:flex flex-col -space-y-[7px] select-none relative py-4 pr-8"
          aria-label="Website Navigation"
        >
          {NAV_ITEMS.map((item, index) => {
            const isActive = activeSection === item.id;
            const isItemHovered = hoveredId === item.id;
            const IconComponent = item.icon;

            // Cascading z-index: Focal item has highest z-index (50); items cascade away above and below
            const distance = Math.abs(index - focalIndex);
            const zIndex = 50 - distance;

            return (
              <div
                key={item.id}
                style={{ zIndex }}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() =>
                  setHoveredId((current) => (current === item.id ? null : current))
                }
                onClick={(e) => {
                  const burstNow = registerTap(item.id, isActive, e.currentTarget.firstElementChild as HTMLElement | null);
                  if (!burstNow) scrollTo(item.id);
                }}
                className="nav-row relative flex items-center gap-3 cursor-pointer group"
              >
                {/* Tactile Pastel Jelly-Clay Squircle Button:
                    Enlarges smoothly on hover (connected with text hover target).
                    Tucks and cascades cleanly behind or in front based on selection & hover focal point. */}
                <motion.div
                  animate={
                    burst && burst.id === item.id
                      ? BURST_ANIMATE[burst.phase as Exclude<BurstPhase, 'idle'>]
                      : {
                          scale: isItemHovered ? 1.08 : isActive ? 1.04 : 1,
                          y: isItemHovered ? -2 : 0,
                          opacity: 1,
                        }
                  }
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 30, mass: 0.6 }}
                  className={`w-[72px] h-[56px] rounded-[21px] bg-gradient-to-b ${item.gradient} border ${
                    item.border
                  } ${item.btnShadow} flex items-center justify-center shrink-0 select-none`}
                  aria-label={item.label}
                >
                  <IconComponent
                    strokeWidth={1.82}
                    className={`w-[26px] h-[26px] ${item.iconColor} opacity-90 transition-transform duration-200 ${
                      isItemHovered ? 'scale-110 opacity-100' : ''
                    } pointer-events-none select-none`}
                  />
                </motion.div>

                {/* Unified Supporting Text Area:
                    Connected to the button as ONE hover target.
                    Default: clean gray button text without punctuations.
                    Hover: shifts smoothly to punctuation version (e.g. 'about', :work:, <skills>) ONLY when unselected.
                    Active: displays in the filled pastel clay pill with permanent 3D shading. Does NOT re-add punctuations on hover. */}
                <div className="relative flex items-center min-w-[130px] h-[56px]">
                  <AnimatePresence initial={false}>
                    {isActive ? (
                      /* Active section filled clay pill: in-place transition, permanent clay shading */
                      <motion.div
                        key={`active-pill-${item.id}`}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{
                          opacity: 1,
                          scale: isItemHovered ? 1.05 : 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.94,
                        }}
                        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 h-[40px] px-4 py-2 rounded-[15px] bg-gradient-to-b ${item.gradient} border ${item.border} ${item.pillShadow} flex items-center justify-center select-none`}
                      >
                        <span
                          className={`font-sans font-bold text-[15.5px] leading-[21px] tracking-[-0.25px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-95 whitespace-nowrap`}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    ) : isHoveredNear ? (
                      /* Non-selected section title: the word itself never moves. On hover the colour deepens
                         and the ornaments fade/slide in around it (they are positioned outside the word). */
                      <motion.div
                        key={`text-${item.id}`}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{
                          opacity: isItemHovered ? 1 : 0.75,
                          scale: isItemHovered ? 1.04 : 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.97,
                        }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ originX: 0 }}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 select-none px-2 py-1 text-left whitespace-nowrap"
                      >
                        {(() => {
                          const { prefix, suffix } = splitHoverLabel(item.label, item.hoverLabel);
                          return (
                            <span
                              className={`relative inline-block font-sans font-bold text-[15.5px] leading-[21px] tracking-[-0.25px] lowercase transition-colors duration-300 ease-out ${
                                isItemHovered ? 'text-[#2C2C2A]' : 'text-[#888884]'
                              }`}
                            >
                              {prefix && (
                                <span
                                  aria-hidden="true"
                                  className={`absolute right-full top-0 pr-px transition-[opacity,translate] duration-300 ease-out ${
                                    isItemHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-1.5'
                                  }`}
                                >
                                  {prefix}
                                </span>
                              )}
                              {item.label}
                              {suffix && (
                                <span
                                  aria-hidden="true"
                                  className={`absolute left-full top-0 pl-px transition-[opacity,translate] duration-300 ease-out ${
                                    isItemHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1.5'
                                  }`}
                                >
                                  {suffix}
                                </span>
                              )}
                            </span>
                          );
                        })()}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </aside>
      )}

      {burst && <BurstParticles key={`${burst.id}-${burst.x}-${burst.y}`} x={burst.x} y={burst.y} colors={BURST_COLORS[burst.id]} />}

      {/* Subtle blue gradient at screen bottom to guarantee floating button visibility & contrast */}
      {mode !== 'desktop' && (
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 h-[calc(9.5rem+env(safe-area-inset-bottom))] pointer-events-none z-40 backdrop-blur-lg [mask-image:linear-gradient(to_top,black_45%,transparent)]"
          aria-hidden="true"
        />
      )}

      {/* MOBILE & TABLET FLOATING DOCK (White container removed, buttons float directly over bottom blue gradient) */}
      {mode !== 'desktop' && (
        <nav
          className="lg:hidden fixed inset-x-0 z-50 flex justify-center pointer-events-none select-none"
          style={{ bottom: dockGap }}
          aria-label="Mobile Navigation"
        >
          <div className="pointer-events-auto flex items-center justify-center gap-[6px]" style={{ zoom: dockZoom }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.94 }}
                animate={burst && burst.id === item.id ? BURST_ANIMATE[burst.phase as Exclude<BurstPhase, 'idle'>] : { scale: 1, opacity: 1 }}
                onClick={(e) => {
                  const burstNow = registerTap(item.id, isActive, e.currentTarget);
                  if (!burstNow) scrollTo(item.id);
                }}
                className={`h-[55px] rounded-[20px] border shrink-0 cursor-pointer flex items-center transition-[padding,gap,background-color,border-color,opacity,box-shadow] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? `px-[18px] sm:px-5 py-[9px] gap-2.5 bg-gradient-to-b ${item.gradient} ${item.border} ${item.pillShadow} opacity-100 shadow-[0_4px_14px_rgba(0,0,0,0.12)]`
                    : `w-[55px] justify-center px-0 gap-0 bg-gradient-to-b ${item.gradient} ${item.border} ${item.btnShadow} opacity-85 hover:opacity-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)]`
                }`}
                aria-label={item.label}
              >
                <IconComponent
                  strokeWidth={1.82}
                  className={`w-[26px] h-[26px] ${item.iconColor} opacity-90 shrink-0 pointer-events-none select-none`}
                />

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className={`font-sans font-bold text-[19px] leading-none tracking-[-0.3px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-95 whitespace-nowrap overflow-hidden block`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
          </div>
        </nav>
      )}
    </>
  );
}
