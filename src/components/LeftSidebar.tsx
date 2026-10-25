import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
function SmileyNavIcon({ className }: { className?: string; strokeWidth?: number }) {
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
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello',
    hoverLabel: 'hello!',
    icon: HomeNavIcon,
    iconColor: 'text-[#854D0E]',
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
    iconColor: 'text-[#1D4ED8]',
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
    iconColor: 'text-[#C75F34]',
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
    iconColor: 'text-[#638722]',
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
    iconColor: 'text-[#047857]',
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
    iconColor: 'text-[#BE123C]',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]/75',
    textGradient: 'from-[#BE123C] to-[#881337]',
    btnShadow: 'btn-clay-pink',
    pillShadow: 'pill-clay-pink',
  },
];

interface LeftSidebarProps {
  mode?: 'desktop' | 'mobile' | 'both';
}

export function LeftSidebar({ mode = 'both' }: LeftSidebarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isHoveredNear, setIsHoveredNear] = useState(false);
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);

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
          className="hidden lg:flex flex-col -space-y-1.5 select-none relative py-4 pr-6"
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
                onClick={() => scrollTo(item.id)}
                className="relative flex items-center gap-2.5 cursor-pointer group"
              >
                {/* Tactile Pastel Jelly-Clay Squircle Button:
                    Enlarges smoothly on hover (connected with text hover target).
                    Tucks and cascades cleanly behind or in front based on selection & hover focal point. */}
                <motion.div
                  animate={{
                    scale: isItemHovered ? 1.08 : isActive ? 1.04 : 1,
                    y: isItemHovered ? -2 : 0,
                  }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className={`w-[62px] h-[48px] rounded-[18px] bg-gradient-to-b ${item.gradient} border ${
                    item.border
                  } ${item.btnShadow} flex items-center justify-center shrink-0 select-none`}
                  aria-label={item.label}
                >
                  <IconComponent
                    strokeWidth={1.82}
                    className={`w-[22px] h-[22px] ${item.iconColor} opacity-90 transition-transform duration-200 ${
                      isItemHovered ? 'scale-110 opacity-100' : ''
                    } pointer-events-none select-none`}
                  />
                </motion.div>

                {/* Unified Supporting Text Area:
                    Connected to the button as ONE hover target.
                    Default: clean gray button text without punctuations.
                    Hover: shifts smoothly to punctuation version (e.g. 'about', :work:, <skills>) ONLY when unselected.
                    Active: displays in the filled pastel clay pill with permanent 3D shading. Does NOT re-add punctuations on hover. */}
                <div className="relative flex items-center min-w-[112px] h-[48px]">
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
                          position: 'absolute',
                          pointerEvents: 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                        className={`h-[34px] px-3.5 py-[7px] rounded-[13px] bg-gradient-to-b ${item.gradient} border ${item.border} ${item.pillShadow} flex items-center justify-center select-none`}
                      >
                        <span
                          className={`font-sans font-bold text-[13.5px] leading-[18px] tracking-[-0.2px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-95 whitespace-nowrap`}
                        >
                          {item.label}
                        </span>
                      </motion.div>
                    ) : isHoveredNear ? (
                      /* Non-selected section title: soft gray by default, highlights and reveals punctuations on hover */
                      <motion.div
                        key={`text-${item.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: isItemHovered ? 1 : 0.75,
                          scale: isItemHovered ? 1.05 : 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.95,
                          position: 'absolute',
                          pointerEvents: 'none',
                        }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="select-none px-2 py-1 text-left whitespace-nowrap"
                      >
                        <span
                          className={`font-sans font-bold text-[13.5px] leading-[18px] tracking-[-0.2px] lowercase transition-colors duration-150 ${
                            isItemHovered ? 'text-[#2C2C2A]' : 'text-[#888884]'
                          }`}
                        >
                          {isItemHovered ? item.hoverLabel : item.label}
                        </span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </aside>
      )}

      {/* MOBILE & TABLET FLOATING DOCK */}
      {mode !== 'desktop' && (
        <nav
          className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1 sm:p-1.5 rounded-[15px] bg-white/92 backdrop-blur-xl border border-neutral-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.14)] max-w-[calc(100vw-20px)] overflow-x-auto no-scrollbar"
          aria-label="Mobile Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;

            return (
              <motion.button
                key={item.id}
                layout
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                onClick={() => scrollTo(item.id)}
                className={`h-[36px] rounded-[13px] border shrink-0 cursor-pointer flex items-center ${
                  isActive
                    ? `px-3.5 py-[6px] gap-[7px] bg-gradient-to-b ${item.gradient} ${item.border} ${item.pillShadow}`
                    : `w-[36px] justify-center bg-gradient-to-b ${item.gradient} ${item.border} ${item.btnShadow} opacity-85`
                }`}
                aria-label={item.label}
              >
                <IconComponent
                  strokeWidth={1.82}
                  className={`w-[17px] h-[17px] ${item.iconColor} opacity-90 shrink-0 pointer-events-none select-none`}
                />

                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`font-sans font-bold text-[13.5px] leading-[18px] tracking-[-0.2px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-90 whitespace-nowrap overflow-hidden`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>
      )}
    </>
  );
}
