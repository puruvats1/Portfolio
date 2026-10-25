import { useState, useEffect } from 'react';

export function TopNav() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // When the dark contact section scrolls up to the top header area
        setIsDark(rect.top <= 75);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 lg:px-14 py-5 transition-all duration-300 pointer-events-none ${
        isDark
          ? 'bg-[#111110]/90 backdrop-blur-md text-white border-b border-neutral-800'
          : 'bg-white/80 backdrop-blur-md text-[#111110]'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left: Brand Identifier (Matching Figma node 58:2937) */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToTop}
            className="text-left cursor-pointer group flex items-baseline gap-2.5 sm:gap-3 transition-opacity hover:opacity-85"
          >
            {/* puru. - Urbanist Bold 29.54px */}
            <span
              className={`font-display text-[26px] sm:text-[29.5px] font-bold tracking-[-0.02em] leading-none ${
                isDark ? 'text-white' : 'text-[#111110]'
              }`}
            >
              puru.
            </span>

            {/* Interaction Design Student @ IDC IIT Bombay - DM Sans Regular 16px / 19.69px */}
            <span
              className={`font-sans text-[13px] sm:text-[16px] leading-[19.7px] font-normal tracking-normal hidden sm:inline ${
                isDark ? 'text-neutral-400' : 'text-[#A3A3A3]'
              }`}
            >
              Interaction Design Student @ IDC IIT Bombay
            </span>
          </button>
        </div>

        {/* Right: Actions (Matching Figma node 58:2940) */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {/* Behance Link - Urbanist Medium 14.77px / 19.69px */}
          <a
            href="https://www.behance.net/puruvats"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-display text-[14.8px] leading-[19.7px] font-medium transition-colors cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white' : 'text-[#525252] hover:text-[#111110]'
            }`}
          >
            Behance
          </a>

          {/* Resume Button: Primary solid black - Urbanist Medium 14.77px / 19.69px, radius 14.77px */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[15px] font-display text-[14.8px] leading-[19.7px] font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isDark
                ? 'bg-white text-[#111110] hover:bg-neutral-200'
                : 'bg-[#111110] text-white hover:bg-neutral-800'
            }`}
          >
            <span>Resume</span>
            <img
              src="./resume_arrow.svg"
              alt=""
              className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                isDark ? 'invert' : ''
              }`}
            />
          </a>
        </div>
      </div>
    </header>
  );
}
