import { useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, Copy, Mail, ExternalLink, FileText, MessageSquareQuote } from 'lucide-react';
import { motion } from 'motion/react';
import { EASE_OUT } from "../lib/motion";
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { Pop, pop } from './ui/Pop';
import { FeedbackModal } from './FeedbackModal';

export function Contact() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copyEmail = async () => {
    const address = 'hello.puruvats@gmail.com';
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // clipboard API unavailable (older browsers / insecure context): fall back to a hidden textarea
      const ta = document.createElement('textarea');
      ta.value = address;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      className="footer-rise relative pt-20 pb-40 sm:pb-40 lg:pt-24 lg:pb-28 bg-ink text-canvas rounded-t-[2.5rem] shadow-[0_240px_0_0_var(--color-ink)] mt-20 sm:mt-24 lg:mt-32 max-lg:mx-[calc((100%-100vw)/2)] border-t border-white/10 scroll-mt-24"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-12 xl:px-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.05 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="relative grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start lg:items-baseline"
        >
          {/* Back to top: top-right corner */}
          <a
            href="#hero"
            className="absolute -top-14 sm:-top-16 right-0 inline-flex items-center gap-1.5 t-meta text-white/55 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </a>

          {/* Columns 1-3: Section title "Work with me" sticky until scrolled past */}
          <div className="lg:col-span-3 lg:pr-6">
            <ScrollRevealTitle>
              <h2 className="font-display t-display heading-gradient-light">
                Work with me
              </h2>
            </ScrollRevealTitle>
          </div>

          {/* Columns 4-8: Minimal Contact details, feedback and footer links */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <Pop>
              <h3 className="font-display t-title heading-gradient-light">
                Got something complicated?
              </h3>
            </Pop>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="font-display t-lead font-semibold heading-gradient-light">Puru.</span>
                <span className="text-white/55 t-meta !font-normal">Interaction & Product Designer · IDC, IIT Bombay</span>
              </div>

              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {/* Email: copies the address to the clipboard */}
                <motion.button
                  {...pop()}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  className="group flex items-center justify-between gap-2.5 px-4 sm:px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors t-ui text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Mail size={15} />
                    <span aria-live="polite">{copied ? 'Copied' : 'Email'}</span>
                  </div>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </motion.button>

                {/* LinkedIn Link */}
                <motion.a 
                  {...pop()}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://www.linkedin.com/in/puruvats" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2.5 px-4 sm:px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors t-ui text-white"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={15} />
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight size={15} className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.a>

                {/* Quick Feedback Button in Actions */}
                <motion.button
                  {...pop()}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsFeedbackOpen(true)}
                  className="flex items-center justify-between gap-2.5 px-4 sm:px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors t-ui text-white cursor-pointer"
                  title="Share quick feedback"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote size={15} />
                    <span>Feedback</span>
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center sm:justify-start gap-4 t-meta !font-normal text-white/55">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 text-neutral-300 hover:underline"
                >
                  <span>Give feedback</span>
                </button>
                <span>·</span>
                <a 
                  href="https://www.behance.net/puruvats" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Behance
                </a>
                <span>·</span>
                <a 
                  href="/Puru_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-white transition-colors"
                >
                  <FileText size={12} />
                  <span>Resume (PDF)</span>
                </a>
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Interactive Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </footer>
  );
}
