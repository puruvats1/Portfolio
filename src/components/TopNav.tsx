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
      className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 lg:px-14 py-5 transition-all duration-300 pointer-events-none ${
        isDark
          ? 'bg-[#111110]/90 backdrop-blur-md text-white border-b border-neutral-800'
          : 'bg-white/80 backdrop-blur-md text-[#111110]'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left: Brand Identifier */}
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <button
            onClick={scrollToTop}
            className="text-left cursor-pointer group flex items-baseline gap-2.5 sm:gap-3 transition-opacity hover:opacity-85"
          >
            <span
              className={`font-display text-2xl sm:text-[28px] font-bold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-[#111110]'
              }`}
            >
              puru.
            </span>
            <span
              className={`text-xs sm:text-[15px] font-normal tracking-normal leading-none hidden sm:inline ${
                isDark ? 'text-neutral-400' : 'text-[#A3A3A3]'
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
            className={`font-display text-sm sm:text-[15px] font-medium transition-colors cursor-pointer ${
              isDark ? 'text-neutral-300 hover:text-white' : 'text-[#525252] hover:text-[#111110]'
            }`}
          >
            Behance
          </a>

          {/* Resume Button: Primary solid black */}
          <a
            href="#contact"
            onClick={scrollToContact}
            className={`group inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[15px] text-sm sm:text-[14.5px] font-medium font-display transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
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
