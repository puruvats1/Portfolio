import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Smooth mouse coordinates with physics spring
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Tight, snappy spring tracking (no perceptible lag, silky smooth)
  const springConfig = { damping: 32, stiffness: 650, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Detect if hovering over clickable / interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, textarea, select, [role="button"], .cursor-pointer'
        );
        setIsHovering(Boolean(interactive));
      }
    };

    const handleMouseDown = () => setIsPointerDown(true);
    const handleMouseUp = () => setIsPointerDown(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Apply global CSS to hide default cursor on fine-pointer desktop devices
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
      className="fixed top-0 left-0 z-[9999] pointer-events-none select-none hidden lg:block"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    >
      {/* Container aligned so the index fingertip is the exact click hotspot (offset -3px, -7px) */}
      <div
        className="relative transition-transform duration-150 ease-out"
        style={{
          transform: `translate(-3px, -7px) scale(${
            isPointerDown ? 0.88 : isHovering ? 1.08 : 1
          }) rotate(${isPointerDown ? -6 : isHovering ? -4 : 0}deg)`,
        }}
      >
        {/* Soft Ellipse Blur Shadow matching Figma node 55:2553 */}
        <div
          className="absolute left-[26px] top-[30px] w-[32px] h-[10px] rounded-full bg-neutral-900/18 blur-[5px] pointer-events-none transition-all duration-150"
          style={{
            transform: isPointerDown
              ? 'scale(0.8) translateY(-2px)'
              : isHovering
              ? 'scale(1.2) translateY(3px)'
              : 'scale(1)',
            opacity: isPointerDown ? 0.28 : 0.2,
          }}
        />

        {/* 3D Cartoon White Glove Cursor Image matching Figma node 55:2554 */}
        <img
          src="./cursor_hand.png"
          alt=""
          className="w-[62px] h-auto object-contain relative z-10 pointer-events-none select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
