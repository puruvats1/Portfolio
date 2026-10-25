import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SectionId = 'hero' | 'work' | 'about' | 'working-with-me' | 'testimonials' | 'contact';

export interface NavItem {
  id: SectionId;
  label: string;
  hoverLabel: string;
  icon: string;
  gradient: string;
  border: string;
  textColor: string;
  btnShadow: string;
  pillShadow: string;
}

// Exactly calibrated to Figma node 58:3013 (Blue button sample) & node 46:1356 (Navbar stacked state)
// No dark strokes or colored drop shadows
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    hoverLabel: 'hello!',
    icon: './waving_hand.svg',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#FEEA80]/80',
    textColor: 'text-[#92400E]',
    btnShadow: 'btn-clay-yellow',
    pillShadow: 'pill-clay-yellow',
  },
  {
    id: 'work',
    label: 'work',
    hoverLabel: ':work:',
    icon: './work_icon.svg',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]', // Exact Figma node 58:3013
    border: 'border-[#93C5FD]/60',
    textColor: 'text-[#1D4ED8]',
    btnShadow: 'btn-clay-blue',
    pillShadow: 'pill-clay-blue',
  },
  {
    id: 'about',
    label: 'about',
    hoverLabel: "'about'",
    icon: './about_icon.svg',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FED2BE]/80',
    textColor: 'text-[#C2410C]',
    btnShadow: 'btn-clay-peach',
    pillShadow: 'pill-clay-peach',
  },
  {
    id: 'working-with-me',
    label: 'skills',
    hoverLabel: '<skills>',
    icon: './skills_icon.svg',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#D5F24B]/70',
    textColor: 'text-[#4D7C0F]',
    btnShadow: 'btn-clay-lime',
    pillShadow: 'pill-clay-lime',
  },
  {
    id: 'testimonials',
    label: 't’monials',
    hoverLabel: "/t'monials",
    icon: './testimonials_icon.svg',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#B2F2D1]/80',
    textColor: 'text-[#047857]',
    btnShadow: 'btn-clay-mint',
    pillShadow: 'pill-clay-mint',
  },
  {
    id: 'contact',
    label: 'contact',
    hoverLabel: '#contact',
    icon: './contact_icon.svg',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FFC3D1]/80',
    textColor: 'text-[#BE123C]',
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
      {/* DESKTOP SMART NAVBAR: Tightly stacked tactile buttons matching Figma node 46:1356.
          - When cursor is away: ONLY the active section's filled supporting popup is visible; grey titles are hidden.
          - When hovered near / any title hovered: Grey titles smoothly appear displaying their playful hover forms:
            hello!, :work:, 'about', <skills>, /t'monials, #contact */}
      <aside
        onMouseEnter={() => setIsHoveredNear(true)}
        onMouseLeave={() => {
          setIsHoveredNear(false);
          setHoveredTitleId(null);
        }}
        className="hidden lg:flex fixed left-5 xl:left-8 2xl:left-14 top-1/2 -translate-y-1/2 z-40 flex-col -space-y-2 select-none py-6 pr-16 -mr-16"
        aria-label="Website Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex items-center gap-3.5 transition-transform duration-200 ${
                isActive ? 'z-20' : 'z-10'
              }`}
            >
              {/* Tactile Pastel Jelly-Clay Squircle Button: Exactly matching Figma node 58:2744 (w=89.37, h=68.65, r=25.9) */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onMouseEnter={() => setHoveredTitleId(item.id)}
                onMouseLeave={() => setHoveredTitleId(null)}
                onClick={() => scrollTo(item.id)}
                className={`w-[89px] h-[69px] rounded-[26px] bg-gradient-to-b ${item.gradient} border-[1.73px] ${
                  item.border
                } ${
                  isActive ? 'scale-105' : 'hover:scale-105'
                } ${item.btnShadow} flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200`}
                aria-label={item.label}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[34px] h-[34px] object-contain select-none pointer-events-none opacity-80 transition-transform duration-200 group-hover:scale-110"
                />
              </motion.button>

              {/* Smart Label Popup Area */}
              <div className="flex items-center min-w-[120px]">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    /* Active section filled supporting button: ALWAYS visible (shows hoverLabel when any title hovered) */
                    <motion.button
                      key={`active-pill-${item.id}-${isAnyHovered}`}
                      initial={{ scale: 0.88, opacity: 0, x: -6 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.88, opacity: 0, x: -6 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      onMouseEnter={() => setHoveredTitleId(item.id)}
                      onMouseLeave={() => setHoveredTitleId(null)}
                      onClick={() => scrollTo(item.id)}
                      className={`px-5 py-2.5 rounded-[20px] bg-gradient-to-b ${item.gradient} border-[1.73px] ${item.border} ${item.pillShadow} ${item.textColor} font-display font-bold text-[20px] leading-[24px] tracking-[-0.02em] cursor-pointer select-none shadow-xs`}
                    >
                      {isAnyHovered ? item.hoverLabel : item.label}
                    </motion.button>
                  ) : isAnyHovered ? (
                    /* Non-selected section grey title: Appears when hovered near / over any title */
                    <motion.button
                      key={`hover-grey-text-${item.id}`}
                      initial={{ opacity: 0, x: -10, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -8, filter: 'blur(2px)' }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => setHoveredTitleId(item.id)}
                      onMouseLeave={() => setHoveredTitleId(null)}
                      onClick={() => scrollTo(item.id)}
                      className="font-display font-bold text-[20px] leading-[24px] tracking-[-0.02em] text-[#A3A3A3] hover:text-[#111110] hover:scale-105 transition-all duration-150 cursor-pointer select-none px-2 py-1 text-left"
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
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 sm:p-2 rounded-full bg-white/92 backdrop-blur-xl border border-neutral-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.14)] max-w-[calc(100vw-20px)] overflow-x-auto no-scrollbar"
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              layout
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-[18px] transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-b ${item.gradient} border-[1.73px] ${item.border} ${item.pillShadow}`
                  : `bg-gradient-to-b ${item.gradient} border-[1.73px] ${item.border} ${item.btnShadow} opacity-85`
              }`}
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5 object-contain select-none pointer-events-none opacity-85"
              />

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`font-display font-bold text-[14px] tracking-tight lowercase whitespace-nowrap overflow-hidden ${item.textColor}`}
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
