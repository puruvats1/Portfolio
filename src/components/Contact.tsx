import { ArrowUpRight, Mail, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

export function Contact() {
  return (
    <footer
      id="contact"
      className="relative pt-16 pb-28 sm:pb-32 lg:pt-20 lg:pb-28 bg-ink text-canvas rounded-t-[2.5rem] mt-20 sm:mt-24 border-t border-white/10 will-change-transform scroll-mt-24"
    >
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-8 gap-8 lg:gap-10 xl:gap-12 items-start"
        >
          {/* Columns 1-3: Section title "Work with me" sticky until scrolled past */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 self-start">
            <ScrollRevealTitle>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight heading-gradient-light">
                Work with me
              </h2>
            </ScrollRevealTitle>
          </div>

          {/* Columns 4-8: Minimal Contact details and footer links (paragraphs removed) */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight heading-gradient-light">
                Got something complicated?
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-1">
                <span className="font-display text-xl font-semibold heading-gradient-light">Puru.</span>
                <span className="text-neutral-400 text-sm font-normal">Interaction & Product Designer · IDC, IIT Bombay</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <motion.a 
                  whileHover={{ y: -2 }}
                  href="mailto:puruvats@iitb.ac.in" 
                  className="flex items-center justify-between gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors font-medium text-sm text-white"
                >
                  <div className="flex items-center gap-2">
                    <Mail size={15} />
                    <span>Email</span>
                  </div>
                  <ArrowUpRight size={15} />
                </motion.a>

                <motion.a 
                  whileHover={{ y: -2 }}
                  href="https://www.linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors font-medium text-sm text-white"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={15} />
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight size={15} />
                </motion.a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-normal">
              <span>© 2026 Puru. Crafted with tactile care.</span>
              <div className="flex items-center gap-4">
                <a 
                  href="#hero" 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Back to top ↑
                </a>
                <span>·</span>
                <a 
                  href="https://www.behance.net" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Behance
                </a>
                <span>·</span>
                <a 
                  href="#"
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
    </footer>
  );
}
