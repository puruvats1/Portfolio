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

  // Swipe left / right on the image to go to the next / previous panel
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null; // ignore pinch
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // a deliberate, mostly horizontal swipe (so vertical scrolling of a zoomed panel is left alone)
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
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
  // `compact` (phone / tablet): icon only, a square 40px button with the arrow centred
  const renderBackButton = (compact: boolean) => (
    <motion.button
      type="button"
      onClick={onBack}
      aria-label="Back"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`h-[40px] rounded-[15px] bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] border border-[#B7D9FF]/75 pill-clay-blue inline-flex items-center justify-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] ${
        compact ? 'w-[40px]' : 'pl-3.5 pr-4 gap-1.5'
      }`}
    >
      <ArrowLeft className="w-4 h-4 stroke-[2.4] text-[#3F74E3]" />
      {!compact && (
        <span className="font-sans font-bold text-[15.5px] leading-[21px] tracking-[-0.25px] lowercase bg-gradient-to-b from-[#1D4ED8] to-[#1E3A8A] bg-clip-text text-transparent">
          back
        </span>
      )}
    </motion.button>
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="w-full max-w-[1400px] mx-auto pt-24 sm:pt-28 pb-28 sm:pb-32 lg:pb-24"
    >
      {/* Phone / tablet: soft blur fading in from the top and bottom edges (same recipe as the home dock),
          so content scrolls away gently behind the back button and the stage stepper */}
      <div
        aria-hidden="true"
        className="lg:hidden fixed top-0 left-0 right-0 h-[calc(6.5rem+env(safe-area-inset-top))] pointer-events-none z-[25] backdrop-blur-lg [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"
      />
      {showMarkers && (
        <div
          aria-hidden="true"
          className="lg:hidden fixed bottom-0 left-0 right-0 h-[calc(9.5rem+env(safe-area-inset-bottom))] pointer-events-none z-[25] backdrop-blur-lg [mask-image:linear-gradient(to_top,black_45%,transparent)]"
        />
      )}

      {/* Phone / tablet: stage stepper, floating at the bottom with the same even edge gap as the home dock */}
      {showMarkers && (
        <nav
          aria-label="Project stages"
          className="lg:hidden fixed inset-x-0 bottom-[24px] sm:bottom-[32px] z-30 flex justify-center px-[24px] sm:px-[32px] pointer-events-none"
        >
         <div className="pointer-events-auto w-full max-w-[440px] flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-white/80 backdrop-blur-xl border border-neutral-200/70 shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
          {milestones.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => jumpTo(m.panel)}
              aria-current={i === activeMilestone}
              className={`shrink-0 py-1 font-sans text-[12.5px] sm:text-[14px] cursor-pointer transition-colors duration-200 ${
                i === activeMilestone ? 'text-ink font-semibold' : 'text-[#9B9B96] font-medium'
              }`}
            >
              {m.label}
            </button>
          ))}
         </div>
        </nav>
      )}

      {/* Desktop grid: a rail column (back + stage markers) running the full height of the page,
          next to the title, the scroll and "More work", so the rail never ends before the content does */}
      <div className="lg:grid lg:grid-cols-[225px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
      {/* Title block sits directly on top of the scroll, aligned with it */}
      <div className="flex flex-col gap-3 mb-5 sm:mb-6 lg:col-start-2 lg:row-start-1">
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

        {/* Desktop: minimal stage markers, vertically centred in the viewport */}
        {showMarkers && (
          <aside className="hidden lg:block lg:col-start-1 lg:row-start-1 lg:row-span-3 self-stretch pl-3 xl:pl-4 pr-6">
            {/* Back: level with the top of the scroll and pinned there while the page scrolls */}
            <div className="sticky top-[178px] z-40 w-max">{renderBackButton(false)}</div>

            {/* Stage markers: pinned at the vertical middle of the screen */}
            <div className="sticky top-[max(50vh,300px)] -translate-y-1/2">
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
        <div className="w-full min-w-0 lg:col-start-2 lg:row-start-2">
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

      {/* End of case study: suggest other documented projects */}
      {suggestions.length > 0 && (
        <section className="mt-16 sm:mt-24 min-w-0 lg:col-start-2 lg:row-start-3" aria-label="More projects">
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
                      <ArrowUpRight className="w-6 h-6 stroke-[2.25] text-neutral-500 shrink-0 opacity-0 -translate-x-3 translate-y-3 scale-75 transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100" />
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
      </div>

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
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="absolute inset-0 overflow-auto flex px-4 sm:px-16 pt-16 pb-28"
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
                className={`m-auto rounded-[20px] bg-white select-none ${
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

            {/* Navigation lives under the image so wide panels can never hide it */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3"
              style={{ bottom: 'max(20px, env(safe-area-inset-bottom))' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={viewing <= 1}
                aria-label="Previous panel"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/90 bg-white/12 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-[72px] text-center font-sans text-[14px] font-medium text-white/80 tabular-nums select-none">
                {viewing} / {project.panelCount}
              </div>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={viewing >= project.panelCount}
                aria-label="Next panel"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white/90 bg-white/12 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
