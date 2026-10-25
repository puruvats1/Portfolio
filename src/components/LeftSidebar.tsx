import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import Matter from 'matter-js';
import {
  Home,
  Briefcase,
  Smile,
  Handshake,
  Quote,
  Mail,
} from 'lucide-react';
import { MickeyHand } from './MickeyHand';

export type SectionId = 'hero' | 'work' | 'about' | 'working-with-me' | 'testimonials' | 'contact';

interface MenuButtonConfig {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  gradient: string;
  border: string;
  textGradient: string;
  iconColor: string;
  angle: number;
}

// Tactile pastel pill buttons matching reference image:
// - Random playful stacking angles for organic casual feel (not uniform parallel)
// - 30% reduced text/icon opacity (opacity-70) for subtle balanced contrast
// - Inner gradient and subtle highlight shadow on text for dimensional depth
// - Outer 3D tactile beveling and smooth rounded corners
const MENU_BUTTONS: MenuButtonConfig[] = [
  {
    id: 'hero',
    label: 'home',
    icon: Home,
    gradient: 'from-[#FFF9CE] to-[#FEEA80]',
    border: 'border-[#F7DF59]',
    textGradient: 'from-[#92400E] to-[#713F12]',
    iconColor: 'text-[#854D0E]',
    angle: -3.2,
  },
  {
    id: 'work',
    label: 'work',
    icon: Briefcase,
    gradient: 'from-[#E6F1FE] to-[#C9E5FE]',
    border: 'border-[#93C5FD]',
    textGradient: 'from-[#1D4ED8] to-[#1E3A8A]',
    iconColor: 'text-[#1D4ED8]',
    angle: 2.6,
  },
  {
    id: 'about',
    label: 'about',
    icon: Smile,
    gradient: 'from-[#FFE9DC] to-[#FED2BE]',
    border: 'border-[#FDBA74]',
    textGradient: 'from-[#C2410C] to-[#9A3412]',
    iconColor: 'text-[#C2410C]',
    angle: -1.8,
  },
  {
    id: 'working-with-me',
    label: 'working with me',
    icon: Handshake,
    gradient: 'from-[#EDFA7E] to-[#D5F24B]',
    border: 'border-[#BEF264]',
    textGradient: 'from-[#4D7C0F] to-[#365314]',
    iconColor: 'text-[#3F6212]',
    angle: 3.4,
  },
  {
    id: 'testimonials',
    label: 'testimonials',
    icon: Quote,
    gradient: 'from-[#D7F8E8] to-[#B2F2D1]',
    border: 'border-[#6EE7B7]',
    textGradient: 'from-[#047857] to-[#064E3B]',
    iconColor: 'text-[#047857]',
    angle: -2.8,
  },
  {
    id: 'contact',
    label: 'contact',
    icon: Mail,
    gradient: 'from-[#FFE3EA] to-[#FFC3D1]',
    border: 'border-[#FDA4AF]',
    textGradient: 'from-[#BE123C] to-[#881337]',
    iconColor: 'text-[#BE123C]',
    angle: 1.6,
  },
];

export function LeftSidebar() {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [pointedButtonId, setPointedButtonId] = useState<SectionId>('hero');
  const [hoveredButtonId, setHoveredButtonId] = useState<SectionId | null>(null);
  const [stopOffset, setStopOffset] = useState(0);
  const [isHitGround, setIsHitGround] = useState(false);

  // Container reference for measuring local coordinate boundaries
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  // References for DOM buttons and wrappers
  const buttonWrapperRefs = useRef<Record<SectionId, HTMLDivElement | null>>({
    hero: null,
    work: null,
    about: null,
    'working-with-me': null,
    testimonials: null,
    contact: null,
  });

  const buttonRefs = useRef<Record<SectionId, HTMLButtonElement | null>>({
    hero: null,
    work: null,
    about: null,
    'working-with-me': null,
    testimonials: null,
    contact: null,
  });

  const handRef = useRef<HTMLDivElement | null>(null);

  // Matter.js 2D Physics Engine refs for rigid-body boundary collisions
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<Partial<Record<SectionId, Matter.Body>>>({});
  const groundBodyRef = useRef<Matter.Body | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [buttonWidths, setButtonWidths] = useState<Record<SectionId, number>>({
    hero: 104,
    work: 98,
    about: 104,
    'working-with-me': 188,
    testimonials: 152,
    contact: 118,
  });

  // Debounce/grace timer to prevent jerk when moving between buttons, and add smooth delay when leaving
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateWidths = () => {
      const newWidths: Record<SectionId, number> = { ...buttonWidths };
      let changed = false;
      for (const btn of MENU_BUTTONS) {
        const el = buttonRefs.current[btn.id];
        if (el) {
          const w = el.offsetWidth;
          if (w > 0 && Math.abs((newWidths[btn.id] || 0) - w) > 0.5) {
            newWidths[btn.id] = Math.round(w);
            changed = true;
          }
        }
      }
      if (changed) {
        setButtonWidths(newWidths);
      }
    };

    updateWidths();
    window.addEventListener('resize', updateWidths);
    if (document.fonts) {
      document.fonts.ready.then(updateWidths);
    }
    return () => window.removeEventListener('resize', updateWidths);
  }, []);

  // 2D Rigid-Body Collision Physics via Matter.js:
  // Each menu button has realistic geometric rectangular bounds with chamfered corners,
  // mass, friction, and restitution. When hitting the ground, buttons tumble and collide
  // with one another's physical boundaries, deflecting, bouncing, and piling up.
  useEffect(() => {
    if (isHitGround) {
      if (!menuContainerRef.current) return;
      const containerRect = menuContainerRef.current.getBoundingClientRect();

      // Clean up any existing animation frame or engine
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }

      // Initialize Matter engine with realistic gravity and sleep optimization
      const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1.4, scale: 0.0016 },
        enableSleeping: true,
      });
      engineRef.current = engine;

      const initialCenters: Record<string, { x: number; y: number }> = {};
      const bodies: Record<string, Matter.Body> = {};
      const newBodiesMap: Partial<Record<SectionId, Matter.Body>> = {};

      // 1. Create rigid bodies for each menu button using their exact rendered bounds
      MENU_BUTTONS.forEach((btn, index) => {
        const el = buttonRefs.current[btn.id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const width = rect.width || 120;
        const height = rect.height || 44;

        // Position relative to container origin
        const centerX = rect.left - containerRect.left + width / 2;
        const centerY = rect.top - containerRect.top + height / 2;

        initialCenters[btn.id] = { x: centerX, y: centerY };

        const initialAngleRad = (btn.angle * Math.PI) / 180;

        // Create chamfered rectangle body so pill corners glance off each other
        const body = Matter.Bodies.rectangle(centerX, centerY, width, height, {
          chamfer: { radius: 14 },
          angle: initialAngleRad,
          restitution: 0.28,  // Bouncy elasticity when striking boundaries
          friction: 0.5,     // Realistic surface sliding friction
          frictionAir: 0.018, // Aerodynamic air resistance
          density: 0.003,     // Button mass
        });

        // Impart a slight initial lateral velocity and spin according to its tilt angle
        const nudgeX = btn.angle * 0.35;
        Matter.Body.setVelocity(body, { x: nudgeX, y: 0.7 + index * 0.3 });
        Matter.Body.setAngularVelocity(body, btn.angle * 0.006);

        bodies[btn.id] = body;
        newBodiesMap[btn.id] = body;
      });

      // 2. Pointy hand rigid body that tumbles and lands with the button pile
      let handBody: Matter.Body | null = null;
      let handInitialCenter: { x: number; y: number } | null = null;
      if (handRef.current) {
        const handRect = handRef.current.getBoundingClientRect();
        const hWidth = 52;
        const hHeight = 38;
        const hCenterX = handRect.left - containerRect.left + hWidth / 2;
        const hCenterY = handRect.top - containerRect.top + hHeight / 2;
        handInitialCenter = { x: hCenterX, y: hCenterY };

        handBody = Matter.Bodies.rectangle(hCenterX, hCenterY, hWidth, hHeight, {
          chamfer: { radius: 10 },
          angle: -0.04,
          restitution: 0.25,
          friction: 0.45,
          frictionAir: 0.02,
          density: 0.002,
        });
        Matter.Body.setVelocity(handBody, { x: -0.5, y: 1.0 });
        Matter.Body.setAngularVelocity(handBody, 0.015);
      }

      // 3. Static Boundaries (Floor & Walls)
      // Stable floor right at the dock line
      const floorY = containerRect.height + 36;
      const ground = Matter.Bodies.rectangle(130, floorY + 25, 750, 50, {
        isStatic: true,
        friction: 0.85,
        restitution: 0.22,
      });
      groundBodyRef.current = ground;

      // Left boundary wall to keep buttons from falling off the screen edge
      const leftWall = Matter.Bodies.rectangle(-20, floorY / 2, 40, floorY * 2.5, {
        isStatic: true,
        friction: 0.6,
      });

      // Right boundary wall to contain the tumbling pile
      const rightWall = Matter.Bodies.rectangle(340, floorY / 2, 40, floorY * 2.5, {
        isStatic: true,
        friction: 0.6,
      });

      const allBodies = [ground, leftWall, rightWall, ...Object.values(bodies)];
      if (handBody) {
        allBodies.push(handBody);
      }

      Matter.World.add(engine.world, allBodies);
      bodiesRef.current = newBodiesMap;

      // 4. Run Physics Update Loop - Pure GPU transforms with zero reflow thrashing
      let lastTime = performance.now();
      const tick = (now: number) => {
        const delta = Math.min(now - lastTime, 32);
        lastTime = now;

        Matter.Engine.update(engine, delta);

        // Update DOM transform for each button
        MENU_BUTTONS.forEach((btn) => {
          const body = bodies[btn.id];
          const wrapper = buttonWrapperRefs.current[btn.id];
          const init = initialCenters[btn.id];
          if (body && wrapper && init) {
            const dx = body.position.x - init.x;
            const dy = body.position.y - init.y;
            const deg = (body.angle * 180) / Math.PI;
            wrapper.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${deg.toFixed(2)}deg)`;
          }
        });

        // Update DOM transform for pointy hand
        if (handBody && handRef.current && handInitialCenter) {
          const dx = handBody.position.x - handInitialCenter.x;
          const dy = handBody.position.y - handInitialCenter.y;
          const deg = (handBody.angle * 180) / Math.PI;
          handRef.current.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) rotate(${deg.toFixed(2)}deg) scaleX(-1)`;
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    } else {
      // Stopped touching ground: clean up physics engine and spring buttons back into order
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
      groundBodyRef.current = null;
      bodiesRef.current = {};

      // Spring each button back to its pristine resting angle and position
      MENU_BUTTONS.forEach((btn) => {
        const wrapper = buttonWrapperRefs.current[btn.id];
        if (wrapper) {
          gsap.to(wrapper, {
            x: 0,
            y: 0,
            rotation: btn.angle,
            duration: 0.55,
            ease: 'back.out(1.2)',
            overwrite: 'auto',
          });
        }
      });

      if (handRef.current) {
        gsap.to(handRef.current, {
          x: 0,
          y: 0,
          rotation: -2,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      groundBodyRef.current = null;
    };
  }, [isHitGround]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollBottom = scrollY + windowHeight;
      const docHeight = document.documentElement.scrollHeight;

      // Keep menu docked cleanly at edge of the black footer container
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect();
        const dockBottom = windowHeight - 32;
        // When the black container reaches the dock
        if (contactRect.top <= dockBottom) {
          setIsHitGround(true);
          const overflow = dockBottom - contactRect.top;
          setStopOffset(Math.max(0, Math.min(140, overflow)));
        } else {
          setIsHitGround(false);
          setStopOffset(0);
        }
      }

      if (scrollBottom >= docHeight - 120) {
        setActiveSection('contact');
        return;
      }

      // Synchronize exactly with heading entrance clearance above the bottom menu dock
      const menuClearance = window.innerWidth >= 1024 ? 430 : 100;
      const headingEntranceThreshold = windowHeight - menuClearance;

      const sections: SectionId[] = ['contact', 'testimonials', 'working-with-me', 'about', 'work', 'hero'];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Change pointer the exact instant the heading animates into view above the dock
          if (rect.top <= headingEntranceThreshold && rect.bottom > 120) {
            setActiveSection(id);
            return;
          }
        }
      }

      setActiveSection('hero');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When activeSection changes via scroll (and user is not currently hovering), smoothly track it
  useEffect(() => {
    if (!hoveredButtonId && !returnTimerRef.current) {
      setPointedButtonId(activeSection);
    }
  }, [activeSection, hoveredButtonId]);

  const pokeButton = (id: SectionId) => {
    if (!isHitGround || !engineRef.current) return;
    const body = bodiesRef.current[id];
    if (body) {
      Matter.Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.035,
        y: -0.05,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
    }
  };

  const handleButtonMouseEnter = (id: SectionId) => {
    if (isHitGround) {
      pokeButton(id);
    }
    // Clear any pending return timer so the hand glides directly to the new button without jerking
    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
    setHoveredButtonId(id);
    setPointedButtonId(id);
  };

  const handleButtonMouseLeave = () => {
    setHoveredButtonId(null);
    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current);
    }
    // Add delay for the pointy hand to stay and then smoothly glide back to the selected button
    // This eliminates the jerk when moving between buttons across the gap, and provides
    // a graceful delayed return when omitting selection.
    returnTimerRef.current = setTimeout(() => {
      setPointedButtonId(activeSection);
      returnTimerRef.current = null;
    }, 380);
  };

  useEffect(() => {
    return () => {
      if (returnTimerRef.current) {
        clearTimeout(returnTimerRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: SectionId) => {
    if (isHitGround) {
      pokeButton(id);
    }
    if (returnTimerRef.current) {
      clearTimeout(returnTimerRef.current);
      returnTimerRef.current = null;
    }
    setActiveSection(id);
    setPointedButtonId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -24;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const activeMenuIndex = MENU_BUTTONS.findIndex((btn) => btn.id === pointedButtonId);
  const targetIndex = activeMenuIndex === -1 ? 0 : activeMenuIndex;

  // Vertical spacing for 6 buttons with h-11 (44px) and gap-2.5 (10px) = 54px pitch
  const pointerY = targetIndex * 54;
  // Dynamic width of the currently pointed button, so the finger reaches the exact edge of that button
  const targetButtonWidth = buttonWidths[pointedButtonId] || 100;
  const isHoveredOnPointed = hoveredButtonId === pointedButtonId;

  return (
    <>
      {/* ================= DESKTOP FIXED BOTTOM MENU DOCK (GRID ALIGNED) ================= */}
      {/* Aligned to 12-column grid so buttons line up flush with section headings */}
      <nav
        aria-label="Navigation menu"
        style={{
          transform: stopOffset > 0 ? `translateY(-${stopOffset}px)` : undefined,
          transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="hidden lg:block fixed bottom-8 left-0 right-0 z-30 pointer-events-none select-none"
      >
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12">
          {/* Menu wrapper aligned flush with Column 1 of the section headings */}
          <div ref={menuContainerRef} className="relative w-fit pointer-events-auto select-none">
            {/* 6 Tactile Pastel Pill Buttons with 2D rigid-body boundary collision physics */}
            <div className="flex flex-col gap-2.5 items-start">
              {MENU_BUTTONS.map((btn, index) => {
                const IconComponent = btn.icon;
                const isActive = activeSection === btn.id;
                const isHovered = hoveredButtonId === btn.id;

                return (
                  <div
                    key={btn.id}
                    ref={(el) => {
                      buttonWrapperRefs.current[btn.id] = el;
                    }}
                    style={{
                      zIndex: isActive || isHovered ? 20 : 10 - index,
                      transformOrigin: 'left center',
                    }}
                    className="w-max self-start"
                  >
                    <motion.button
                      ref={(el) => {
                        buttonRefs.current[btn.id] = el;
                      }}
                      onClick={() => scrollToSection(btn.id)}
                      onMouseEnter={() => handleButtonMouseEnter(btn.id)}
                      onMouseLeave={handleButtonMouseLeave}
                      animate={{
                        y: isHovered && !isHitGround ? -2 : 0,
                        x: isHovered && !isHitGround ? 4 : 0,
                        scale: isHovered && !isHitGround ? 1.03 : 1,
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 26,
                      }}
                      className={`
                        relative group flex items-center gap-2.5
                        w-max self-start h-11 sm:h-11.5 px-4.5 sm:px-5
                        rounded-[15px] border ${btn.border}
                        bg-gradient-to-b ${btn.gradient}
                        shadow-[0_3px_10px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02),inset_0_1.5px_0.5px_rgba(255,255,255,0.95),inset_0_-1.5px_0_rgba(0,0,0,0.04)]
                        ${isActive ? 'shadow-[0_4px_12px_rgba(0,0,0,0.06),inset_0_1.5px_0.5px_rgba(255,255,255,0.98)]' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'}
                        cursor-pointer select-none transition-shadow
                      `}
                    >
                      {/* Icon sized to match snug text */}
                      <IconComponent
                        size={18}
                        className={`
                          shrink-0 stroke-[2.4] ${btn.iconColor}
                          ${isActive ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'}
                          transition-opacity drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]
                        `}
                      />
                      {/* Increased snug text size matching reference */}
                      <span
                        className={`
                          font-sans text-[15px] sm:text-[16px] font-bold lowercase tracking-tight whitespace-nowrap
                          bg-gradient-to-b ${btn.textGradient} bg-clip-text text-transparent
                          ${isActive ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'}
                          transition-opacity drop-shadow-[0_1px_0_rgba(255,255,255,0.65)]
                        `}
                      >
                        {btn.label}
                      </span>
                    </motion.button>
                  </div>
                );
              })}
            </div>

            {/* Reversed Vector Cartoon Glove Pointer (With stylish breathing room from button edges) */}
            <motion.div
              ref={handRef}
              className="absolute top-0 left-0 pointer-events-none"
              initial={false}
              animate={
                isHitGround
                  ? undefined
                  : {
                      y: pointerY + 2,
                      x: targetButtonWidth + (isHoveredOnPointed ? 20 : 25),
                      rotate: -2,
                      scaleX: -1,
                      opacity: 1,
                    }
              }
              transition={{
                y: { type: 'spring', stiffness: 420, damping: 28 },
                x: { type: 'spring', stiffness: 420, damping: 28 },
                rotate: { duration: 0.25 },
              }}
            >
              <MickeyHand className="w-13 h-10 drop-shadow-xs" />
            </motion.div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="flex items-center justify-between gap-1.5 p-2 rounded-2xl bg-white/95 border border-neutral-200/80 shadow-lg backdrop-blur-md overflow-x-auto no-scrollbar">
          {MENU_BUTTONS.map((btn) => {
            const IconComponent = btn.icon;
            const isActive = activeSection === btn.id;

            return (
              <button
                key={btn.id}
                onClick={() => scrollToSection(btn.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all shrink-0 cursor-pointer
                  ${isActive ? `bg-gradient-to-b ${btn.gradient} font-bold shadow-xs border ${btn.border}` : 'text-neutral-600 hover:bg-neutral-100 font-medium'}
                `}
              >
                <IconComponent size={14} className={`stroke-[2.2] ${btn.iconColor}`} />
                <span
                  className={`text-[11px] font-bold lowercase bg-gradient-to-b ${btn.textGradient} bg-clip-text text-transparent`}
                >
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
