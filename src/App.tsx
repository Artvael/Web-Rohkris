import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Topography } from './components/reactbits/Topography';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { StatsSection } from './components/sections/StatsSection';
import { ShowcaseExpandSection } from './components/sections/ShowcaseExpandSection';
import { ScheduleSection } from './components/sections/ScheduleSection';
import { GallerySection } from './components/sections/GallerySection';
import { TeamSection } from './components/sections/TeamSection';
import { PrayerBoxSection } from './components/sections/PrayerBoxSection';
import { SongbookSection } from './components/sections/SongbookSection';
import { AboutSection } from './components/sections/AboutSection';
import { VersesSection } from './components/sections/VersesSection';
import { PartnersSection } from './components/sections/PartnersSection';

import { useGalleryStore } from './hooks/useGalleryStore';
import { useScheduleStore } from './hooks/useScheduleStore';
import { usePrayerStore } from './hooks/usePrayerStore';

const SanityStudio = lazy(() =>
  import('./components/admin/SanityStudio').then((module) => ({
    default: module.SanityStudio,
  }))
);

export function MainWebsite() {
  const { items: galleryItems } = useGalleryStore();
  const { events: scheduleEvents } = useScheduleStore();
  const { prayers: prayerRequests } = usePrayerStore();

  useEffect(() => {
    // Active Theory & Santioni Spirits-inspired smooth momentum scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f4f0e6] text-[#282828] selection:bg-[#c5de9b] selection:text-[#282828] overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Full-Screen WebGL Topography Background (Organic Warm Elevation Contours) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45">
        <Topography
          lowColor="#baa88c"
          midColor="#84a159"
          highColor="#6e5234"
          speed={0.25}
          morphAmount={2.5}
          morphSpeed={0.03}
          bands={2.2}
          thickness={0.018}
          scale={1.0}
          pixelSize={1.0}
          glow={0.4}
          colorMode="elevation"
          contrast={2.4}
          brightness={1.1}
          fillBands={false}
          opacity={0.85}
          grain={true}
          grainIntensity={0.08}
          mouseInteraction={true}
          mouseRadius={0.3}
          mouseStrength={0.3}
        />
      </div>

      {/* 2. Top Floating Navigation Bar */}
      <Navbar />

      <main className="relative z-10 space-y-16 md:space-y-24">
        {/* Hero Section with ParticleText & TextLoop */}
        <HeroSection />

        {/* Endless Logo Loop Banner */}
        <PartnersSection />

        {/* Live Visitor Counter & Stats Section */}
        <StatsSection prayerCount={prayerRequests.length + 90} />

        {/* ScrollExpand Cinematic Community Banner */}
        <ShowcaseExpandSection />

        {/* DriftWall Bible Verses Section */}
        <VersesSection />

        {/* Upcoming Services & Schedule */}
        <ScheduleSection events={scheduleEvents} />

        {/* Event Documentation Gallery (AccordionGallery) */}
        <GallerySection items={galleryItems} />

        {/* Fellowship Team & Divisions (OptionWheel) */}
        <TeamSection />

        {/* Interactive Prayer Request Box & Wall */}
        <PrayerBoxSection />

        {/* Praise & Worship Songbook with Chords */}
        <SongbookSection />

        {/* About SMKN 64 Rohkris, Vision & Mission */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-[#fdfdf5] text-[#282828] font-bold font-['Outfit']">
                Memuat Sanity Studio...
              </div>
            }
          >
            <SanityStudio />
          </Suspense>
        }
      />
      <Route path="/*" element={<MainWebsite />} />
    </Routes>
  );
}

export default App;
