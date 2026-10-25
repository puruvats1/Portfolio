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

  return (
    <header
      style={{ paddingLeft: 'var(--global-margin)', paddingRight: 'var(--global-margin)' }}
      className={`fixed top-0 left-0 right-0 z-50 py-3.5 sm:py-5 transition-all duration-300 pointer-events-none ${
        isDark
          ? 'bg-[#111110]/90 backdrop-blur-md text-white border-b border-neutral-800'
          : 'bg-white/80 backdrop-blur-md text-[#111110]'
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left: Brand Identifier (Matching Figma node 58:2937) */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToTop}
            className="text-left cursor-pointer group flex items-baseline gap-2.5 sm:gap-3 transition-opacity hover:opacity-85"
          >
            {/* puru. - Urbanist Bold, mild grey gradient when in light mode */}
            <span
              className={`font-display text-[21px] sm:text-[24px] font-bold tracking-[-0.02em] leading-none ${
                isDark ? 'text-white' : 'heading-gradient'
              }`}
            >
              puru.
            </span>

            {/* Interaction Design Student @ IDC IIT Bombay - DM Sans Regular */}
            <span
              className={`font-sans text-[11px] sm:text-[13px] leading-[17px] font-normal tracking-normal hidden sm:inline ${
                isDark ? 'text-neutral-400' : 'text-[#8E8E89]'
              }`}
            >
              Interaction Design Student @ IDC IIT Bombay
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {/* Behance Link */}
          <a
            href="https://www.behance.net/puruvats"
            target="_blank"
            rel="noopener noreferrer"
            className={`font-display text-[12px] leading-[17px] font-medium transition-colors cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white' : 'text-[#5A5A55] hover:text-[#2C2C2A]'
            }`}
          >
            Behance
          </a>

          {/* Resume Button: mild black/grey pill */}
          <a
            href="/Puru_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[16px] font-display text-[13px] leading-none font-medium transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
              isDark
                ? 'bg-white text-[#2C2C2A] hover:bg-neutral-200'
                : 'bg-[#2E2E2C] text-white hover:bg-[#3E3E3B]'
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
