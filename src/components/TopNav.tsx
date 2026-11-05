import { useState, useEffect, useRef } from 'react';

export function TopNav({ hideOnScroll = false, onHome }: { hideOnScroll?: boolean; onHome?: () => void }) {
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      setScrolled(y > 12);

      if (hideOnScroll) {
        // Project pages: out of the way as soon as you start reading
        setHidden(y > 40);
      } else if (y <= 80) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true); // scrolling down: get out of the way
      } else if (delta < -6) {
        setHidden(false); // scrolling up: bring it back
      }
      if (Math.abs(delta) > 6) lastY.current = y;

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
  }, [hideOnScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      inert={hidden}
      style={{ paddingLeft: 'var(--global-margin)', paddingRight: 'var(--global-margin)' }}
      className={`fixed top-0 left-0 right-0 z-50 pt-5 pb-3.5 sm:pt-7 sm:pb-4 pointer-events-none transition-[translate,opacity,background-color,backdrop-filter] duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        // soft exit: a short drift upwards while fading, instead of a full slide off-screen
        hidden ? '-translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
      } ${
        isDark
          ? `text-white ${scrolled ? 'bg-[#111110]/80 backdrop-blur-xl' : ''}`
          : `text-[#111110] ${scrolled ? 'bg-white/75 backdrop-blur-xl' : ''}`
      }`}
    >
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left: Brand Identifier (Matching Figma node 58:2937) */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={onHome ?? scrollToTop}
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

            {/* Interaction Design Student @ IDC IIT Bombay - same size as body text */}
            <span
              className={`font-sans text-[15px] sm:text-[15.5px] leading-[1.4] font-normal tracking-normal hidden md:inline ${
                isDark ? 'text-neutral-400' : 'text-[#8E8E89]'
              }`}
            >
              Interaction Design Student @ IDC IIT Bombay
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          {/* Behance Link: underline draws in from left to right on hover */}
          <a
            href="https://www.behance.net/puruvats"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative font-sans text-[15px] sm:text-[15.5px] leading-[1.4] font-medium transition-colors duration-200 cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white' : 'text-[#5A5A55] hover:text-[#2C2C2A]'
            }`}
          >
            Behance
            <span
              aria-hidden
              className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </a>

          {/* Resume Button: a shine sweeps across on hover and the arrow hands off to a fresh one */}
          <a
            href="/Puru_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-[12px] font-sans text-[15px] sm:text-[15.5px] leading-none font-medium cursor-pointer shadow-xs active:scale-95 transition-transform duration-150 ${
              isDark ? 'bg-white text-[#2C2C2A]' : 'bg-[#2E2E2C] text-white'
            }`}
          >
            {/* Shine: sits off the left edge, glides to the right inside the button; snaps back unseen */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 left-0 w-2/5 -skew-x-[18deg] -translate-x-[160%] transition-none group-hover:translate-x-[330%] group-hover:transition-transform group-hover:duration-[1100ms] group-hover:ease-out ${
                isDark
                  ? 'bg-gradient-to-r from-transparent via-[#2C2C2A]/8 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-white/14 to-transparent'
              }`}
            />
            <span className="relative">Resume</span>
            {/* Arrow swap: current arrow exits top-right, a new one enters from the bottom-left */}
            <span aria-hidden className="relative block w-3.5 h-3.5 overflow-hidden">
              <img
                src="./resume_arrow.svg"
                alt=""
                className={`absolute inset-0 w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full group-hover:-translate-y-full ${
                  isDark ? 'invert' : ''
                }`}
              />
              <img
                src="./resume_arrow.svg"
                alt=""
                className={`absolute inset-0 w-3.5 h-3.5 -translate-x-full translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0 ${
                  isDark ? 'invert' : ''
                }`}
              />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
