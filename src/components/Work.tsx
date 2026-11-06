import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { navState, prefetchImage } from '../lib/pageTransition';
import { EASE_OUT } from '../lib/motion';
import { PopAnchor } from './ui/Pop';
import { LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import { ScrollRevealTitle } from './ScrollRevealTitle';
import { PROJECTS, panelUrl, projectLinkProps, type Project } from '../data/projects';

/** Load a project's first panel as soon as someone shows interest, so opening it can morph immediately. */
const warmUp = (p: Project) =>
  p.panelCount > 0
    ? { onPointerEnter: () => prefetchImage(panelUrl(p.slug, 1)), onPointerDown: () => prefetchImage(panelUrl(p.slug, 1)) }
    : {};

/** Spring shared by the view-toggle pill and the grid <-> list thumbnail morph. */
const MORPH = { type: 'spring' as const, stiffness: 380, damping: 36 };

function useIsSm() {
  const query = '(min-width: 640px)';
  const [isSm, setIsSm] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsSm(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isSm;
}

type ViewMode = 'grid' | 'list';

/** One option of the grid/list toggle. The clay pill behind the active option slides between them (shared layoutId). */
function ViewOption({
  mode,
  active,
  onSelect,
  icon,
  label,
}: {
  mode: ViewMode;
  active: boolean;
  onSelect: (m: ViewMode) => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(mode)}
      className={`relative isolate h-9 sm:h-9.5 rounded-[12px] flex items-center justify-center cursor-pointer font-sans font-semibold text-[12px] sm:text-[13px] outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#72BDFF] select-none border border-transparent transition-[background-color,color,border-color,box-shadow,padding,scale] duration-200 ease-out ${
        active
          ? 'px-2.5 sm:px-3 text-[#3F74E3] cursor-default'
          : 'px-3 sm:px-3.5 text-accent-text bg-white/45 hover:bg-white/90 hover:text-accent-hover hover:border-accent-border/70 hover:shadow-2xs active:scale-95 active:bg-[#D5E7FD] active:text-[#1E3A8A]'
      }`}
      aria-pressed={active}
      title={`${label} view`}
      aria-label={`${label} view`}
    >
      {active && (
        <motion.span
          layoutId="work-view-pill"
          aria-hidden="true"
          transition={MORPH}
          className="absolute -inset-px -z-10 rounded-[12px] bg-gradient-to-b from-[#E6F1FE] to-[#72BDFF] border border-[#B7D9FF] pill-clay-blue"
        />
      )}
      {icon}
      <span
        className={`overflow-hidden transition-[max-width,opacity,margin] duration-200 ease-out whitespace-nowrap text-current ${
          active ? 'max-w-0 opacity-0 ml-0 pointer-events-none' : 'max-w-[50px] opacity-100 ml-1.5'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export function Work() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  // After the first switch, newly mounted cards/rows start in place (no scroll pop) so the
  // thumbnails can morph between the two layouts; their text fades in behind the morph.
  const [switched, setSwitched] = useState(false);
  const isSm = useIsSm();

  const selectView = (m: ViewMode) => {
    if (m === viewMode) return;
    setSwitched(true);
    setViewMode(m);
  };

  /** Text that fades in after a grid <-> list switch (not on first render). */
  const afterSwitch = (i: number) => ({
    initial: switched ? { opacity: 0, y: 8 } : (false as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: EASE_OUT, delay: 0.12 + Math.min(i, 5) * 0.04 },
  });

  return (
    <section id="work" className="py-16 sm:py-20 lg:py-28 scroll-mt-24">
      <div className="w-full">

        {/* Section title & View Mode Toggle (Grid / List) in the Blue Nav Clay style */}
        <div className="mb-6 sm:mb-8 lg:mb-10 flex items-center justify-between gap-4 flex-wrap">
          <ScrollRevealTitle>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[36px] font-semibold leading-tight tracking-tight heading-gradient">
              My Work
            </h2>
          </ScrollRevealTitle>

          {/* Toggle option in the blue clay style of the nav buttons */}
          <div
            className="inline-flex items-center p-1 sm:p-1.5 rounded-[16px] sm:rounded-[18px] bg-[#EEF6FE] border border-[#BBDCFE] shadow-[inset_0px_1px_3px_rgba(43,127,255,0.08)] gap-1 sm:gap-1.5 select-none"
            role="group"
            aria-label="Project layout view toggle"
          >
            {/* Icon-only when selected; shows its text when not selected */}
            <ViewOption
              mode="grid"
              active={viewMode === 'grid'}
              onSelect={selectView}
              label="Grid"
              icon={<LayoutGrid className="w-4 h-4 stroke-[2] text-current shrink-0" />}
            />
            <ViewOption
              mode="list"
              active={viewMode === 'list'}
              onSelect={selectView}
              label="List"
              icon={<List className="w-4 h-4 stroke-[2] text-current shrink-0" />}
            />
          </div>
        </div>

        {/* View Mode Switching: each thumbnail morphs between its grid card and its list row (shared layoutId) */}
        <div>
          {viewMode === 'grid' ? (
            /* GRID VIEW (Default): 2 columns with generous cards and quiet micro-tags */
            <div className="grid grid-cols-1 md:grid-cols-8 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 w-full overflow-visible">
              {PROJECTS.map((project, i) => (
                <PopAnchor
                  key={project.id}
                  {...projectLinkProps(project)}
                  // Pops in every time it scrolls into view (right column trails the left). The card you are
                  // returning to from its project page starts in place, so the page can collapse into it.
                  delay={(i % 2) * 0.08}
                  skipFirst={switched || navState.returningTo === project.slug}
                  {...warmUp(project)}
                  className="md:col-span-4 flex flex-col gap-3 group cursor-pointer w-full"
                >
                  {/* Clean thumbnail container with standardized 16:10 ratio */}
                  <motion.div
                    layoutId={`work-thumb-${project.slug}`}
                    transition={MORPH}
                    // radius as a style so Motion keeps the corners true while the box scales
                    style={{ borderRadius: isSm ? 26 : 20 }}
                    data-vt-slug={project.slug}
                    data-vt-part="media"
                    className="w-full aspect-[16/10] bg-[#F2F1ED] border border-neutral-200/70 relative overflow-hidden isolate"
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Clean metadata section: tags placed right below thumbnail, above title */}
                  <motion.div {...afterSwitch(i)} className="flex flex-col gap-2 px-1">
                    {/* Micro-tags cleanly spaced below thumbnail: no hover transformation */}
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

                    {/* Title with hover arrow & category: static text, arrow appears on hover */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-[17px] sm:text-[18px] lg:text-[19px] font-semibold leading-snug heading-gradient">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-6 h-6 stroke-[2.25] text-neutral-500 shrink-0 opacity-0 -translate-x-3 translate-y-3 scale-75 transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100" />
                      </div>

                      <div className="text-[13.5px] sm:text-[14px] text-neutral-500 font-medium">
                        <span>{project.category}</span>
                      </div>
                    </div>
                  </motion.div>
                </PopAnchor>
              ))}
            </div>
          ) : (
            /* LIST VIEW: Streamlined, high-craft editorial table rows */
            <div className="flex flex-col divide-y divide-neutral-200/60 border-y border-neutral-200/60 w-full">
              {PROJECTS.map((project, i) => (
                <PopAnchor
                  key={project.id}
                  {...projectLinkProps(project)}
                  {...warmUp(project)}
                  delay={Math.min(i, 4) * 0.05}
                  skipFirst={switched || navState.returningTo === project.slug}
                  className="py-3.5 sm:py-4 flex items-center gap-4 sm:gap-5 md:gap-6 group cursor-pointer hover:bg-neutral-50/80 px-2 sm:px-4 rounded-xl transition-colors duration-150"
                >
                  {/* Thumbnail, 16:10 like the grid card, so the morph between them never stretches the image */}
                  <motion.div
                    layoutId={`work-thumb-${project.slug}`}
                    transition={MORPH}
                    style={{ borderRadius: isSm ? 12 : 8 }}
                    data-vt-slug={project.slug}
                    data-vt-part="media"
                    className="w-32 h-20 sm:w-48 sm:h-[7.5rem] overflow-hidden shrink-0 border border-neutral-200/70 bg-neutral-100"
                  >
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>

                  {/* Title above its tags, so neither ever gets squeezed by the other columns */}
                  <motion.div {...afterSwitch(i)} className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-display text-[15.5px] sm:text-[16.5px] font-semibold leading-snug heading-gradient">
                        {project.title}
                      </h3>
                      {/* Sub text sits right under the title */}
                      <p className="text-[13px] sm:text-[13.5px] leading-snug text-neutral-500 font-medium">{project.category}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-medium border border-neutral-200/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Hover arrow, in its own column so it never overlaps the text block */}
                  <div className="hidden md:flex items-center shrink-0">
                    <ArrowUpRight className="w-6 h-6 stroke-[2.25] text-neutral-500 shrink-0 opacity-0 -translate-x-3 translate-y-3 scale-75 transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100" />
                  </div>
                </PopAnchor>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
