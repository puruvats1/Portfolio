import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';

/**
 * Last known pointer state, kept outside React: the cursor is re-created when the page changes
 * (home <-> project), and must reappear where it was instead of waiting for the next mouse move.
 */
const last = { x: -100, y: -100, visible: false };

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(last.visible);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  // Context label shown beside the glove, from the nearest [data-cursor] ancestor (e.g. "View case study")
  const [label, setLabel] = useState<string | null>(null);
  const [labelTone, setLabelTone] = useState<'dark' | 'light'>('dark');

  // Normal hardware speed mouse coordinates (no spring smoothing, 1:1 instantaneous tracking)
  const mouseX = useMotionValue(last.x);
  const mouseY = useMotionValue(last.y);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      last.x = e.clientX;
      last.y = e.clientY;
      last.visible = true;
      if (!isVisible) setIsVisible(true);

      // Detect if hovering over clickable / interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, textarea, select, [role="button"], .cursor-pointer'
        );
        setIsHovering(Boolean(interactive));
        const labelled = target.closest<HTMLElement>('[data-cursor]');
        setLabel(labelled?.dataset.cursor || null);
        setLabelTone(labelled?.dataset.cursorTone === 'light' ? 'light' : 'dark');
      }
    };

    // The pointer can sit still while the content under it changes (scrolling, or a page change):
    // re-read what is under it so the hover state and the label never go stale.
    let refreshFrame = 0;
    const refreshUnderPointer = () => {
      if (refreshFrame) return;
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        if (!last.visible) return;
        const el = document.elementFromPoint(last.x, last.y) as HTMLElement | null;
        setIsHovering(Boolean(el?.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer')));
        const labelled = el?.closest<HTMLElement>('[data-cursor]');
        setLabel(labelled?.dataset.cursor || null);
        setLabelTone(labelled?.dataset.cursorTone === 'light' ? 'light' : 'dark');
      });
    };
    // after a page change, check again once the page transition has finished
    const handleHashChange = () => {
      setLabel(null);
      window.setTimeout(refreshUnderPointer, 700);
    };

    const handleMouseDown = () => setIsPointerDown(true);
    const handleMouseUp = () => setIsPointerDown(false);

    const handleMouseLeave = () => {
      last.visible = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      last.visible = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', refreshUnderPointer, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Apply global CSS to hide default cursor on fine-pointer desktop devices
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', refreshUnderPointer);
      window.removeEventListener('hashchange', handleHashChange);
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isVisible, mouseX, mouseY]);

  // Don't render on mobile/touch or before first mouse movement
  if (!isVisible) return null;

  return (
    <motion.div
      // own view-transition layer so it stays on top (and on screen) while pages change
      className="custom-cursor fixed top-0 left-0 z-[9999] pointer-events-none select-none"
      style={{
        x: mouseX,
        y: mouseY,
      }}
    >
      {/* 
        Tilted 40 degrees to the right as requested.
        transformOrigin is locked to the index fingertip (14px, 8px) with matching offset translate
        so the fingertip is the exact click target.
      */}
      <div
        className="relative pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate(-14px, -8px) rotate(40deg) scale(${
            isPointerDown ? 0.9 : isHovering ? 1.08 : 1
          })`,
          transformOrigin: '14px 8px',
        }}
      >
        {/* Soft Ellipse Blur Shadow matching Figma node 55:2553 */}
        <div
          className="absolute left-[18px] top-[28px] w-[32px] h-[10px] rounded-full bg-neutral-900/18 blur-[5px] pointer-events-none transition-[transform,opacity] duration-100"
          style={{
            transform: `rotate(-15deg) scale(${
              isPointerDown ? 0.8 : isHovering ? 1.15 : 1
            })`,
            opacity: isPointerDown ? 0.28 : 0.2,
          }}
        />

        {/* 3D Cartoon White Glove Cursor Image matching Figma node 55:2554 */}
        <img
          src="./cursor_hand.png"
          alt=""
          className="w-[60px] h-auto object-contain relative z-10 pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          draggable={false}
        />
      </div>

      {/* Context label: pops out beside the glove over things that do something specific on click */}
      <AnimatePresence>
        {label && (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.7, x: -6 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 520, damping: 32 }}
            style={{ originX: 0, originY: 0.5 }}
            className={`absolute left-[44px] top-[30px] whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-[13px] font-semibold leading-none shadow-[0_6px_16px_rgba(0,0,0,0.14)] ${
              labelTone === 'light' ? 'bg-white text-ink' : 'bg-[#2E2E2C] text-white'
            }`}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
