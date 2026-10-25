import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Hero() {
  const [isDialogueOpen, setIsDialogueOpen] = useState(true);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 6 Nav buttons matching Figma node 58:2824
  const navTabs = [
    {
      id: 'hero',
      label: 'hello!!',
      icon: './waving_hand.svg',
      gradient: 'from-[#FFF9CE] to-[#FEEA80]',
      border: 'border-[#F7DF59]',
      textColor: 'text-[#92400E]',
      shadow: 'clay-tab-shadow',
      isBadge: false,
    },
    {
      id: 'work',
      label: 'work',
      icon: './work_icon.svg',
      gradient: 'from-[#E6F1FE] to-[#72BDFF]',
      border: 'border-[#93C5FD]',
      textColor: 'text-[#1D4ED8]',
      shadow: 'clay-tab-shadow-blue',
      isBadge: false,
    },
    {
      id: 'about',
      label: 'about',
      icon: './about_icon.svg',
      gradient: 'from-[#FFE9DC] to-[#FED2BE]',
      border: 'border-[#FDBA74]',
      textColor: 'text-[#C2410C]',
      shadow: 'clay-tab-shadow',
      isBadge: false,
    },
    {
      id: 'working-with-me',
      label: '<skills>',
      icon: './skills_icon.svg',
      gradient: 'from-[#EDFA7E] to-[#D5F24B]',
      border: 'border-[#BEF264]',
      textColor: 'text-[#4D7C0F]',
      shadow: 'clay-tab-shadow',
      isBadge: true,
    },
    {
      id: 'testimonials',
      label: 't’monials',
      icon: './testimonials_icon.svg',
      gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
      border: 'border-[#6EE7B7]',
      textColor: 'text-[#047857]',
      shadow: 'clay-tab-shadow',
      isBadge: false,
    },
    {
      id: 'contact',
      label: 'contact',
      icon: './contact_icon.svg',
      gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
      border: 'border-[#FDA4AF]',
      textColor: 'text-[#BE123C]',
      shadow: 'clay-tab-shadow',
      isBadge: false,
    },
  ];

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 lg:pt-32 lg:pb-24">
      <div className="max-w-[1440px] mx-auto w-full px-6 sm:px-10 lg:px-14">
        {/* Main 3-column / 12-column grid directly translating Figma node 58:2824 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
          
          {/* LEFT COLUMN (Cols 1-3): The Tactile Nav Concept showcase */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {navTabs.map((tab, idx) => (
                <div key={tab.id} className="flex items-center gap-4 group">
                  {/* The Tactile Pill Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => scrollToSection(tab.id)}
                    className={`w-[78px] sm:w-[84px] h-[52px] sm:h-[58px] rounded-[22px] sm:rounded-[26px] bg-gradient-to-b ${tab.gradient} border-[1.7px] ${tab.border} ${tab.shadow} flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-200`}
                    aria-label={tab.label}
                  >
                    <img
                      src={tab.icon}
                      alt={tab.label}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain select-none pointer-events-none transition-transform duration-200 group-hover:scale-110"
                    />
                  </motion.button>

                  {/* The Playful Section Label */}
                  <button
                    onClick={() => scrollToSection(tab.id)}
                    className="cursor-pointer text-left transition-opacity hover:opacity-100 opacity-90"
                  >
                    {tab.isBadge ? (
                      <span className="inline-block px-3 py-1 rounded-[12px] bg-gradient-to-b from-[#EDFA7E] to-[#D5F24B] border border-[#BEF264] text-[17px] sm:text-[19px] font-bold font-display tracking-tight text-[#4D7C0F] shadow-xs">
                        {tab.label}
                      </span>
                    ) : (
                      <span
                        className={`font-display text-[19px] sm:text-[21px] font-bold tracking-tight lowercase ${tab.textColor} group-hover:translate-x-1 inline-block transition-transform duration-200`}
                      >
                        {tab.label}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER COLUMN (Cols 4-8): The Dialogue Card & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex flex-col gap-7 sm:gap-8">
              {/* The Clay Dialogue Card */}
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
                    <p className="font-sans text-[23px] sm:text-[28px] lg:text-[31px] font-medium sm:font-semibold leading-[1.28] tracking-tight text-[#2B2B2A]">
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
                      className="px-4 py-2 rounded-full bg-white border border-neutral-200 shadow-xs text-xs font-medium text-neutral-600 hover:text-ink hover:border-neutral-300 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>💬 Show message: "I resolve conflict between humans & computers..."</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Narrative & Previous Experience */}
              <div className="flex flex-col gap-6 pl-1 sm:pl-2">
                <p className="font-sans text-[15.5px] sm:text-[16.5px] text-[#525252] leading-relaxed max-w-xl font-normal">
                  B.Des '27 student at IDC, IIT Bombay. I’m drawn to challenging challenges, always growing as an individual and as a professional.
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

          {/* RIGHT COLUMN (Cols 9-12): The 3D Binder Card & CTA */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center pt-6 lg:pt-0">
            <div className="flex flex-col items-center lg:items-end gap-5">
              
              {/* Clay Binder Card with punch holes & curly avatar */}
              <motion.div
                whileHover={{ rotate: -1, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-[290px] sm:w-[312px] h-[360px] sm:h-[390px] clay-binder-card border border-[#EBEBEB] rounded-[28px] relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 cursor-default -rotate-[2.5deg] hover:rotate-0 transition-transform duration-300"
              >
                {/* 4 Binder Punch Holes along the left edge */}
                <div className="absolute left-3 sm:left-3.5 top-6 bottom-6 flex flex-col justify-between z-10">
                  {[0, 1, 2, 3].map((ring) => (
                    <div
                      key={ring}
                      className="w-3.5 sm:w-4 h-7 sm:h-8 rounded-full bg-[#D4D4D4] shadow-[inset_0px_1.5px_2px_rgba(0,0,0,0.2)] border border-[#C5C5C5]/40"
                    />
                  ))}
                </div>

                {/* Yellow Organic Blob Background behind avatar */}
                <div className="absolute top-4 right-3 w-[220px] h-[220px] rounded-full bg-[#FEEE94] opacity-95 blur-[0.5px] pointer-events-none" />
                <div className="absolute top-16 right-8 w-[180px] h-[160px] rounded-[40px] bg-[#FEF3A8] opacity-80 pointer-events-none" />

                {/* 3D Clay Curly-Haired Avatar Bust */}
                <div className="relative z-10 flex justify-center items-center pt-2 pl-4">
                  <motion.img
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    src="./avatar_bust.png"
                    alt="Puru Vats 3D Avatar"
                    className="w-[165px] sm:w-[178px] h-auto object-contain select-none pointer-events-none drop-shadow-md"
                  />
                </div>

                {/* Bottom Strip: <Design>{code}(research)^Music^[Art] */}
                <div className="relative z-10 pl-5 pr-2 pt-2">
                  <p className="font-display text-[17px] sm:text-[19px] font-semibold tracking-tight text-[#3A3A38] text-center leading-tight">
                    <span>&lt;Design&gt;</span>
                    <span className="text-neutral-500 font-medium">&#123;code&#125;</span>
                    <span className="text-neutral-400 font-normal">(research)</span>
                    <br />
                    <span className="text-[#468FFD] font-bold">^Music^</span>
                    <span className="text-neutral-600 font-semibold">[Art]</span>
                  </p>
                </div>
              </motion.div>

              {/* know me through my work ↓ CTA */}
              <button
                onClick={scrollToWork}
                className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold font-sans text-[#404040] hover:text-[#111110] transition-colors cursor-pointer group mt-2"
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
