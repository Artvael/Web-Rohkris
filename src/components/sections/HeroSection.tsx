import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1 || !v2) return;

    let currentVideo = v1;
    let nextVideo = v2;
    let isTransitioning = false;
    let animationFrameId: number;

    v1.playbackRate = 0.5;
    v2.playbackRate = 0.5;

    v1.play().catch(e => console.log("Autoplay prevented", e));

    const loopEngine = () => {
      if (!currentVideo.duration || isTransitioning) {
        animationFrameId = requestAnimationFrame(loopEngine);
        return;
      }

      const remainingRealTime = (currentVideo.duration - currentVideo.currentTime) / currentVideo.playbackRate;

      if (remainingRealTime <= 2.0 && currentVideo.currentTime > 0) {
        isTransitioning = true;
        nextVideo.currentTime = 0;
        nextVideo.playbackRate = 0.5;
        nextVideo.play().then(() => {
          nextVideo.style.opacity = '1';
          currentVideo.style.opacity = '0';
          
          setTimeout(() => {
            currentVideo.pause();
            currentVideo.currentTime = 0;
            const temp = currentVideo;
            currentVideo = nextVideo;
            nextVideo = temp;
            isTransitioning = false;
          }, 2000); // 2000ms transition time
        }).catch(e => {
          console.log("Play failed on crossfade", e);
          isTransitioning = false;
        });
      }
      
      animationFrameId = requestAnimationFrame(loopEngine);
    };

    v1.addEventListener('loadedmetadata', () => {
      animationFrameId = requestAnimationFrame(loopEngine);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="beranda" className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden text-emerald-950 font-sans">
      
      {/* Dual Video Background Engine */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-stone-100 pointer-events-none">
        <video 
            ref={v1Ref} 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out" 
            muted 
            playsInline 
            loop 
            preload="auto" 
            style={{ opacity: 1 }}
        >
            <source src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/nature_peace.mp4" type="video/mp4" />
        </video>
        <video 
            ref={v2Ref} 
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out" 
            muted 
            playsInline 
            loop 
            preload="auto" 
            style={{ opacity: 0 }}
        >
            <source src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/nature_peace.mp4" type="video/mp4" />
        </video>
        {/* Overlay Gradient (White to Transparent) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-transparent mix-blend-screen" />
        {/* Additional Dark Overlay to make text legible since we use dark text on whiteish background, wait: NaturaVista uses dark text on a light background. 
            So we want the video to be faded under a white gradient. */}
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 my-auto py-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl mx-auto space-y-6 flex flex-col items-center animate-fade-in-up">
              
              {/* Sub-tagline */}
              <div className="flex items-center justify-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-emerald-900">
                      Bertumbuh. Berakar. Berbuah.
                  </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight text-emerald-950 text-center" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}>
                  Rohkris <br />
                  <span className="italic font-normal">SMKN 64 Jakarta</span>
              </h1>

              {/* Accent Line & Subtitle */}
              <div className="pt-2 flex flex-col items-center">
                  <div className="w-16 h-[1.5px] bg-emerald-900/30 mb-6 mx-auto"></div>
                  <p className="text-base sm:text-lg text-emerald-900/90 font-medium leading-relaxed max-w-xl text-center">
                      Membangun generasi muda yang takut akan Tuhan, bertumbuh bersama dalam iman, pengharapan, dan kasih.
                  </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                  {/* Primary CTA */}
                  <a href="#jadwal" className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium text-white bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/50 shadow-xl transition-all duration-300 group">
                      <span>Jadwal Ibadah</span>
                      <ArrowRight className="w-4 h-4 text-teal-300 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </a>
                  
              </div>
          </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-8 pt-4 flex flex-col items-center justify-center mt-auto">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-900">SCROLL TO EXPLORE</span>
          <div className="w-[1px] h-4 bg-emerald-900/30 my-2"></div>
          <div className="w-4 h-6 rounded-full border border-emerald-950/60 flex justify-center pt-1">
              <div className="w-[2px] h-1.5 bg-emerald-950 rounded-full animate-scroll-dot"></div>
          </div>
      </div>

    </section>
  );
};
