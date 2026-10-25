import { ArrowUpRight, Mail, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollRevealTitle } from './ScrollRevealTitle';

export function Contact() {
  return (
    <section
      id="contact"
      className="relative pt-20 pb-32 sm:pb-36 lg:pt-28 lg:pb-32 bg-ink text-canvas rounded-t-[2.5rem] mt-20 sm:mt-24 border-t border-white/10 will-change-transform"
    >
      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-8 md:px-10 lg:px-6 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Columns 4-8: Contact details and footer (5 of 8 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <p className="font-display text-2xl sm:text-3xl font-semibold leading-tight tracking-tight">
                <span className="heading-gradient-light">
                  Got something complicated?
                </span>
              </p>
              <p className="font-display text-lg sm:text-xl font-normal text-neutral-400">
                Let's figure it out together.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-end">
              <div className="flex flex-col gap-1.5">
                <span className="font-display text-xl font-semibold heading-gradient-light">Puru.</span>
                <span className="text-neutral-400 text-sm font-normal">Interaction & Product Designer · IDC, IIT Bombay</span>
                <p className="text-neutral-400 text-sm max-w-sm mt-3 leading-relaxed font-normal">
                  Always eager to discuss complex interaction models, human-computer interfaces, or new design initiatives.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                <motion.a 
                  whileHover={{ y: -2 }}
                  href="mailto:puruvats@iitb.ac.in" 
                  className="flex items-center justify-between gap-3 px-5 py-3.5 bg-white/10 hover:bg-white/15 rounded-xl transition-colors font-medium text-sm text-white"
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
                  className="flex items-center justify-between gap-3 px-5 py-3.5 bg-white/10 hover:bg-white/15 rounded-xl transition-colors font-medium text-sm text-white"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink size={15} />
                    <span>LinkedIn</span>
                  </div>
                  <ArrowUpRight size={15} />
                </motion.a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-normal">
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
    </section>
  );
}
