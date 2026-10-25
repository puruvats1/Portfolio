import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  Handshake,
  Quote,
  Mail,
} from 'lucide-react';

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

// Friendly, soft, tilted waving hand icon with light stroke and motion ripples
function WavingHandIcon({ className, strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <g transform="rotate(-28 12 12)">
        {/* Wave motion ripple arcs around fingertips */}
        <path d="M4.5 5.5a5 5 0 0 1 3-3" strokeWidth={Math.max(1, strokeWidth * 0.9)} opacity={0.75} />
        <path d="M16.5 2.5a5 5 0 0 1 3 3" strokeWidth={Math.max(1, strokeWidth * 0.9)} opacity={0.75} />
        {/* Waving open hand with 4 rounded fingers and thumb */}
        <path d="M9 12V6.5a1.2 1.2 0 0 1 2.4 0v4.5" />
        <path d="M11.4 11V4.8a1.2 1.2 0 0 1 2.4 0v5.7" />
        <path d="M13.8 11V5.5a1.2 1.2 0 0 1 2.4 0v5.5" />
        <path d="M16.2 11.5V7.2a1.2 1.2 0 0 1 2.4 0v6.8c0 3.8-3 6.8-6.8 6.8-2.6 0-4.8-1.4-6-3.4l-1.8-2.6a1.2 1.2 0 0 1 2-1.4l1.6 1.8" />
      </g>
    </svg>
  );
}

// Smiley icon with soft eyes and a round, short smile
function SmileyIcon({ className, strokeWidth = 1.4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="12" cy="12" r="9.5" />
      {/* Soft rounded eye dots */}
      <circle cx="9" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      {/* Round and short smile: narrow span from 9.8 to 14.2, deep circular curve */}
      <path d="M9.8 13.8C10.3 15.3 11.1 16.1 12 16.1C12.9 16.1 13.7 15.3 14.2 13.8" />
    </svg>
  );
}

// Exactly derived from the user's Figma button specifications with soft, premium icons (toned down, not too bright)
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    hoverLabel: 'hello!',
    icon: WavingHandIcon,
    iconColor: 'text-[#8B5E2B]',
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
    icon: Briefcase,
    iconColor: 'text-[#3B72C2]',
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
    icon: SmileyIcon,
    iconColor: 'text-[#BA5D38]',
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
    icon: Handshake,
    iconColor: 'text-[#527318]',
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
    icon: Quote,
    iconColor: 'text-[#1B7E63]',
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
    icon: Mail,
    iconColor: 'text-[#A83854]',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]/75',
    textGradient: 'from-[#BE123C] to-[#881337]',
    btnShadow: 'btn-clay-pink',
    pillShadow: 'pill-clay-pink',
  },
];

export function LeftSidebar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isHoveredNear, setIsHoveredNear] = useState(false);
  const [hoveredTitleId, setHoveredTitleId] = useState<SectionId | null>(null);

  const isAnyHovered = isHoveredNear || hoveredTitleId !== null;

  useEffect(() => {
    const handleScroll = () => {
      // If user reaches the very bottom of the page, activate contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) {
        setActiveSection('contact');
        return;
      }

      const scrollThreshold = window.scrollY + window.innerHeight * 0.35;

      const sectionElements = NAV_ITEMS.map((item) => ({
        id: item.id,
        el: document.getElementById(item.id),
      })).filter((s): s is { id: SectionId; el: HTMLElement } => s.el !== null);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, el } = sectionElements[i];
        if (scrollThreshold >= el.offsetTop) {
          setActiveSection(id);
          return;
        }
      }

      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* DESKTOP SMART NAVBAR: Vertically centered to viewport, aligned with 1400px boundary */}
      <aside
        onMouseEnter={() => setIsHoveredNear(true)}
        onMouseLeave={() => {
          setIsHoveredNear(false);
          setHoveredTitleId(null);
        }}
        style={{ left: 'max(16px, calc((100vw - 1400px) / 2 + 16px))' }}
        className="hidden lg:flex fixed top-1/2 -translate-y-1/2 z-40 flex-col -space-y-2 select-none pr-16 -mr-16"
        aria-label="Website Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const IconComponent = item.icon;

          return (
            <div
              key={item.id}
              className={`relative flex items-center gap-3.5 transition-transform duration-200 ${
                isActive ? 'z-20' : 'z-10'
              }`}
            >
              {/* Tactile Pastel Jelly-Clay Squircle Button: (w=89, h=69, r=26px) with clean 1px border & 3-tier clay shadow */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onMouseEnter={() => setHoveredTitleId(item.id)}
                onMouseLeave={() => setHoveredTitleId(null)}
                onClick={() => scrollTo(item.id)}
                className={`w-[89px] h-[69px] rounded-[26px] bg-gradient-to-b ${item.gradient} border ${
                  item.border
                } ${
                  isActive ? 'scale-105' : 'hover:scale-105'
                } ${item.btnShadow} flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 group`}
                aria-label={item.label}
              >
                <IconComponent
                  strokeWidth={1.4}
                  className={`w-[32px] h-[32px] ${item.iconColor} opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:scale-108 pointer-events-none select-none`}
                />
              </motion.button>

              {/* Smart Label Popup Area */}
              <div className="flex items-center min-w-[130px]">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    /* Active section filled link button: clean text popup without duplicated icon */
                    <motion.button
                      key={`active-pill-${item.id}-${isAnyHovered}`}
                      initial={{ scale: 0.88, opacity: 0, x: -6 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.88, opacity: 0, x: -6 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      onMouseEnter={() => setHoveredTitleId(item.id)}
                      onMouseLeave={() => setHoveredTitleId(null)}
                      onClick={() => scrollTo(item.id)}
                      className={`h-[38px] px-3.5 py-[8px] rounded-[13px] bg-gradient-to-b ${item.gradient} border ${item.border} ${item.pillShadow} flex items-center justify-center cursor-pointer select-none transition-all duration-200`}
                    >
                      <span
                        className={`font-sans font-bold text-[13.5px] leading-[20px] tracking-[-0.3px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-85 whitespace-nowrap`}
                      >
                        {isAnyHovered ? item.hoverLabel : item.label}
                      </span>
                    </motion.button>
                  ) : isAnyHovered ? (
                    /* Non-selected section title: soft muted text */
                    <motion.button
                      key={`hover-grey-text-${item.id}`}
                      initial={{ opacity: 0, x: -10, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -8, filter: 'blur(2px)' }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setHoveredTitleId(item.id)}
                      onMouseLeave={() => setHoveredTitleId(null)}
                      onClick={() => scrollTo(item.id)}
                      className="font-sans font-bold text-[13.5px] leading-[20px] tracking-[-0.3px] lowercase text-[#888884] hover:text-[#333330] hover:scale-105 transition-all duration-150 cursor-pointer select-none px-2 py-1 text-left"
                    >
                      {item.hoverLabel}
                    </motion.button>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </aside>

      {/* MOBILE & TABLET FLOATING DOCK */}
      <nav
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-[20px] bg-white/92 backdrop-blur-xl border border-neutral-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.14)] max-w-[calc(100vw-20px)] overflow-x-auto no-scrollbar"
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
              onClick={() => scrollTo(item.id)}
              className={`h-[43px] rounded-[15px] border transition-all duration-200 shrink-0 cursor-pointer flex items-center ${
                isActive
                  ? `px-3.5 sm:px-4 py-[10px] gap-[10px] bg-gradient-to-b ${item.gradient} ${item.border} ${item.pillShadow}`
                  : `w-[43px] justify-center bg-gradient-to-b ${item.gradient} ${item.border} ${item.btnShadow} opacity-85`
              }`}
              aria-label={item.label}
            >
              <IconComponent
                strokeWidth={1.4}
                className={`w-[18px] h-[18px] ${item.iconColor} opacity-80 shrink-0 pointer-events-none select-none`}
              />

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`font-sans font-bold text-[13.5px] leading-[20px] tracking-[-0.3px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-80 whitespace-nowrap overflow-hidden`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
