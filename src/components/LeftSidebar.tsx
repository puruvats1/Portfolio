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
  textGradient: string;
  btnShadow: string;
  pillShadow: string;
}

// Exactly derived from the user's Figma button code (w=99.16, h=43, p=10px 16px, gap=10px, r=15px, border=1px solid)
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    hoverLabel: 'hello!',
    icon: './waving_hand.svg',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]',
    textGradient: 'from-[#92400E] to-[#713F12]',
    btnShadow: 'btn-clay-yellow',
    pillShadow: 'pill-clay-yellow',
  },
  {
    id: 'work',
    label: 'work',
    hoverLabel: ':work:',
    icon: './work_icon.svg',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]', // Exact: linear-gradient(180deg, #E6F1FE 0%, #72BDFF 100%)
    border: 'border-[#B7D9FF]',             // Exact: 1px solid #B7D9FF
    textGradient: 'from-[#1D4ED8] to-[#1E3A8A]', // Exact: linear-gradient(180deg, #1D4ED8 0%, #1E3A8A 100%)
    btnShadow: 'btn-clay-blue',
    pillShadow: 'pill-clay-blue',
  },
  {
    id: 'about',
    label: 'about',
    hoverLabel: "'about'",
    icon: './about_icon.svg',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]',
    textGradient: 'from-[#C2410C] to-[#9A3412]',
    btnShadow: 'btn-clay-peach',
    pillShadow: 'pill-clay-peach',
  },
  {
    id: 'working-with-me',
    label: 'skills',
    hoverLabel: '<skills>',
    icon: './skills_icon.svg',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]',
    textGradient: 'from-[#3F6212] to-[#294109]',
    btnShadow: 'btn-clay-lime',
    pillShadow: 'pill-clay-lime',
  },
  {
    id: 'testimonials',
    label: 't’monials',
    hoverLabel: "/t'monials",
    icon: './testimonials_icon.svg',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]',
    textGradient: 'from-[#047857] to-[#064E3B]',
    btnShadow: 'btn-clay-mint',
    pillShadow: 'pill-clay-mint',
  },
  {
    id: 'contact',
    label: 'contact',
    hoverLabel: '#contact',
    icon: './contact_icon.svg',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]',
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
        className="hidden lg:flex fixed left-5 xl:left-8 2xl:left-14 top-[104px] xl:top-[108px] z-40 flex-col -space-y-2 select-none pr-16 -mr-16"
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
              <div className="flex items-center min-w-[130px]">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    /* Active section filled link button: Directly derived from Figma node 58:2744 / user inspect code:
                       display: flex; flex-direction: row; align-items: center; padding: 10px 16px; gap: 10px;
                       height: 43px; border-radius: 15px; border: 1px solid;
                       SVG: 18px x 18px, opacity 0.8;
                       Text: DM Sans Bold 16px / 24px, letter-spacing -0.4px, lowercase, gradient text fill, opacity 0.8
                    */
                    <motion.button
                      key={`active-pill-${item.id}-${isAnyHovered}`}
                      initial={{ scale: 0.88, opacity: 0, x: -6 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.88, opacity: 0, x: -6 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      onMouseEnter={() => setHoveredTitleId(item.id)}
                      onMouseLeave={() => setHoveredTitleId(null)}
                      onClick={() => scrollTo(item.id)}
                      className={`h-[43px] px-4 py-[10px] rounded-[15px] bg-gradient-to-b ${item.gradient} border ${item.border} ${item.pillShadow} flex items-center gap-[10px] cursor-pointer select-none transition-all duration-200`}
                    >
                      <img
                        src={item.icon}
                        alt=""
                        className="w-[18px] h-[18px] object-contain select-none pointer-events-none opacity-80 shrink-0"
                      />
                      <span
                        className={`font-sans font-bold text-[16px] leading-[24px] tracking-[-0.4px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-80 whitespace-nowrap`}
                      >
                        {isAnyHovered ? item.hoverLabel : item.label}
                      </span>
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
                      className="font-sans font-bold text-[16px] leading-[24px] tracking-[-0.4px] lowercase text-[#A3A3A3] opacity-80 hover:opacity-100 hover:text-[#111110] hover:scale-105 transition-all duration-150 cursor-pointer select-none px-2 py-1 text-left"
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
              <img
                src={item.icon}
                alt={item.label}
                className="w-[18px] h-[18px] object-contain select-none pointer-events-none opacity-80 shrink-0"
              />

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`font-sans font-bold text-[16px] leading-[24px] tracking-[-0.4px] lowercase bg-gradient-to-b ${item.textGradient} bg-clip-text text-transparent opacity-80 whitespace-nowrap overflow-hidden`}
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
