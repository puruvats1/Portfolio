import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { WorkingWithMe } from './components/WorkingWithMe';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { LeftSidebar } from './components/LeftSidebar';
import { TopNav } from './components/TopNav';
import { CustomCursor } from './components/CustomCursor';
import { SHOW_WORKING_WITH_ME } from './config';
import { ProjectViewer } from './components/ProjectViewer';
import { PROJECTS } from './data/projects';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const slug = hash.startsWith("#/project/") ? hash.slice("#/project/".length) : null;
  const project = slug ? PROJECTS.find((p) => p.slug === slug) : undefined;

  const showingProject = !!project && project.panelCount > 0;
  const pendingScroll = useRef<"back" | "top" | null>(null);
  const homeScrollY = useRef<number | null>(null);

  // Keep track of the home page scroll position while it is on screen
  useEffect(() => {
    const remember = () => {
      if (document.getElementById("hero")) homeScrollY.current = window.scrollY;
    };
    remember();
    window.addEventListener("scroll", remember, { passive: true });
    return () => window.removeEventListener("scroll", remember);
  }, []);

  // Leave the project page; where the home page lands is applied before first paint (see below)
  const goHome = (target: "back" | "top") => {
    pendingScroll.current = target;
    history.pushState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  // Back: restore the last home scroll position (or the Work section if there is none).
  // Logo: top of the page. Both jump instantly, with no smooth scroll from the hero.
  useLayoutEffect(() => {
    if (showingProject) return;
    const target = pendingScroll.current;
    const saved = homeScrollY.current;
    pendingScroll.current = null;
    if (!target && saved === null) return; // first load of the home page
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    if (target === "top") {
      homeScrollY.current = null;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    } else if (saved !== null) {
      window.scrollTo({ top: saved, left: 0, behavior: "instant" as ScrollBehavior });
    } else {
      document.getElementById("work")?.scrollIntoView({ behavior: "instant" as ScrollBehavior });
    }
    root.style.scrollBehavior = prev;
  }, [showingProject]);

  // No uploaded documentation for this project: send people to Behance instead
  useEffect(() => {
    if (project && project.panelCount === 0) window.location.replace(project.link);
  }, [project]);

  if (project && project.panelCount > 0) {
    return (
      <div className="min-h-screen bg-canvas selection:bg-neutral-200 selection:text-ink relative font-sans text-ink">
        <CustomCursor />
        <TopNav hideOnScroll onHome={() => goHome("top")} />
        <ProjectViewer project={project} onBack={() => goHome("back")} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas selection:bg-neutral-200 selection:text-ink relative font-sans text-ink">
      {/* 3D Cartoon White Glove Custom Cursor matching Figma node 55:2552 */}
      <CustomCursor />

      {/* Top navigation with branding on left and Resume & Behance on right */}
      <TopNav />

      {/* Mobile Floating Dock (visible on < lg: phone & tablet) */}
      <LeftSidebar mode="mobile" />

      {/* 1400px Max-Width Grid Container: Accounts for sticky nav rail and scrolling content */}
      <div className="w-full max-w-[1400px] mx-auto min-h-screen relative flex">
        {/* Dedicated Sticky Left Rail for Nav Menu & Text Popups */}
        <div className="hidden lg:flex w-[225px] xl:w-[240px] shrink-0 sticky top-0 h-screen items-center z-40 pl-3 xl:pl-4 self-start">
          <LeftSidebar mode="desktop" />
        </div>

        {/* Main continuous scroll stream: positioned beside nav rail so content fills equal width as top bar */}
        <div className="flex-1 min-w-0 w-full">
          <main className="flex flex-col">
            {/* 1. Hello / Hero */}
            <Hero />

            {/* 2. My Work */}
            <Work />

            {/* 3. 'bout me! */}
            <About />

            {/* 4. Working with me */}
            {SHOW_WORKING_WITH_ME && <WorkingWithMe />}

            {/* 5. About me from others / Testimonials */}
            <Testimonials />
          </main>

          {/* 6. Work with me / Contact */}
          <Contact />
        </div>
      </div>
    </div>
  );
}
