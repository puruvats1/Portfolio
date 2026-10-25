import React, { useState, useEffect } from 'react';
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

// 1. Friendly, soft, tilted waving hand icon with 30% thicker stroke (1.82) and NO fill color
function WavingHandIcon({ className, strokeWidth = 1.82 }: { className?: string; strokeWidth?: number }) {
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
        <path d="M4.5 5.5a5 5 0 0 1 3-3" strokeWidth={Math.max(1.2, strokeWidth * 0.85)} opacity={0.8} />
        <path d="M16.5 2.5a5 5 0 0 1 3 3" strokeWidth={Math.max(1.2, strokeWidth * 0.85)} opacity={0.8} />
        {/* Waving open hand with 4 rounded fingers and thumb */}
        <path d="M9 12V6.5a1.2 1.2 0 0 1 2.4 0v4.5" />
        <path d="M11.4 11V4.8a1.2 1.2 0 0 1 2.4 0v5.7" />
        <path d="M13.8 11V5.5a1.2 1.2 0 0 1 2.4 0v5.5" />
        <path d="M16.2 11.5V7.2a1.2 1.2 0 0 1 2.4 0v6.8c0 3.8-3 6.8-6.8 6.8-2.6 0-4.8-1.4-6-3.4l-1.8-2.6a1.2 1.2 0 0 1 2-1.4l1.6 1.8" />
      </g>
    </svg>
  );
}

// 2. Briefcase icon with 30% thicker stroke (1.82) and NO fill color
function BriefcaseIcon({ className, strokeWidth = 1.82 }: { className?: string; strokeWidth?: number }) {
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
      {/* Handle */}
      <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      {/* Briefcase Body */}
      <rect x="3" y="8" width="18" height="13" rx="3.5" />
      {/* Inner latch line */}
      <path d="M8 13h8" />
    </svg>
  );
}

// 3. Smiley icon with soft eyes, 30% thicker stroke (1.82), short round smile and NO fill color
function SmileyIcon({ className, strokeWidth = 1.82 }: { className?: string; strokeWidth?: number }) {
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
      <circle cx="9" cy="9.5" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="1.15" fill="currentColor" stroke="none" />
      {/* Round and short smile */}
      <path d="M9.8 13.8C10.3 15.3 11.1 16.1 12 16.1C12.9 16.1 13.7 15.3 14.2 13.8" />
    </svg>
  );
}

// 4. Handshake icon using user's exact SVG vector path in a darker lime shade
function HandshakeIcon({ className }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M9.27116 6.52687L4.6035 11.1945C0.225917 15.5721 0.225917 22.6659 4.6035 27.0435C8.98108 31.4211 16.0749 31.4211 20.4524 27.0435L28.3769 19.119C29.6559 17.84 29.6559 15.7435 28.3769 14.4513C28.2187 14.2931 28.0473 14.1481 27.8627 14.0294L28.3769 13.5152C29.6559 12.2362 29.6559 10.1397 28.3769 8.84751C28.166 8.63655 27.9154 8.45195 27.6649 8.30691C28.1923 7.09385 27.9682 5.64344 26.9793 4.65453C25.8321 3.50739 24.0521 3.38872 22.7599 4.28534C22.6281 4.08755 22.483 3.90296 22.3116 3.73155C21.0326 2.45255 18.9361 2.45255 17.6439 3.73155L14.3344 7.0411C14.2157 6.85651 14.0707 6.68509 13.9124 6.52687C12.6335 5.24788 10.5502 5.24788 9.27116 6.52687ZM11.1303 8.39921C11.394 8.1355 11.8028 8.1355 12.0665 8.39921C12.3302 8.66292 12.3302 9.07167 12.0665 9.33538L7.8735 13.5284C9.4162 15.0711 9.4162 17.5763 7.8735 19.119L9.73265 20.9782C11.6445 19.0663 12.1324 16.2709 11.2094 13.9107L19.5163 5.60389C19.78 5.34018 20.1887 5.34018 20.4524 5.60389C20.7162 5.8676 20.7162 6.27635 20.4524 6.54005L14.3871 12.6054L16.2463 14.4645L24.1708 6.54005C24.4345 6.27635 24.8432 6.27635 25.1069 6.54005C25.3706 6.80376 25.3706 7.21251 25.1069 7.47622L17.1824 15.4007L19.0416 17.2599L25.5684 10.733C25.8321 10.4693 26.2409 10.4693 26.5046 10.733C26.7683 10.9967 26.7683 11.4055 26.5046 11.6692L19.0416 19.1322L20.9008 20.9913L25.5684 16.3237C25.8321 16.06 26.2409 16.06 26.5046 16.3237C26.7683 16.5874 26.7683 16.9961 26.5046 17.2599L18.5933 25.1843C15.2442 28.5334 9.82495 28.5334 6.47584 25.1843C3.12672 21.8352 3.12672 16.416 6.47584 13.0669L11.1303 8.39921ZM30.3284 22.4154C30.3284 26.7798 26.7815 30.3267 22.4171 30.3267V28.3488C25.6871 28.3488 28.3506 25.6854 28.3506 22.4154H30.3284ZM1.32031 9.22989C1.32031 4.8655 4.86721 1.3186 9.2316 1.3186V3.29643C5.9616 3.29643 3.29814 5.95989 3.29814 9.22989H1.32031Z"
        fill="currentColor"
      />
    </svg>
  );
}

// 5. Quotes icon with 30% thicker stroke (1.82) and NO fill color
function QuotesIcon({ className, strokeWidth = 1.82 }: { className?: string; strokeWidth?: number }) {
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
      <path d="M3 13h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4" />
      <path d="M14 13h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4" />
    </svg>
  );
}

// 6. Mail icon with 30% thicker stroke (1.82) and NO fill color
function MailIcon({ className, strokeWidth = 1.82 }: { className?: string; strokeWidth?: number }) {
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
      <rect x="2.5" y="4.5" width="19" height="15" rx="3.5" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// Exact Figma button specifications with slightly darker shades for icon strokes
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    hoverLabel: 'hello!',
    icon: WavingHandIcon,
    iconColor: 'text-[#9A6014]',
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
    icon: BriefcaseIcon,
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
    icon: SmileyIcon,
    iconColor: 'text-[#C2410C]',
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
    icon: HandshakeIcon,
    iconColor: 'text-[#4D7C0F]',
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
    icon: QuotesIcon,
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
    icon: MailIcon,
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
      {/* DESKTOP SMART NAVBAR: Dedicated Sticky Column in Page Layout Grid */}
      {mode !== 'mobile' && (
        <aside
          onMouseEnter={() => setIsHoveredNear(true)}
          onMouseLeave={() => {
            setIsHoveredNear(false);
            setHoveredTitleId(null);
          }}
          className="hidden lg:flex flex-col -space-y-2 select-none relative"
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
                    strokeWidth={1.82}
                    className={`w-[32px] h-[32px] ${item.iconColor} opacity-90 transition-all duration-200 group-hover:opacity-100 group-hover:scale-108 pointer-events-none select-none`}
                  />
                </motion.button>

                {/* Smart Label Popup Area: Contained within the dedicated sticky rail */}
                <div className="flex items-center min-w-[125px]">
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
      )}

      {/* MOBILE & TABLET FLOATING DOCK */}
      {mode !== 'desktop' && (
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
                  strokeWidth={1.82}
                  className={`w-[20px] h-[20px] ${item.iconColor} opacity-90 shrink-0 pointer-events-none select-none`}
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
      )}
    </>
  );
}
