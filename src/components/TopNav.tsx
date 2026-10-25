import { useState, useEffect } from 'react';
import { FileText, ExternalLink, ArrowUpRight } from 'lucide-react';

export function TopNav() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const rect = contactEl.getBoundingClientRect();
        // When the black contact section scrolls up to the top header area
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
      className={`fixed top-0 left-0 right-0 z-40 px-6 sm:px-10 lg:px-12 py-5 sm:py-6 pointer-events-none transition-colors duration-400 ${
        isDark
          ? 'bg-gradient-to-b from-[#111110] via-[#111110]/95 to-transparent'
          : 'bg-gradient-to-b from-[#F7F7F5] via-[#F7F7F5]/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left branding: puru. */}
        <div className="pointer-events-auto">
          <button
            onClick={scrollToTop}
            className="text-left cursor-pointer group flex items-baseline gap-2 sm:gap-2.5 transition-opacity hover:opacity-80"
          >
            <span
              className={`font-display text-lg sm:text-xl font-bold tracking-tight leading-none transition-all ${
                isDark ? 'heading-gradient-light' : 'heading-gradient'
              }`}
            >
              puru.
            </span>
            <span
              className={`text-xs sm:text-sm font-normal tracking-tight leading-none transition-colors ${
                isDark ? 'text-neutral-400' : 'text-neutral-400'
              }`}
            >
              Interaction Design Student @ IDC IIT Bombay
            </span>
          </button>
        </div>

        {/* Right buttons: Behance (no fill/outline) & Resume (black, shifted to right) */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Behance button: without any fill or outline */}
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'text-neutral-300 hover:text-white'
                : 'text-neutral-600 hover:text-ink'
            }`}
          >
            <ExternalLink size={13} className={isDark ? 'text-neutral-400' : 'text-neutral-500'} />
            <span>Behance</span>
            <ArrowUpRight size={11} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
          </a>

          {/* Resume button: shifted to the far right, black background (bg-ink) */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isDark
                ? 'bg-white text-ink hover:bg-neutral-200'
                : 'bg-ink text-white hover:bg-neutral-800'
            }`}
          >
            <FileText size={13} className={isDark ? 'text-neutral-700' : 'text-neutral-300'} />
            <span>Resume</span>
            <ArrowUpRight size={11} className={isDark ? 'text-neutral-500' : 'text-neutral-400'} />
          </a>
        </div>
      </div>
    </header>
  );
}
