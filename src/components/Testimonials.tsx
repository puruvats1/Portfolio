import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { pop } from './ui/Pop';
import { Quote, ArrowUpRight, Building2 } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { GreyWords } from './ui/GreyWords';
import { ApprovedTestimonial, fetchApprovedTestimonials } from '../lib/testimonials';
import { TESTIMONIAL_FORM_URL } from '../config';
import { companyDomains, faviconUrl, logoScale, MIN_LOGO_PX } from '../lib/companyLogo';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Siddharth R.',
    role: 'Senior Product Designer',
    company: 'D. E. Shaw & Co.',
    quote:
      'Puru has an uncanny talent for taking hyper-dense financial dashboards and cutting right to the core interaction model. His engineering literacy meant he never designed in a vacuum—engineers loved his specs and interactive demos.',
  },
  {
    id: '2',
    name: 'Prof. Ananya Sen',
    role: 'Interaction Design Faculty',
    company: 'IDC, IIT Bombay',
    quote:
      'Puru approaches interaction problems with deep intellectual curiosity. He refuses to settle for superficial UI polish; he interrogates the underlying human mental models and emerges with genuinely novel solutions.',
  },
  {
    id: '3',
    name: 'Kabir Verma',
    role: 'Full-Stack Lead',
    company: 'Akai Space',
    quote:
      'Designing with Puru felt fast and effortless. His prototypes accounted for edge cases, asynchronous latency, and keyboard accessibility before we even brought them up. He elevates the standard of the entire room.',
  },
];

/** Cards rise in once as they scroll into view; the right column trails the left (same as the Work grid). */
const rise = (i: number) => pop((i % 2) * 0.08);

/**
 * Card language shared with the rest of the site: the clay speech-card surface of the hero card,
 * a clay quote badge and clay initials in the nav's pastel palette (one colour per card, in turn),
 * and the same tag pill the project cards use.
 */
const CARD =
  'clay-dialogue-card border border-[#EBEBE8] rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between gap-7 sm:gap-8';

const CLAY = [
  { skin: 'from-[#FFF9CE] to-[#FEEA80] border-[#F7DF59]/75 btn-clay-yellow', ink: 'text-[#9D6E2F]', text: 'from-[#8B5E2B] to-[#713F12]' },
  { skin: 'from-[#E6F1FE] to-[#72BDFF] border-[#B7D9FF]/75 btn-clay-blue', ink: 'text-[#3F74E3]', text: 'from-[#1D4ED8] to-[#1E3A8A]' },
  { skin: 'from-[#FFE9DC] to-[#FED2BE] border-[#FDBA74]/75 btn-clay-peach', ink: 'text-[#D8693B]', text: 'from-[#C2410C] to-[#9A3412]' },
  { skin: 'from-[#D7F8E8] to-[#B2F2D1] border-[#6EE7B7]/75 btn-clay-mint', ink: 'text-[#1C9A72]', text: 'from-[#047857] to-[#064E3B]' },
  { skin: 'from-[#FFE3EA] to-[#FFC3D1] border-[#FDA4AF]/75 btn-clay-pink', ink: 'text-[#D4375F]', text: 'from-[#BE123C] to-[#881337]' },
  { skin: 'from-[#EDFA7E] to-[#D5F24B] border-[#BEF264]/75 btn-clay-lime', ink: 'text-[#6E9A1F]', text: 'from-[#3F6212] to-[#294109]' },
];

/**
 * The company's logo, looked up from the name (see lib/companyLogo.ts). A found logo stands on its own,
 * flat, with no container or fill. While it loads, or when no logo can be found, a building icon in a
 * clay tile (the card's colour) is shown instead.
 */
function CompanyBadge({ company, clay }: { company: string; clay: (typeof CLAY)[number] }) {
  const domains = companyDomains(company);
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const domain = domains[attempt];

  return (
    <span
      role="img"
      aria-label={`Company: ${company}`}
      title={company}
      className={`relative w-10 h-10 flex items-center justify-center shrink-0 ${
        loaded ? '' : `rounded-[13px] border bg-gradient-to-b overflow-hidden ${clay.skin}`
      }`}
    >
      {!loaded && <Building2 size={18} strokeWidth={2} aria-hidden="true" className={clay.ink} />}
      {domain && (
        <img
          key={domain}
          src={faviconUrl(domain)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          referrerPolicy="no-referrer"
          draggable={false}
          style={{ scale: logoScale(domain) }}
          onLoad={(e) => {
            // the service answers "not found" with a 16px placeholder picture; only a real logo is wider
            if (e.currentTarget.naturalWidth > MIN_LOGO_PX) setLoaded(true);
            else setAttempt((n) => n + 1); // try the next guess, or fall back to the building icon
          }}
          onError={() => setAttempt((n) => n + 1)}
          className={`absolute inset-0 w-full h-full object-contain select-none mix-blend-multiply transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Small clay squircle holding a quote mark, like the nav buttons. */
function QuoteBadge({ clay }: { clay?: (typeof CLAY)[number] }) {
  return (
    <span
      aria-hidden="true"
      className={`w-11 h-9 rounded-[13px] border bg-gradient-to-b flex items-center justify-center shrink-0 ${
        clay ? clay.skin : 'from-[#F7F6F3] to-[#ECEBE7] border-[#E4E3DF]'
      }`}
    >
      <Quote size={17} strokeWidth={2.4} className={clay ? clay.ink : 'text-[#B9B8B3]'} fill="currentColor" />
    </span>
  );
}

export function Testimonials() {
  // Only testimonials Puru has approved (published from the Google Sheet) are shown.
  const [approved, setApproved] = useState<ApprovedTestimonial[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchApprovedTestimonials(controller.signal).then(setApproved);
    return () => controller.abort();
  }, []);

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-28 overflow-visible scroll-mt-24">
      <div className="w-full">
        
        {/* Title area with 'Leave a testimonial' button */}
        <div className="mb-8 sm:mb-10 lg:mb-12 flex flex-row items-center justify-between gap-3 sm:gap-4">
          <ScrollRevealTitle>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight tracking-tight heading-gradient">
              About me from others
            </h2>
          </ScrollRevealTitle>

          {/* Tertiary action: plain text link (same family as the nav's Behance link), opens the Google Form */}
          <a
            href={TESTIMONIAL_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 whitespace-nowrap inline-flex items-center gap-1 h-[40px] rounded-[10px] font-sans text-[14px] sm:text-[15px] font-medium text-ink-muted hover:text-ink-strong active:scale-[0.97] transition-[color,scale] duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <span className="relative">
              Leave a testimonial
              <span
                aria-hidden
                className="absolute left-0 -bottom-0.5 h-px w-full bg-current origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </span>
            <ArrowUpRight
              size={15}
              strokeWidth={2.2}
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>

        {/* Testimonial cards grid: Custom submissions + 4 core cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-10 lg:gap-12">
          {/* Community testimonials (approved by Puru) */}
          {approved.map((t, i) => {
            const clay = CLAY[i % CLAY.length];
            return (
              <motion.figure key={t.id} {...rise(i)} className={CARD}>
                <div className="flex flex-col gap-5">
                  <QuoteBadge clay={clay} />
                  {/* the site's body text (same as About); line breaks from the submission are kept */}
                  <blockquote className="font-sans text-[15px] sm:text-[15.5px] text-[#40403E] leading-[1.68] font-normal whitespace-pre-line">
                    “{t.quote}”
                  </blockquote>
                </div>

                <figcaption className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className={`w-11 h-11 rounded-[15px] border bg-gradient-to-b flex items-center justify-center shrink-0 ${clay.skin}`}
                    >
                      <span className={`font-sans font-bold text-[14px] tracking-[-0.2px] bg-gradient-to-b ${clay.text} bg-clip-text text-transparent`}>
                        {initials(t.name)}
                      </span>
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-display text-[15.5px] font-semibold leading-tight text-ink truncate">{t.name}</span>
                      {t.role && <span className="font-sans text-[13px] leading-tight text-ink-subtle truncate">{t.role}</span>}
                    </div>
                  </div>

                  {t.company && <CompanyBadge company={t.company} clay={clay} />}
                </figcaption>
              </motion.figure>
            );
          })}

          {/* Core 4 Testimonials */}
          {TESTIMONIALS.map((t, j) => {
            const i = approved.length + j;
            return (
              // Not yet public: the same card, with the words shown as soft clay bars
              <motion.div key={t.id} {...rise(i)} className={CARD} aria-hidden="true">
                <div className="flex flex-col gap-5">
                  <QuoteBadge />
                  <GreyWords text={t.quote} height="h-3.5" roundness="rounded-full" color="bg-[#E9E8E4]" />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-11 h-11 rounded-[15px] border border-[#E4E3DF] bg-gradient-to-b from-[#F7F6F3] to-[#ECEBE7] shrink-0" />
                    <div className="flex flex-col gap-1.5">
                      <GreyWords text={t.name} height="h-3.5" roundness="rounded-full" color="bg-[#E2E1DD]" />
                      <GreyWords text={t.role} height="h-2.5" roundness="rounded-full" color="bg-[#ECEBE7]" />
                    </div>
                  </div>
                  <span className="w-10 h-10 rounded-[13px] border border-[#E4E3DF] bg-gradient-to-b from-[#F7F6F3] to-[#ECEBE7] flex items-center justify-center shrink-0">
                    <Building2 size={18} strokeWidth={2} aria-hidden="true" className="text-[#B9B8B3]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
