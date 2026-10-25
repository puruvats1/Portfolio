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
    <div className="min-h-screen bg-canvas selection:bg-neutral-200 selection:text-ink relative font-sans text-ink">
      {/* Top navigation with equal-sized branding text on left and Resume & Behance on right */}
      <TopNav />

      {/* Fixed bottom-left tactile pastel menu dock with vector cartoon pointer */}
      <LeftSidebar />

      {/* Main continuous scroll stream aligned to unified 12-column grid */}
      <div className="w-full min-h-screen pb-20 lg:pb-0">
        <main className="flex flex-col">
          {/* 1. Hello / Hero */}
          <Hero />

          {/* 2. My Work (2 cards side by side, 6 rectangular cards) */}
          <Work />

          {/* 3. 'bout me! (with card spread in left column) */}
          <About />

          {/* 4. Working with me (with card spread and skills & capabilities) */}
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
