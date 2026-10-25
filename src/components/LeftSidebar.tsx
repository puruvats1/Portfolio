import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SectionId = 'hero' | 'work' | 'about' | 'working-with-me' | 'testimonials' | 'contact';

export interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  gradient: string;
  border: string;
  activeBorder: string;
  textColor: string;
  activeBgGradient: string;
  activeBorderColor: string;
  activeShadow: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    icon: './waving_hand.svg',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]',
    activeBorder: 'border-[#EAB308]',
    textColor: 'text-[#92400E]',
    activeBgGradient: 'from-[#FFF9CE] to-[#FEEA80]',
    activeBorderColor: 'border-[#F7DF59]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(234,179,8,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
  {
    id: 'work',
    label: 'work',
    icon: './work_icon.svg',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]',
    border: 'border-[#93C5FD]',
    activeBorder: 'border-[#2563EB]',
    textColor: 'text-[#1D4ED8]',
    activeBgGradient: 'from-[#E6F1FE] to-[#72BDFF]',
    activeBorderColor: 'border-[#93C5FD]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(37,99,235,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
  {
    id: 'about',
    label: 'about',
    icon: './about_icon.svg',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]',
    activeBorder: 'border-[#EA580C]',
    textColor: 'text-[#C2410C]',
    activeBgGradient: 'from-[#FFE9DC] to-[#FED2BE]',
    activeBorderColor: 'border-[#FDBA74]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(234,88,12,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
  {
    id: 'working-with-me',
    label: '<skills>',
    icon: './skills_icon.svg',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]',
    activeBorder: 'border-[#65A30D]',
    textColor: 'text-[#4D7C0F]',
    activeBgGradient: 'from-[#EDFA7E] to-[#D5F24B]',
    activeBorderColor: 'border-[#BEF264]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(101,163,13,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
  {
    id: 'testimonials',
    label: 't’monials',
    icon: './testimonials_icon.svg',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]',
    activeBorder: 'border-[#059669]',
    textColor: 'text-[#047857]',
    activeBgGradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    activeBorderColor: 'border-[#6EE7B7]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(5,150,105,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
  {
    id: 'contact',
    label: 'contact',
    icon: './contact_icon.svg',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]',
    activeBorder: 'border-[#E11D48]',
    textColor: 'text-[#BE123C]',
    activeBgGradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    activeBorderColor: 'border-[#FDA4AF]',
    activeShadow: 'shadow-[0px_4px_14px_rgba(225,29,72,0.25),inset_0px_2px_1px_1px_rgba(255,255,255,0.95)]',
  },
];

export function LeftSidebar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');

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
      {/* DESKTOP NAVBAR: Stays consistently on the left with exact 20px Urbanist bold lowercase labels */}
      <aside
        className="hidden lg:flex fixed left-5 xl:left-10 2xl:left-16 top-1/2 -translate-y-1/2 z-40 flex-col gap-3.5 select-none"
        aria-label="Website Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <div key={item.id} className="flex items-center gap-3.5 group">
              {/* Tactile Pastel Squircle Button (matching Figma 78x52 / 84x58, radius 25.9px) */}
              <motion.button
                whileHover={{ scale: 1.07, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => scrollTo(item.id)}
                className={`w-[74px] h-[52px] xl:w-[80px] xl:h-[56px] rounded-[24px] bg-gradient-to-b ${item.gradient} border-[1.7px] ${
                  isActive ? `${item.activeBorder} ring-2 ring-neutral-900/10 scale-105` : item.border
                } clay-tab-shadow flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200`}
                aria-label={item.label}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-7 h-7 xl:w-8 xl:h-8 object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-110"
                />
              </motion.button>

              {/* Section Label (Urbanist Bold 20px, lineHeight 24px, letterSpacing -0.02em, lowercase) */}
              <div className="flex items-center min-w-[95px]">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.button
                      key="active-filled"
                      initial={{ scale: 0.85, opacity: 0, x: -6 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.85, opacity: 0, x: -4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      onClick={() => scrollTo(item.id)}
                      className={`px-3.5 py-1.5 rounded-[15px] bg-gradient-to-b ${item.activeBgGradient} border-[1.5px] ${item.activeBorderColor} ${item.activeShadow} ${item.textColor} font-display font-bold text-[20px] leading-[24px] tracking-[-0.02em] lowercase cursor-pointer shadow-xs select-none`}
                    >
                      {item.label}
                    </motion.button>
                  ) : (
                    <motion.button
                      key="inactive-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => scrollTo(item.id)}
                      className="font-display font-bold text-[20px] leading-[24px] tracking-[-0.02em] lowercase text-[#A3A3A3] hover:text-[#404040] transition-colors cursor-pointer select-none px-2 py-1"
                    >
                      {item.label}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </aside>

      {/* MOBILE & TABLET FLOATING DOCK */}
      <nav
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full bg-white/92 backdrop-blur-xl border border-neutral-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.14)] max-w-[96vw] overflow-x-auto"
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
              className={`flex items-center gap-1.5 py-1.5 px-2.5 rounded-[16px] transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? `bg-gradient-to-b ${item.activeBgGradient} border-[1.5px] ${item.activeBorderColor} ${item.activeShadow}`
                  : `bg-gradient-to-b ${item.gradient} border-[1.5px] ${item.border} clay-tab-shadow opacity-85`
              }`}
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-4 h-4 object-contain select-none pointer-events-none"
              />

              <AnimatePresence>
                {isActive && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`font-display font-bold text-[13px] tracking-tight lowercase whitespace-nowrap overflow-hidden ${item.textColor}`}
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
