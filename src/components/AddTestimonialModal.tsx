import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, MessageSquarePlus } from 'lucide-react';
import { LIMITS, submitTestimonial } from '../lib/testimonials';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY = 'puru_testimonial_last_submit';

// Shared look, taken from the rest of the site: 12px inputs, 15px body text, soft blue focus ring
const LABEL = 'font-sans text-[14px] font-medium text-[#40403E]';
const INPUT =
  'w-full rounded-[12px] bg-white border border-neutral-200 px-4 py-3 font-sans text-[15px] text-ink placeholder:text-neutral-400 outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#72BDFF] focus:shadow-[0_0_0_4px_#E6F1FE]';
// Primary 3D button (same recipe as the Back button / selected toggle)
const PRIMARY =
  'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[15px] border border-[#B7D9FF]/75 bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] pill-clay-blue font-sans text-[15px] font-bold tracking-[-0.2px] text-[#1D4ED8] cursor-pointer select-none transition-transform duration-200 hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF]';
const QUIET =
  'inline-flex items-center justify-center h-11 px-5 rounded-[15px] font-sans text-[15px] font-medium text-neutral-600 hover:text-ink hover:bg-neutral-100 cursor-pointer select-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neutral-300';

type Status = 'idle' | 'sending' | 'error' | 'done';

function secondsUntilNextAllowed(): number {
  try {
    const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    return Math.max(0, Math.ceil((last + COOLDOWN_MS - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

export function AddTestimonialModal({ isOpen, onClose }: AddTestimonialModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [company, setCompany] = useState('');
  const [honeypot, setHoneypot] = useState(''); // real people never see or fill this
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim() || status === 'sending') return;

    // Bots fill hidden fields: pretend it worked, send nothing.
    if (honeypot) {
      setStatus('done');
      return;
    }

    const wait = secondsUntilNextAllowed();
    if (wait > 0) {
      setErrorMsg(`You just sent one. Please wait ${wait}s before sending another.`);
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      await submitTestimonial({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        quote: quote.trim(),
      });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        // ignore
      }
      setStatus('done');
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message === 'not-configured'
          ? 'Testimonials aren’t connected yet. Please try again later.'
          : 'Couldn’t send that. Check your connection and try again.',
      );
      setStatus('error');
    }
  };

  const handleResetAndClose = () => {
    setStatus('idle');
    setErrorMsg('');
    setName('');
    setRole('');
    setQuote('');
    setCompany('');
    setHoneypot('');
    onClose();
  };

  const sending = status === 'sending';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Leave a testimonial"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[520px] bg-white text-ink rounded-[26px] border border-neutral-200/70 p-6 sm:p-9 shadow-[0_20.6px_33.4px_rgba(0,0,0,0.07),0_4.1px_6.7px_rgba(0,0,0,0.04)] z-10 my-auto overflow-hidden"
          >
            {/* Close: same grey circle as the hero cards */}
            <button
              type="button"
              onClick={handleResetAndClose}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[#D9D9D9] hover:bg-[#CCCCCC] flex items-center justify-center text-[#555555] hover:text-[#222222] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF]"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2.4} />
            </button>

            {status === 'done' ? (
              /* Success State */
              <div className="py-4 flex flex-col items-center text-center gap-5" role="status">
                <div className="w-14 h-14 rounded-[18px] border border-[#6EE7B7]/60 bg-gradient-to-b from-[#E6FBF1] to-[#BDEFD6] btn-clay-mint flex items-center justify-center text-[#1C9A72]">
                  <Check size={26} strokeWidth={2.4} />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-[#30302D]">
                    Thank you!
                  </h3>
                  <p className="font-sans text-[15px] text-[#555552] leading-[1.6] max-w-sm">
                    Puru reads every testimonial before it goes live, so yours will show up on this page once it's been approved.
                  </p>
                </div>

                <button type="button" onClick={handleResetAndClose} className={`${PRIMARY} mt-2`}>
                  Done
                </button>
              </div>
            ) : (
              /* Testimonial Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex items-center gap-4 pr-10">
                  <div className="w-12 h-12 shrink-0 rounded-[15px] border border-[#B7D9FF]/75 bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] btn-clay-blue flex items-center justify-center text-[#3F74E3]">
                    <MessageSquarePlus size={22} strokeWidth={1.9} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-[#30302D]">
                      Leave a testimonial
                    </h3>
                    <p className="font-sans text-[15px] text-[#60605D] leading-snug">
                      No signup needed. Share your experience.
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="t-name" className={LABEL}>
                    Your name <span className="text-[#2B7FFF]">*</span>
                  </label>
                  <input
                    id="t-name"
                    required
                    type="text"
                    maxLength={LIMITS.name}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className={INPUT}
                  />
                </div>

                {/* Role & Company Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="t-role" className={LABEL}>
                      Role
                    </label>
                    <input
                      id="t-role"
                      type="text"
                      maxLength={LIMITS.role}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Product Designer"
                      className={INPUT}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="t-company" className={LABEL}>
                      Company
                    </label>
                    <input
                      id="t-company"
                      type="text"
                      maxLength={LIMITS.company}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Figma"
                      className={INPUT}
                    />
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="t-quote" className={LABEL}>
                    Your testimonial <span className="text-[#2B7FFF]">*</span>
                  </label>
                  <textarea
                    id="t-quote"
                    required
                    rows={4}
                    maxLength={LIMITS.quote}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="What stood out when working or building with Puru?"
                    className={`${INPUT} resize-none leading-[1.6]`}
                  />
                  <span className="self-end font-sans text-[12px] text-[#9B9B96]">
                    {quote.length}/{LIMITS.quote}
                  </span>
                </div>

                {/* Spam trap: hidden from people and assistive tech, bots fill it */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                {status === 'error' && (
                  <p role="alert" className="font-sans text-[14px] text-[#BE123C] leading-snug -mt-2">
                    {errorMsg}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-sans text-[13px] text-[#8E8E89]">Shown after Puru approves it</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleResetAndClose} className={QUIET}>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim() || !quote.trim() || sending}
                      className={PRIMARY}
                    >
                      {sending ? 'Sending…' : 'Submit'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
