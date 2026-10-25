import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type SectionId = 'hero' | 'work' | 'about' | 'working-with-me' | 'testimonials' | 'contact';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  gradient: string;
  border: string;
  textColor: string;
  activeBorder: string;
  isBadge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'hero',
    label: 'hello!!',
    icon: './waving_hand.svg',
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]',
    activeBorder: 'border-[#EAB308]',
    textColor: 'text-[#92400E]',
  },
  {
    id: 'work',
    label: 'work',
    icon: './work_icon.svg',
    gradient: 'from-[#E6F1FE] to-[#72BDFF]',
    border: 'border-[#93C5FD]',
    activeBorder: 'border-[#2563EB]',
    textColor: 'text-[#1D4ED8]',
  },
  {
    id: 'about',
    label: 'about',
    icon: './about_icon.svg',
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]',
    activeBorder: 'border-[#EA580C]',
    textColor: 'text-[#C2410C]',
  },
  {
    id: 'working-with-me',
    label: '<skills>',
    icon: './skills_icon.svg',
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]',
    activeBorder: 'border-[#65A30D]',
    textColor: 'text-[#4D7C0F]',
    isBadge: true,
  },
  {
    id: 'testimonials',
    label: 't’monials',
    icon: './testimonials_icon.svg',
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]',
    activeBorder: 'border-[#059669]',
    textColor: 'text-[#047857]',
  },
  {
    id: 'contact',
    label: 'contact',
    icon: './contact_icon.svg',
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]',
    activeBorder: 'border-[#E11D48]',
    textColor: 'text-[#BE123C]',
  },
];

export function LeftSidebar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrolledPastHero(scrollPos > 320);

      const sections = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: 0, bottom: 0 };
        const rect = el.getBoundingClientRect();
        return {
          id: item.id,
          top: rect.top,
          bottom: rect.bottom,
        };
      });

      const current = sections.find((s) => s.top <= 250 && s.bottom >= 150);
      if (current) {
        setActiveSection(current.id);
      } else if (scrollPos < 200) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: SectionId) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Persistent Floating Tactile Dock on the Left */}
      <AnimatePresence>
        {scrolledPastHero && (
          <motion.aside
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="hidden lg:flex fixed left-6 xl:left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 py-3 px-2 rounded-[28px] bg-white/70 backdrop-blur-md border border-neutral-200/60 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            aria-label="Tactile Navigation Dock"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const isHovered = hoveredId === item.id;

              return (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Tactile Pill */}
                  <motion.button
                    whileHover={{ scale: 1.12, x: 3 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => scrollTo(item.id)}
                    className={`w-[54px] h-[44px] rounded-[18px] bg-gradient-to-b ${item.gradient} border-[1.5px] ${
                      isActive ? `${item.activeBorder} ring-2 ring-blue-400/30 scale-105` : item.border
                    } clay-tab-shadow flex items-center justify-center cursor-pointer transition-all duration-200 relative group`}
                    aria-label={item.label}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-5 h-5 object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-110"
                    />

                    {/* Active Pip indicator */}
                    {isActive && (
                      <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3.5 rounded-full bg-[#111110]" />
                    )}
                  </motion.button>

                  {/* Popout Label on Hover or when Active */}
                  <AnimatePresence>
                    {(isHovered || (isActive && !hoveredId)) && (
                      <motion.div
                        initial={{ opacity: 0, x: -8, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -8, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                        className="absolute left-[66px] whitespace-nowrap pointer-events-none z-50"
                      >
                        {item.isBadge ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-[10px] bg-gradient-to-b from-[#EDFA7E] to-[#D5F24B] border border-[#BEF264] text-[15px] font-bold font-display tracking-tight text-[#4D7C0F] shadow-sm">
                            {item.label}
                          </span>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-[12px] bg-white/95 backdrop-blur-sm border border-neutral-200/80 shadow-sm font-display text-[15px] font-bold tracking-tight lowercase ${item.textColor}`}
                          >
                            {item.label}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile & Tablet Floating Bottom Pill Dock */}
      <nav
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-2 rounded-full bg-white/85 backdrop-blur-lg border border-neutral-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-w-[95vw] overflow-x-auto"
        aria-label="Mobile Navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => scrollTo(item.id)}
              className={`w-11 h-9 rounded-[14px] bg-gradient-to-b ${item.gradient} border-[1.5px] ${
                isActive ? `${item.activeBorder} ring-2 ring-neutral-800/30` : item.border
              } clay-tab-shadow flex items-center justify-center shrink-0 cursor-pointer`}
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-4 h-4 object-contain select-none pointer-events-none"
              />
            </motion.button>
          );
        })}
      </nav>
    </>
  );
}
