import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { WorkingWithMe } from './components/WorkingWithMe';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { LeftSidebar } from './components/LeftSidebar';
import { TopNav } from './components/TopNav';
import { CustomCursor } from './components/CustomCursor';

export default function App() {
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
        <div className="flex-1 min-w-0 w-full pb-28 lg:pb-0">
          <main className="flex flex-col">
            {/* 1. Hello / Hero */}
            <Hero />

            {/* 2. My Work */}
            <Work />

            {/* 3. 'bout me! */}
            <About />

            {/* 4. Working with me */}
            <WorkingWithMe />

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
