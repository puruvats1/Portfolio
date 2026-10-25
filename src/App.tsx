import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { WorkingWithMe } from './components/WorkingWithMe';
import { Testimonials } from './components/Testimonials';
import { Contact } from './components/Contact';
import { LeftSidebar } from './components/LeftSidebar';
import { TopNav } from './components/TopNav';

export default function App() {
  return (
    <div className="min-h-screen bg-canvas selection:bg-neutral-200 selection:text-ink relative font-sans text-ink overflow-x-hidden">
      {/* Top navigation with branding on left and Resume & Behance on right */}
      <TopNav />

      {/* Persistent Left Navbar with tactile squircle buttons and active section filled button pop-up */}
      <LeftSidebar />

      {/* Main continuous scroll stream with dedicated desktop left offset for the navbar */}
      <div className="w-full min-h-screen pb-24 lg:pb-0 lg:pl-52 xl:pl-60 2xl:pl-64">
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
