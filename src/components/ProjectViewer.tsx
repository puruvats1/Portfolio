import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { MILESTONES, PROJECTS, panelUrl, type Project } from '../data/projects';

interface Props {
  project: Project;
  onBack: () => void;
}

export function ProjectViewer({ project, onBack }: Props) {
  const milestones = MILESTONES[project.slug] ?? [];
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activePanel, setActivePanel] = useState(1);
  const [viewing, setViewing] = useState<number | null>(null); // 1-based panel open in the overlay
  const [zoomed, setZoomed] = useState(false);

  // Only suggest projects that have uploaded documentation
  const suggestions = PROJECTS.filter((p) => p.slug !== project.slug && p.panelCount > 0);

  // Track which panel is currently under the reading line (top ~35% of the viewport)
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let current = 1;
      panelRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i + 1;
      });
      setActivePanel(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [project.slug]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setActivePanel(1);
    setViewing(null);
    setZoomed(false);
  }, [project.slug]);

  const closeViewer = () => {
    setViewing(null);
    setZoomed(false);
  };
  const step = (dir: 1 | -1) => {
    setZoomed(false);
    setViewing((cur) => (cur === null ? cur : Math.min(project.panelCount, Math.max(1, cur + dir))));
  };

  // Overlay: keyboard controls + lock page scroll while open
  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewing !== null, project.panelCount]);

  const activeMilestone = milestones.reduce((acc, m, i) => (m.panel <= activePanel ? i : acc), 0);

  const jumpTo = (panel: number) => {
    panelRefs.current[panel - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showMarkers = milestones.length > 0;

  // Matches the hero side-nav label pill: 40px, 15px radius, blue clay gradient, bold gradient text
  const backButton = (
    <motion.button
      type="button"
      onClick={onBack}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className="h-[40px] pl-3.5 pr-4 rounded-[15px] bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] border border-[#B7D9FF]/75 pill-clay-blue inline-flex items-center gap-1.5 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF]"
    >
      <ArrowLeft className="w-4 h-4 stroke-[2.4] text-[#3F74E3]" />
      <span className="font-sans font-bold text-[15.5px] leading-[21px] tracking-[-0.25px] lowercase bg-gradient-to-b from-[#1D4ED8] to-[#1E3A8A] bg-clip-text text-transparent">
        back
      </span>
    </motion.button>
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ paddingLeft: 'var(--global-margin)', paddingRight: 'var(--global-margin)' }}
      className="w-full max-w-[1400px] mx-auto pt-24 sm:pt-28 pb-16 sm:pb-24"
    >
      {/* Phone / tablet: back button lives in the thumb zone, bottom-left */}
      <div className="lg:hidden fixed bottom-5 left-[var(--global-margin)] z-40">{backButton}</div>

      {/* Phone / tablet: plain text stage links that stick below the back button */}
      {showMarkers && (
        <nav
          aria-label="Project stages"
          className="lg:hidden sticky top-2 z-30 -mx-[var(--global-margin)] px-[var(--global-margin)] py-2.5 mb-4 bg-white/85 backdrop-blur-md overflow-x-auto flex gap-5 [scrollbar-width:none]"
        >
          {milestones.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => jumpTo(m.panel)}
              aria-current={i === activeMilestone}
              className={`shrink-0 font-sans text-[13px] cursor-pointer transition-colors duration-200 ${
                i === activeMilestone ? 'text-ink font-semibold' : 'text-[#9B9B96] font-medium'
              }`}
            >
              {m.label}
            </button>
          ))}
        </nav>
      )}

      {/* Title block sits directly on top of the scroll, aligned with it */}
      <div className="flex flex-col gap-3 mb-5 sm:mb-6 lg:ml-[15%]">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full bg-[#F3F2EE] text-[10.5px] sm:text-[11px] font-medium text-neutral-600 border border-neutral-200/60"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-display text-2xl sm:text-[28px] lg:text-[30px] font-semibold leading-tight tracking-tight heading-gradient">
          {project.title}
        </h1>
      </div>

      <div className="flex items-start w-full">
        {/* Desktop: minimal stage markers, vertically centred in the viewport */}
        {showMarkers && (
          <aside className="hidden lg:block w-[15%] shrink-0 self-stretch pr-6">
            {/* Back: level with the top of the scroll and pinned there while the page scrolls */}
            <div className="sticky top-[178px] z-40 w-max">{backButton}</div>

            {/* Stage markers: pinned at the vertical middle of the screen */}
            <div className="sticky top-1/2 -translate-y-1/2">
            <nav aria-label="Project stages" className="flex flex-col gap-3.5">
              {milestones.map((m, i) => {
                const isActive = i === activeMilestone;
                return (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => jumpTo(m.panel)}
                    aria-current={isActive}
                    className={`text-left font-sans text-[14px] leading-none cursor-pointer select-none outline-none focus-visible:underline transition-colors duration-200 ${
                      isActive ? 'text-ink font-semibold' : 'text-[#9B9B96] font-medium hover:text-[#60605D]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </nav>
            </div>
          </aside>
        )}

        {/* The scroll */}
        <div className="w-full lg:w-[85%] min-w-0">
          {/* Case study: panels stacked edge to edge as one continuous scroll */}
          <div className="w-full rounded-[20px] bg-[#F2F1ED] border border-neutral-200/70 overflow-hidden">
            <div className="flex flex-col w-full leading-[0]">
              {Array.from({ length: project.panelCount }, (_, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="scroll-mt-28 lg:scroll-mt-8 cursor-zoom-in"
                  onClick={() => setViewing(i + 1)}
                >
                  <img
                    src={panelUrl(project.slug, i + 1)}
                    alt={i === 0 ? `${project.title} case study` : ''}
                    className="block w-full h-auto select-none"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* End of case study: suggest other documented projects */}
      {suggestions.length > 0 && (
        <section className="mt-16 sm:mt-24 w-full lg:w-[85%] lg:ml-[15%]" aria-label="More projects">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-semibold leading-tight tracking-tight heading-gradient">More work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 w-full">
            {suggestions.map((p) => (
              <a key={p.id} href={`#/project/${p.slug}`} className="flex flex-col gap-3 group cursor-pointer w-full">
                <div className="w-full aspect-[16/10] rounded-[20px] sm:rounded-[26px] bg-[#F2F1ED] border border-neutral-200/70 relative overflow-hidden isolate">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" loading="lazy" />
                </div>
                <div className="flex flex-col gap-2 px-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-[#F3F2EE] text-[10.5px] sm:text-[11px] font-medium text-neutral-600 border border-neutral-200/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-[17px] sm:text-[18px] lg:text-[19px] font-semibold leading-snug heading-gradient">
                        {p.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-[13.5px] sm:text-[14px] text-neutral-500 font-medium">
                      <span>{p.category}</span>
                      <span className="text-neutral-300">·</span>
                      <span>{p.year}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Overlay viewer for a single panel */}
      <AnimatePresence>
        {viewing !== null && (
          <motion.div
            key="viewer"
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} panel ${viewing} of ${project.panelCount}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] bg-[#111110]/92 backdrop-blur-sm"
            onClick={closeViewer}
          >
            {/* Image area: fits the screen; click the image to zoom to full width and scroll */}
            <div
              className={`absolute inset-0 overflow-auto flex ${zoomed ? 'items-start' : 'items-center'} justify-center px-4 sm:px-16 py-16`}
            >
              <img
                key={viewing}
                src={panelUrl(project.slug, viewing)}
                alt={`${project.title} panel ${viewing}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomed((z) => !z);
                }}
                draggable={false}
                className={`rounded-[20px] bg-white select-none ${
                  zoomed
                    ? 'w-full max-w-[1600px] h-auto cursor-zoom-out'
                    : 'max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeViewer();
              }}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="w-5 h-5" />
            </button>

            {viewing > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous panel"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {viewing < project.panelCount && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next panel"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[13px] font-medium text-white/70 pointer-events-none">
              {viewing} / {project.panelCount}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
