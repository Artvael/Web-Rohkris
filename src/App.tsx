import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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

  return (
    <div className="relative min-h-screen bg-[#0c0a09] text-stone-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Full-Screen WebGL Topography Background (ReactBits) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-70">
        <Topography
          lowColor="#5227FF"
          midColor="#FF9FFC"
          highColor="#FFFFFF"
          speed={0.35}
          morphAmount={3.0}
          morphSpeed={0.05}
          bands={2.0}
          thickness={0.01}
          scale={1.0}
          pixelSize={1.0}
          glow={0.5}
          colorMode="elevation"
          contrast={3.0}
          brightness={1.0}
          fillBands={false}
          opacity={1.0}
          grain={true}
          grainIntensity={0.05}
          mouseInteraction={true}
          mouseRadius={0.3}
          mouseStrength={0.4}
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
              <div className="flex items-center justify-center min-h-screen bg-stone-950 text-amber-400 font-bold">
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
