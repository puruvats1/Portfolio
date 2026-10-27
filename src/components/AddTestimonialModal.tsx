import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, MessageSquarePlus, Mail, Sparkles, User, Building, Quote } from 'lucide-react';

export interface CustomTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  isCustom: true;
  redacted: boolean;
  createdAt: string;
}

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTestimonial: (t: CustomTestimonial) => void;
}

export function AddTestimonialModal({ isOpen, onClose, onAddTestimonial }: AddTestimonialModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [redacted, setRedacted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedItem, setLastSubmittedItem] = useState<CustomTestimonial | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) return;

    const newTestimonial: CustomTestimonial = {
      id: `testimonial-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || 'Collaborator',
      company: company.trim() || 'Independent',
      quote: quote.trim(),
      isCustom: true,
      redacted,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('puru_user_testimonials') || '[]');
      localStorage.setItem('puru_user_testimonials', JSON.stringify([newTestimonial, ...existing]));
    } catch {
      // Local storage fallback
    }

    onAddTestimonial(newTestimonial);
    setLastSubmittedItem(newTestimonial);
    setSubmitted(true);
  };

  const handleSendEmail = () => {
    if (!lastSubmittedItem) return;
    const subject = encodeURIComponent(`New Testimonial from ${lastSubmittedItem.name}`);
    const body = encodeURIComponent(
      `Hi Puru,\n\nI just left a testimonial for you:\n\n"${lastSubmittedItem.quote}"\n\n— ${lastSubmittedItem.name}\n${lastSubmittedItem.role} @ ${lastSubmittedItem.company}`
    );
    window.location.href = `mailto:hello.puruvats@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setRole('');
    setCompany('');
    setQuote('');
    setRedacted(false);
    setLastSubmittedItem(null);
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white text-ink rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-ink transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {submitted ? (
              /* Success State */
              <div className="py-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={30} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                    Testimonial Added!
                  </h3>
                  <p className="font-sans text-sm text-[#555552] max-w-sm">
                    Your testimonial is now live on this page. Would you also like to send a copy directly to Puru's inbox?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <button
                    onClick={handleSendEmail}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ink text-white font-sans text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <Mail size={16} />
                    <span>Send via Email to Puru</span>
                  </button>
                  <button
                    onClick={handleResetAndClose}
                    className="flex-1 px-5 py-3 rounded-xl bg-neutral-100 text-ink font-sans text-sm font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    View on page
                  </button>
                </div>
              </div>
            ) : (
              /* Testimonial Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                    <MessageSquarePlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink leading-tight">
                      Leave a Testimonial
                    </h3>
                    <p className="font-sans text-xs text-[#777774]">
                      No signup or account required. Share your experience.
                    </p>
                  </div>
                </div>

                {/* Name & Role Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-semibold text-[#444440] flex items-center gap-1">
                      <User size={13} className="text-neutral-400" />
                      <span>Your Name</span> <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Chen"
                      className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-ink placeholder-neutral-400 focus:outline-none focus:border-[#2B7FFF] focus:bg-white transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-semibold text-[#444440] flex items-center gap-1">
                      <Building size={13} className="text-neutral-400" />
                      <span>Role & Company</span>
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Product Designer @ Figma"
                      className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-ink placeholder-neutral-400 focus:outline-none focus:border-[#2B7FFF] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="flex flex-col gap-1">
                  <label className="font-sans text-xs font-semibold text-[#444440] flex items-center gap-1">
                    <Quote size={13} className="text-neutral-400" />
                    <span>Your Testimonial</span> <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="What stood out when working, brainstorming, or building with Puru? Any key strengths or memories..."
                    className="w-full rounded-xl bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 text-sm text-ink placeholder-neutral-400 focus:outline-none focus:border-[#2B7FFF] focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Style Toggle (Real Words vs Redacted Preview) */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                  <div className="flex flex-col">
                    <span className="font-sans text-xs font-semibold text-ink">
                      Redact preview (grey shape teaser)
                    </span>
                    <span className="font-sans text-[11px] text-[#777774]">
                      Turn on if you want it disguised to match the teasers on this page
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={redacted}
                    onChange={(e) => setRedacted(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-[#2B7FFF]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="font-sans text-xs text-[#888884] flex items-center gap-1">
                    <Sparkles size={12} className="text-[#2B7FFF]" />
                    Instant publication
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetAndClose}
                      className="px-4 py-2.5 rounded-xl text-neutral-600 hover:text-ink hover:bg-neutral-100 font-sans text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim() || !quote.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-white hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed font-sans text-sm font-semibold transition-all cursor-pointer shadow-xs"
                    >
                      <span>Submit</span>
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
