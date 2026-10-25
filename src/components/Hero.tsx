import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Code2, Compass, Sparkles } from 'lucide-react';

export function Hero() {
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Icons taking up the left side's top half space on the profile card
  const profileLeftIcons = [
    { id: 'design', label: 'Design', icon: PenTool },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'art', label: 'Art', icon: Sparkles },
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* CENTER NARRATIVE & DIALOGUE CARD (Cols 1-7 on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex flex-col gap-7 sm:gap-8 max-w-2xl">
              
              {/* Clay Dialogue Card */}
              <AnimatePresence mode="wait">
                {isDialogueOpen ? (
                  <motion.div
                    key="dialogue"
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="clay-dialogue-card border border-[#EDEDED] rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 relative overflow-hidden"
                  >
                    {/* Top line with close circle button */}
                    <div className="flex items-center justify-end pb-3 sm:pb-4 mb-2">
                      <button
                        onClick={() => setIsDialogueOpen(false)}
                        className="w-7 h-7 rounded-full bg-[#D9D9D9] hover:bg-[#C8C8C8] flex items-center justify-center transition-colors cursor-pointer group shadow-xs"
                        aria-label="Close dialog"
                        title="Dismiss card"
                      >
                        <img
                          src="./close_icon.svg"
                          alt="Close"
                          className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    <div className="h-[1px] w-full bg-[#EAEAEA] mb-6 -mt-2" />

                    {/* Dialogue Main Statement */}
                    <p className="font-sans text-[22px] sm:text-[28px] lg:text-[31px] font-medium sm:font-semibold leading-[1.28] tracking-tight text-[#2B2B2A]">
                      I’m Puru and I resolve conflict between humans & computers so that they can be{' '}
                      <span className="text-[#468FFD] font-bold">best friends.</span>
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed-state"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={() => setIsDialogueOpen(true)}
                      className="px-4 py-2.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs sm:text-sm font-medium text-neutral-600 hover:text-ink hover:border-neutral-300 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>💬 Show message: "I resolve conflict between humans & computers..."</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Narrative Subtitle & Previous Experience */}
              <div className="flex flex-col gap-6 pl-1 sm:pl-2">
                <p className="font-sans text-[15.5px] sm:text-[16.5px] text-[#525252] leading-relaxed max-w-xl font-normal">
                  B.Des '27 student at IDC, IIT Bombay. I’m drawn to challenging challenges ;) Always growing as an individual and as a professional.
                </p>

                {/* Previously At Logos */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                  <span className="font-sans text-[12.5px] font-medium text-[#A3A3A3] shrink-0 uppercase sm:normal-case tracking-wider sm:tracking-normal">
                    Previously at
                  </span>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-7">
                    {/* D. E. Shaw Logo */}
                    <div className="h-7 flex items-center hover:opacity-100 opacity-85 transition-opacity" title="D. E. Shaw & Co.">
                      <img
                        src="./deshaw_logo.svg"
                        alt="D. E. Shaw & Co."
                        className="h-5 sm:h-5.5 w-auto object-contain"
                      />
                    </div>

                    {/* GE3S Sustainability Logo */}
                    <div className="h-7 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="GE3S Sustainability Corp">
                      <img
                        src="./ge3s_logo.png"
                        alt="GE3S"
                        className="h-6 sm:h-6.5 w-auto object-contain"
                      />
                    </div>

                    {/* Akai Space Logo */}
                    <div className="h-7 flex items-center hover:opacity-100 opacity-90 transition-opacity" title="AKAISPACE">
                      <img
                        src="./logo2.png"
                        alt="AKAISPACE"
                        className="h-4.5 sm:h-5 w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: The 3D Profile Card with Left Icons, Avatar, & Big Running Animation at Bottom */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center pt-4 lg:pt-0">
            <div className="flex flex-col items-center lg:items-end gap-4 w-full sm:w-auto">
              
              {/* Profile Card */}
              <motion.div
                whileHover={{ rotate: 0, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-full max-w-[340px] sm:w-[325px] xl:w-[345px] h-[410px] clay-binder-card border border-[#EBEBEB] rounded-[32px] relative overflow-hidden flex flex-col justify-between -rotate-[2deg] hover:rotate-0 transition-transform duration-300 mx-auto select-none shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
              >
                {/* 1. TOP-HALF LEFT END ICONS: Design, Code, Research, Art */}
                <div
                  className="absolute left-3.5 sm:left-4 top-4 flex flex-col gap-2.5 z-20"
                  aria-label="Capabilities: Design, Code, Research, Art"
                >
                  {profileLeftIcons.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.id}
                        title={item.label}
                        className="w-[38px] h-[46px] rounded-[20px] bg-[#E8E8E8] shadow-[inset_0px_1.5px_2px_rgba(0,0,0,0.12),0px_2px_4px_rgba(0,0,0,0.04)] border border-neutral-300/40 flex items-center justify-center text-neutral-600 hover:text-neutral-900 transition-colors cursor-default group"
                      >
                        <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
                      </div>
                    );
                  })}
                </div>

                {/* 2. AVATAR AREA: Yellow organic blob backdrop and 3D curly avatar bust */}
                <div className="relative w-full flex-1 flex items-center justify-center pt-3 pl-8 overflow-hidden">
                  {/* Yellow Organic Blob Background */}
                  <div className="absolute top-2 right-2 w-[220px] h-[220px] rounded-full bg-[#FEEE94] opacity-95 blur-[0.5px] pointer-events-none" />
                  <div className="absolute top-12 right-6 w-[170px] h-[150px] rounded-[40px] bg-[#FEF3A8] opacity-80 pointer-events-none" />

                  {/* 3D Clay Curly-Haired Avatar Bust */}
                  <motion.img
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    src="./avatar_bust.png"
                    alt="Puru Vats 3D Avatar"
                    className="relative z-10 w-[170px] xl:w-[185px] h-auto object-contain select-none pointer-events-none drop-shadow-md"
                  />
                </div>

                {/* 3. BOTTOM MARQUEE: Big sentence running on a moving animation moving from left to right */}
                <div className="w-full overflow-hidden whitespace-nowrap py-3 bg-[#F4F4F4]/90 backdrop-blur-xs border-t border-[#EAEAEA] relative z-20 mt-auto">
                  <motion.div
                    className="inline-flex gap-8 whitespace-nowrap"
                    animate={{ x: ['-50%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                  >
                    {[0, 1].map((copyIdx) => (
                      <div
                        key={copyIdx}
                        className="flex items-center gap-3.5 text-[30px] sm:text-[34px] font-display font-medium tracking-tight whitespace-nowrap select-none"
                      >
                        <span className="font-bold text-[#111110]">&lt;Design&gt;</span>
                        <span className="text-[#525252] font-semibold">&#123;code&#125;</span>
                        <span className="text-[#737373] font-normal">(research)</span>
                        <span className="text-[#468FFD] font-bold">^Music^</span>
                        <span className="text-[#262626] font-semibold">[Art]</span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* know me through my work ↓ CTA */}
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold font-sans text-[#404040] hover:text-[#111110] transition-colors cursor-pointer group mt-1"
              >
                <span>know me through my work</span>
                <img
                  src="./cta_arrow.svg"
                  alt=""
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-y-1"
                />
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
