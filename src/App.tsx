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
    <div className="min-h-screen bg-canvas selection:bg-neutral-200 selection:text-ink relative font-sans text-ink overflow-x-hidden">
      {/* 3D Cartoon White Glove Custom Cursor matching Figma node 55:2552 */}
      <CustomCursor />

      {/* Top navigation with branding on left and Resume & Behance on right */}
      <TopNav />

      {/* Persistent Left Navbar with exact Figma node 58:3013 button styling and supporting filled popup pills */}
      <LeftSidebar />

      {/* Main continuous scroll stream with comfortable left clearance for the persistent navbar */}
      <div className="w-full min-h-screen pb-0 lg:pl-[280px] xl:pl-[320px] 2xl:pl-[360px]">
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
  );
}
