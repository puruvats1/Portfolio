import { useEffect, type RefObject } from 'react';
import { animate, motionValue } from 'motion/react';

/**
 * Rubber-band stretch at the top and bottom of the page.
 *
 * Two ways in, mirroring how native overscroll behaves:
 *
 * 1. Pull — a fresh scroll or drag that starts at an edge pulls the page past it. The page follows the input
 *    with growing resistance and a slight stretch, and springs back when the input stops.
 * 2. Impact — a scroll that arrives at an edge with speed (trackpad momentum, a touch fling, a fast wheel)
 *    gives a short bump scaled to that speed, instead of the leftover momentum events yanking the page.
 *    The rest of that gesture is then ignored, so the bump is the only response.
 *
 * The transform exists only while the page is out of rest, so `position: fixed` children (the feedback modal)
 * are never trapped inside a transformed ancestor. Off for reduced motion and while an overlay locks scrolling.
 */

type Edge = 'top' | 'bottom';

const MAX = 140; // the page can never travel further than this many px
const SOFT = 220; // pull distance at which it has travelled half of MAX (smaller = stiffer start)
const STRETCH = 0.00025; // vertical scale gained per px of travel (about 3.5% at full stretch)
const REST = 0.25; // below this many px the page counts as at rest and the transform is removed

const MAX_STEP = 48; // most pull a single wheel event can add, so a notched wheel can't snap the page
const IDLE_MS = 70; // no wheel events for this long counts as letting go
const GESTURE_GAP_MS = 160; // a pause this long between wheel events starts a new gesture

const IMPACT_GAIN = 1.1; // bump velocity (px/s) per px/s of arrival speed above IMPACT_SPEED
// Arrivals slower than this (px/s) just stop at the edge: a slow scroll never bumps. Above it the bump grows from
// zero, so there is no sudden jump in strength right at the threshold.
const IMPACT_SPEED = 1400;
const IMPACT_MIN = 110; // bumps weaker than this are not worth showing
const IMPACT_MAX = 3200; // fastest bump, about 100px of travel

// A pull is scaled by how fast the fingers are moving: a soft scroll barely stretches the page, a quick flick
// stretches it much further. Distance alone never counts: the pull also leaks away while scrolling continues.
const SOFT_SPEED = 0.3; // px/ms and below: soft scrolling, almost no stretch
const FULL_SPEED = 1.2; // px/ms: a normal-speed pull, 1:1
const SOFT_GAIN = 0; // share of the pull that counts at soft speeds: none, a slow scroll at the edge just stops
const SPEED_REF = 1.2; // px/ms above FULL_SPEED that doubles the pull
const SPEED_BOOST_MAX = 2; // at most this much extra pull (so up to 3x)
const TAIL_SPEED = 0.1; // px/ms: the tiny events at the end of trackpad momentum, treated as letting go
const LEAK_MS = 160; // time constant of the pull leaking away while scrolling continues
// Trackpad momentum (after the fingers lift) shows up as a run of steadily shrinking deltas. Once that starts,
// let go straight away instead of following the long tail, which made the page creep back slowly.
const MOMENTUM_RUN = 3; // this many shrinking events in a row...
const MOMENTUM_DROP = 0.55; // ...and below this share of the pull's biggest delta
// A mouse wheel moves in notches with gaps between them; pulling and releasing per notch stutters. Instead each
// notch at the edge kicks the page with a bit of velocity and the spring brings it home.
const NOTCH_KICK = 750; // px/s added per 100px notch (about 24px of travel for one notch)

// Page follows a pull: critically damped, so it tracks the input without wobble
const FOLLOW = { type: 'spring', stiffness: 520, damping: 46, mass: 1 } as const;
// Letting go: quick, no visible overshoot, keeps the velocity the page had when released
const RELEASE = { type: 'spring', stiffness: 320, damping: 31, mass: 1 } as const;
// Momentum bump: slightly softer so it reads as give, still settles without bouncing back past rest
const IMPACT = { type: 'spring', stiffness: 170, damping: 22, mass: 1 } as const;

const rubber = (pull: number) => MAX * (1 - 1 / (1 + pull / SOFT)); // diminishing returns
const unrubber = (travel: number) => SOFT * (1 / (1 - Math.min(travel, MAX - 1) / MAX) - 1);

export function useOverscrollStretch(ref: RefObject<HTMLElement | null>, active = true) {
  useEffect(() => {
    const el = ref.current;
    if (!active || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const maxScroll = () => root.scrollHeight - window.innerHeight;
    const atTop = () => window.scrollY <= 0;
    const atBottom = () => window.scrollY >= maxScroll() - 1;
    const blocked = () => document.body.style.overflow === 'hidden';

    // y is how far the page is displaced from rest (always >= 0); edge says which way
    const y = motionValue(0);
    let edge: Edge = 'top';
    const apply = (v: number) => {
      if (v < REST) {
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.willChange = '';
        return;
      }
      // keep the page on its own layer while it moves, so the scale doesn't re-render its contents every frame
      el.style.willChange = 'transform';
      const s = 1 + v * STRETCH;
      if (edge === 'top') {
        el.style.transformOrigin = '50% 0';
        el.style.transform = `translate3d(0, ${v}px, 0) scaleY(${s})`;
      } else {
        el.style.transformOrigin = '50% 100%';
        el.style.transform = `translate3d(0, ${-v}px, 0) scaleY(${s})`;
      }
    };
    const unsubscribe = y.on('change', apply);

    let pull = 0; // input distance past the edge, before resistance
    let anim: { stop: () => void } | null = null;
    let idle = 0;
    const stop = () => {
      anim?.stop();
      anim = null;
    };
    const displaced = () => y.get() >= REST;

    const release = () => {
      window.clearTimeout(idle);
      pull = 0;
      stop();
      anim = animate(y, 0, RELEASE); // picks up the current velocity of y
    };
    const reset = () => {
      window.clearTimeout(idle);
      pull = 0;
      stop();
      y.jump(0);
      apply(0);
    };
    // grab the page mid-spring and continue from where it is, rather than restarting from rest
    const catchIfMoving = (dir: Edge) => {
      if (pull === 0 && displaced() && edge === dir) {
        stop();
        pull = unrubber(y.get());
      }
    };

    // ---------- impact: arriving at an edge with speed ----------
    let lastInput: 'wheel' | 'touch' | 'other' = 'other';
    let lastInputAt = 0;
    const momentumInput = () => {
      const age = performance.now() - lastInputAt;
      return (lastInput === 'wheel' && age < 400) || (lastInput === 'touch' && age < 2500);
    };
    const impact = (dir: Edge, speed: number) => {
      const v = Math.min((speed - IMPACT_SPEED) * IMPACT_GAIN, IMPACT_MAX);
      if (v < IMPACT_MIN || pull > 0 || displaced()) return;
      edge = dir;
      stop();
      anim = animate(y, 0, { ...IMPACT, velocity: v }); // out and back from rest
    };

    let lastScroll = window.scrollY;
    let lastScrollAt = performance.now();
    let scrollVel = 0; // px/ms, smoothed
    const onScroll = () => {
      const now = performance.now();
      const sy = window.scrollY;
      const dt = now - lastScrollAt;
      const inst = dt > 0 ? (sy - lastScroll) / dt : 0;
      // the step that lands on the edge is cut short, so judge the arrival by the speed just before it
      const arrival = dt > 100 ? Math.abs(inst) : Math.max(Math.abs(scrollVel), Math.abs(inst));
      scrollVel = dt > 100 ? inst : scrollVel * 0.4 + inst * 0.6;
      const max = maxScroll();
      const hitTop = sy <= 0 && lastScroll > 0;
      const hitBottom = sy >= max - 1 && lastScroll < max - 1;
      lastScroll = sy;
      lastScrollAt = now;
      if ((hitTop || hitBottom) && !blocked() && momentumInput()) {
        impact(hitTop ? 'top' : 'bottom', arrival * 1000);
      }
    };

    // ---------- wheel / trackpad pull ----------
    let lastWheel = 0;
    let carriedIn = false; // this gesture started away from the edge: impact already answered it
    let spent = false; // this gesture's pull has been let go: ignore the rest of it (its momentum tail)
    let peak = 0; // biggest delta in the current pull
    let prevAbs = 0;
    let shrinking = 0; // consecutive events with a smaller delta than the one before
    const letGo = () => {
      spent = true;
      if (pull > 0 || displaced()) release();
    };
    // a notched mouse wheel rather than a trackpad: line/page deltas, or legacy wheelDelta in whole 120 steps
    const isNotched = (e: WheelEvent) => {
      if (e.deltaMode !== 0) return true;
      const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
      return typeof legacy === 'number' && legacy !== 0 && legacy % 120 === 0;
    };
    const kick = (dir: Edge, amount: number) => {
      if (displaced() && edge !== dir) return; // the other edge is still settling
      window.clearTimeout(idle);
      pull = 0;
      edge = dir;
      const current = Math.max(y.getVelocity(), 0);
      const v = Math.min(current + (NOTCH_KICK * Math.min(amount, 120)) / 100, IMPACT_MAX);
      stop();
      anim = animate(y, 0, { ...IMPACT, velocity: v });
    };
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      lastInput = 'wheel';
      lastInputAt = now;
      const gapMs = now - lastWheel; // time since the previous wheel event
      const dtMs = Math.min(Math.max(gapMs, 8), 64);
      if (now - lastWheel > GESTURE_GAP_MS) {
        carriedIn = false;
        spent = false;
      }
      lastWheel = now;
      if (e.ctrlKey) return; // pinch zoom
      if (blocked()) {
        if (displaced()) reset();
        return;
      }
      const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      const dir: Edge | null = d < 0 && atTop() ? 'top' : d > 0 && atBottom() ? 'bottom' : null;

      if (!dir || (pull > 0 && dir !== edge)) {
        // scrolling normally, or reversing out of a stretch: let go and treat the rest of this gesture as scroll
        if (pull > 0) release();
        if (d !== 0) carriedIn = true;
        return;
      }
      if (carriedIn || spent) return;
      const a = Math.abs(d);
      if (isNotched(e)) {
        kick(dir, a);
        return;
      }

      catchIfMoving(dir);
      if (pull === 0 && displaced()) return; // the other edge is still settling
      edge = dir;
      const speed = a / dtMs; // px/ms
      if (speed < TAIL_SPEED) {
        // the long tail of tiny events at the end of a trackpad gesture: the fingers have effectively let go
        letGo();
        return;
      }
      if (pull === 0) {
        peak = 0;
        prevAbs = a;
        shrinking = 0;
      }
      shrinking = a < prevAbs ? shrinking + 1 : 0;
      prevAbs = a;
      peak = Math.max(peak, a);
      if (pull > 0 && shrinking >= MOMENTUM_RUN && a < peak * MOMENTUM_DROP) {
        letGo(); // fingers lifted, momentum is coasting: spring back now
        return;
      }
      pull *= Math.exp(-Math.min(gapMs, GESTURE_GAP_MS) / LEAK_MS); // soft scrolling cannot build up a stretch
      const ramp = Math.min(Math.max((speed - SOFT_SPEED) / (FULL_SPEED - SOFT_SPEED), 0), 1);
      const gain = SOFT_GAIN + (1 - SOFT_GAIN) * ramp + Math.min(Math.max(speed - FULL_SPEED, 0) / SPEED_REF, SPEED_BOOST_MAX);
      pull += Math.min(Math.abs(d), MAX_STEP) * gain;
      stop();
      anim = animate(y, rubber(pull), FOLLOW);
      window.clearTimeout(idle);
      idle = window.setTimeout(letGo, IDLE_MS);
    };

    // ---------- touch pull ----------
    let touching = false;
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastInput = 'touch';
      lastInputAt = performance.now();
      touching = !blocked() && e.touches.length === 1;
      if (!touching) return;
      touchY = e.touches[0].clientY;
      catchIfMoving(edge);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touching) return;
      lastInputAt = performance.now();
      const cy = e.touches[0].clientY;
      const d = cy - touchY; // > 0: finger moving down, pulling past the top
      touchY = cy;

      if (pull === 0) {
        if (d > 0 && atTop()) edge = 'top';
        else if (d < 0 && atBottom()) edge = 'bottom';
        else return; // normal scrolling
      }
      pull = Math.max(0, pull + (edge === 'top' ? d : -d));
      stop();
      y.set(rubber(pull)); // the finger is the spring: track it 1:1
      if (e.cancelable) e.preventDefault(); // we draw the overscroll ourselves
    };
    const onTouchEnd = () => {
      touching = false;
      lastInputAt = performance.now(); // a fling keeps scrolling after the finger lifts
      if (pull > 0 || displaced()) release();
    };

    // anything other than wheel or touch (keys, clicks on nav links, scrollbar) never bumps the page
    const onOtherInput = (e: Event) => {
      if (e instanceof PointerEvent && e.pointerType === 'touch') return;
      lastInput = 'other';
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onOtherInput);
    window.addEventListener('pointerdown', onOtherInput);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('keydown', onOtherInput);
      window.removeEventListener('pointerdown', onOtherInput);
      reset();
      unsubscribe();
      el.style.willChange = '';
    };
  }, [ref, active]);
}
