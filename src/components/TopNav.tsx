import { useState, useEffect, useRef } from 'react';

/** Brand marks (simple-icons, 24x24), drawn in the link's text colour. */
const GITHUB_PATH =
  'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12';
const BEHANCE_PATH =
  'M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z';

/**
 * Icon sizes (px, desktop / phone) are tuned per mark so the two look the same size: the GitHub mark is a
 * full circle filling its box, while the Behance "Bē" only fills about two thirds of its box's height.
 */
const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/puruvats1', path: GITHUB_PATH, size: 19, sizePhone: 21 },
  { label: 'Behance', href: 'https://www.behance.net/puruvats', path: BEHANCE_PATH, size: 23, sizePhone: 25 },
];

/**
 * Tertiary link: brand icon + label in the quiet text colour. On hover the colour deepens and an underline
 * draws in under the label. Phones show the icon alone (the label stays for screen readers).
 */
function SocialLink({
  label,
  href,
  path,
  size,
  sizePhone,
  isDark,
}: {
  label: string;
  href: string;
  path: string;
  size: number;
  sizePhone: number;
  isDark: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
      className={`group inline-flex items-center h-10 font-sans t-ui transition-colors duration-200 cursor-pointer rounded-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 ${
        isDark ? 'text-neutral-300 hover:text-white' : 'text-ink-muted hover:text-ink-strong'
      }`}
    >
      {/* icon + label share one underline, which draws in under both on hover */}
      <span className="relative inline-flex items-center gap-2 pb-1">
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          style={{ ['--icon' as string]: `${sizePhone}px`, ['--icon-sm' as string]: `${size}px` } as React.CSSProperties}
          className="w-[var(--icon)] h-[var(--icon)] sm:w-[var(--icon-sm)] sm:h-[var(--icon-sm)] shrink-0 fill-current"
        >
          <path d={path} />
        </svg>
        <span className="hidden sm:inline">{label}</span>
        <span
          aria-hidden
          className="absolute left-0 bottom-0 h-px w-full bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
    </a>
  );
}

export function TopNav({ hideOnScroll = false, onHome }: { hideOnScroll?: boolean; onHome?: () => void }) {
  const [isDark, setIsDark] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoHop, setLogoHop] = useState<'a' | 'b' | null>(null);
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
      className={`site-header fixed top-0 left-0 right-0 z-50 pt-5 pb-3.5 sm:pt-7 sm:pb-4 pointer-events-none transition-[translate,opacity,background-color,backdrop-filter] duration-[400ms] ease-out ${
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
            // the letter hop starts when the mouse enters and always plays through (see .logo-wave in index.css)
            data-hop={logoHop ?? undefined}
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setLogoHop((h) => (h === 'a' ? 'b' : 'a'));
            }}
            className="logo-wave text-left cursor-pointer group flex items-baseline gap-2.5 sm:gap-3 transition-opacity hover:opacity-85"
          >
            {/* puru. - Urbanist Bold, mild grey gradient when in light mode */}
            <span aria-label="puru." className="font-display text-[21px] sm:text-[24px] font-bold tracking-[-0.02em] leading-none">
              {/* each letter carries its own gradient so it can hop independently */}
              {'puru.'.split('').map((ch, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`logo-char ${isDark ? 'text-white' : 'heading-gradient'}`}
                  style={{ display: 'inline-block', ['--i' as string]: i } as React.CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>

            {/* Interaction Design @ IDC IIT Bombay - same size as body text */}
            <span
              className={`font-sans t-ui !font-normal hidden md:inline ${
                isDark ? 'text-neutral-400' : 'text-ink-subtle'
              }`}
            >
              Interaction Design @ IDC IIT Bombay
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-5 sm:gap-9">
          {/* Tertiary links (GitHub, Behance): icon + label, underline draws in under the label on hover */}
          {SOCIAL_LINKS.map((link) => (
            <SocialLink key={link.label} {...link} isDark={isDark} />
          ))}

          {/* Resume Button: a shine sweeps across on hover and the arrow hands off to a fresh one */}
          <a
            href="/Puru_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-[12px] font-sans t-ui !leading-none cursor-pointer shadow-xs active:scale-95 transition-transform duration-150 ${
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
                className={`absolute inset-0 w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-full group-hover:-translate-y-full ${
                  isDark ? 'invert' : ''
                }`}
              />
              <img
                src="./resume_arrow.svg"
                alt=""
                className={`absolute inset-0 w-3.5 h-3.5 -translate-x-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 ${
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
