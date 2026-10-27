import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, MessageSquare, Mail, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  '✨ Design & Visuals',
  '⚡ Interaction & UX',
  '🐛 Bug / Typo',
  '💭 General Thoughts',
];

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Save to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('puru_feedback') || '[]');
      const newEntry = {
        id: `fb-${Date.now()}`,
        category,
        message: message.trim(),
        name: name.trim() || 'Anonymous',
        email: email.trim() || 'Not provided',
        date: new Date().toISOString(),
      };
      localStorage.setItem('puru_feedback', JSON.stringify([newEntry, ...existing]));
    } catch {
      // Local storage fallback
    }

    setSubmitted(true);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Portfolio Feedback: ${category}`);
    const body = encodeURIComponent(
      `Category: ${category}\nFrom: ${name.trim() || 'Anonymous'} (${email.trim() || 'No email'})\n\nFeedback:\n${message}`
    );
    window.location.href = `mailto:hello.puruvats@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setMessage('');
    setName('');
    setEmail('');
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-[#181816] text-[#F3F3F0] rounded-3xl border border-neutral-700/60 p-6 sm:p-8 shadow-2xl z-10 my-auto overflow-hidden"
          >
            {/* Top Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {submitted ? (
              /* Success State */
              <div className="py-6 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={28} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-xl font-semibold text-white">
                    Thank you for the feedback!
                  </h3>
                  <p className="font-sans text-sm text-neutral-300 max-w-sm">
                    Your note has been recorded. Want to send it directly to Puru's inbox as well?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-3">
                  <button
                    onClick={handleSendEmail}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-ink font-sans text-sm font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <Mail size={16} />
                    <span>Send via Email</span>
                  </button>
                  <button
                    onClick={handleResetAndClose}
                    className="flex-1 px-5 py-3 rounded-xl bg-white/10 text-white font-sans text-sm font-medium hover:bg-white/15 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#58A6FF]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-white leading-tight">
                      Share Feedback
                    </h3>
                    <p className="font-sans text-xs text-neutral-400">
                      No signup needed. Your thoughts help refine every detail.
                    </p>
                  </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-medium text-neutral-300">
                    What are you sharing feedback on?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          category === cat
                            ? 'bg-[#2B7FFF] text-white shadow-xs'
                            : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-medium text-neutral-300">
                    Your Note <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me what you liked, what felt confusing, or any creative suggestions..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2B7FFF] focus:ring-1 focus:ring-[#2B7FFF] transition-all resize-none"
                  />
                </div>

                {/* Optional Sender Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-medium text-neutral-400">
                      Your Name <span className="text-neutral-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#2B7FFF] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-xs font-medium text-neutral-400">
                      Your Email <span className="text-neutral-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#2B7FFF] transition-all"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="font-sans text-xs text-neutral-400 flex items-center gap-1">
                    <Sparkles size={12} className="text-[#2B7FFF]" />
                    Sent directly to Puru
                  </span>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-ink hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed font-sans text-sm font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <span>Submit</span>
                    <Send size={14} />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
