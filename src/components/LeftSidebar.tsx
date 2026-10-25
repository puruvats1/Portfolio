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
  btnShadow: string;
  pillShadow: string;
}

// Exactly calibrated to Figma node 58:3013 (Blue button sample) and extended to all 6 tabs
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    icon: './waving_hand.svg',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]',
    activeBorder: 'border-[#EAB308]',
    textColor: 'text-[#92400E]',
    btnShadow: 'btn-clay-yellow',
    pillShadow: 'pill-clay-yellow',
  },
  {
    id: 'work',
    label: 'work',
    icon: './work_icon.svg',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]', // Exact Figma node 58:3013 gradient
    border: 'border-[#93C5FD]',             // Exact Figma node 58:3013 stroke
    activeBorder: 'border-[#2563EB]',
    textColor: 'text-[#1D4ED8]',
    btnShadow: 'btn-clay-blue',             // Exact Figma node 58:3013 multi-layer shadow
    pillShadow: 'pill-clay-blue',
  },
  {
    id: 'about',
    label: 'about',
    icon: './about_icon.svg',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]',
    activeBorder: 'border-[#EA580C]',
    textColor: 'text-[#C2410C]',
    btnShadow: 'btn-clay-peach',
    pillShadow: 'pill-clay-peach',
  },
  {
    id: 'working-with-me',
    label: '<skills>',
    icon: './skills_icon.svg',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]',
    activeBorder: 'border-[#65A30D]',
    textColor: 'text-[#4D7C0F]',
    btnShadow: 'btn-clay-lime',
    pillShadow: 'pill-clay-lime',
  },
  {
    id: 'testimonials',
    label: 't’monials',
    icon: './testimonials_icon.svg',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]',
    activeBorder: 'border-[#059669]',
    textColor: 'text-[#047857]',
    btnShadow: 'btn-clay-mint',
    pillShadow: 'pill-clay-mint',
  },
  {
    id: 'contact',
    label: 'contact',
    icon: './contact_icon.svg',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]',
    activeBorder: 'border-[#E11D48]',
    textColor: 'text-[#BE123C]',
    btnShadow: 'btn-clay-pink',
    pillShadow: 'pill-clay-pink',
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
      {/* DESKTOP NAVBAR: Replicating exact Figma node 58:3013 styling across all buttons & supporting popups */}
      <aside
        className="hidden lg:flex fixed left-5 xl:left-8 2xl:left-14 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 select-none"
        aria-label="Website Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <div key={item.id} className="flex items-center gap-4 group">
              {/* Tactile Pastel Jelly-Clay Squircle Button (exact Figma node 58:3013 specs: ~88px x 68px, radius 25.9px, stroke 1.73px) */}
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                onClick={() => scrollTo(item.id)}
                className={`w-[84px] h-[64px] xl:w-[89px] xl:h-[68px] rounded-[26px] bg-gradient-to-b ${item.gradient} border-[1.73px] ${
                  isActive ? `${item.activeBorder} ring-2 ring-neutral-900/10 scale-105` : item.border
                } ${item.btnShadow} flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200`}
                aria-label={item.label}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[32px] h-[32px] xl:w-[34px] xl:h-[34px] object-contain select-none pointer-events-none opacity-85 transition-transform duration-200 group-hover:scale-110"
                />
              </motion.button>

              {/* Section Label: When active, pops up with matching Figma 58:3013 jelly-clay pill styling! */}
              <div className="flex items-center min-w-[100px]">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.button
                      key="active-filled"
                      initial={{ scale: 0.82, opacity: 0, x: -8 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.85, opacity: 0, x: -6 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                      onClick={() => scrollTo(item.id)}
                      className={`px-4 py-2 rounded-[18px] bg-gradient-to-b ${item.gradient} border-[1.73px] ${item.border} ${item.pillShadow} ${item.textColor} font-display font-bold text-[20px] leading-[24px] tracking-[-0.02em] lowercase cursor-pointer select-none`}
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
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2.5 rounded-full bg-white/92 backdrop-blur-xl border border-neutral-200/80 shadow-[0_12px_36px_rgba(0,0,0,0.14)] max-w-[96vw] overflow-x-auto"
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
