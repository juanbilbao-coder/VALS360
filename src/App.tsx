import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import IntroLoader from './components/IntroLoader';
import HeroSection from './features/showroom/components/HeroSection';

function Footer() {
  return (
    <footer className="bg-void pt-24 pb-8 px-8 lg:px-16 border-t border-border-subtle relative overflow-hidden">
      {/* Giant Watermark Logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none flex items-center justify-center w-full h-full overflow-hidden">
        <div className="flex items-center gap-8 scale-[3] md:scale-[5] lg:scale-[8]">
          <div className="w-20 h-20 rounded-[50%] border-[2px] border-primary flex items-center justify-center">
            <span className="font-serif text-primary text-4xl leading-none mt-2">V</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-primary text-5xl tracking-widest">VALS</span>
            <span className="font-sans text-primary text-xl tracking-[0.2em] font-light">360</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">
          {/* Enlaces */}
          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Secciones</h4>
            <ul className="space-y-4">
              <li><a href="#recorrido" className="text-secondary hover:text-primary transition-colors text-sm">Recorrer el proyecto</a></li>
              <li><a href="#unidades" className="text-secondary hover:text-primary transition-colors text-sm">Explorar unidades</a></li>
              <li><a href="#contenido" className="text-secondary hover:text-primary transition-colors text-sm">Contenido visual</a></li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Conectar</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Instagram className="w-4 h-4" /> Instagram</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Twitter className="w-4 h-4" /> Twitter</a></li>
              <li><a href="#" className="text-secondary hover:text-primary transition-colors text-sm flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Presentación</h4>
            <p className="text-secondary text-sm mb-4">Solicitá la presentación completa del showroom:</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Tu email..."
                className="bg-bg-overlay border border-border-subtle text-primary px-4 py-3 text-sm focus:outline-none focus:border-primary/30 w-full"
              />
              <button className="bg-primary text-inverse px-6 py-3 text-sm font-bold hover:bg-accent transition-colors">
                Enviar
              </button>
            </div>
          </div>

          {/* Contacto / Ubicación */}
          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-xs text-secondary mb-6">Ubicación</h4>
            <ul className="space-y-2">
              <li className="text-secondary text-sm">Sarmiento esq Libertad</li>
              <li className="text-secondary text-sm">Río Tercero, Córdoba</li>
              <li className="text-secondary text-sm">Argentina</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-xs">© 2026 VALS 360. Presentación inmobiliaria digital.</p>
          <div className="flex gap-6">
            <a href="#" className="text-secondary hover:text-primary transition-colors text-xs">Privacidad</a>
            <a href="#" className="text-secondary hover:text-primary transition-colors text-xs">Aviso Legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const introEnabled = true;
  const [phase, setPhase] = useState<'brand' | 'video' | 'showroom'>(introEnabled ? 'brand' : 'showroom');
  const [videoReady, setVideoReady] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [revealStage, setRevealStage] = useState(introEnabled ? -1 : 3);
  const [siteVisible, setSiteVisible] = useState(!introEnabled);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef<'brand' | 'video' | 'showroom'>(introEnabled ? 'brand' : 'showroom');
  const revealTimerRef = useRef<number | null>(null);
  const introVideoDoneRef = useRef(false);

  const handleIntroFinish = () => {
    if (phaseRef.current !== 'brand') {
      return;
    }
    phaseRef.current = 'video';
    setPhase('video');
  };

  const markIntroVideoDone = useCallback(() => {
    if (introVideoDoneRef.current) {
      return;
    }
    introVideoDoneRef.current = true;
    phaseRef.current = 'showroom';
    setPhase('showroom');
  }, []);

  useEffect(() => {
    if (phase === 'showroom') {
      return;
    }
    const video = introVideoRef.current;
    if (!video) {
      return;
    }
    const handleReady = () => setVideoReady(true);
    video.addEventListener('canplay', handleReady);
    video.addEventListener('loadeddata', handleReady);
    return () => {
      video.removeEventListener('canplay', handleReady);
      video.removeEventListener('loadeddata', handleReady);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'video') {
      return;
    }
    const video = introVideoRef.current;
    if (!video) {
      return;
    }
    video.load();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'video') {
      return;
    }
    const video = introVideoRef.current;
    if (!video) {
      return;
    }

    const attemptPlay = async () => {
      try {
        if (video.currentTime > 0) {
          video.currentTime = 0;
        }
        await video.play();
      } catch (error) {
        // Autoplay might be blocked; fall back to timed reveal.
      }
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      attemptPlay();
    };

    const handleEnded = () => markIntroVideoDone();
    const handleError = () => markIntroVideoDone();

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    attemptPlay();

    const fallback = window.setTimeout(() => {
      if (video.readyState >= 2 && video.paused) {
        markIntroVideoDone();
      }
    }, 5200);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      window.clearTimeout(fallback);
    };
  }, [phase, markIntroVideoDone]);

  useEffect(() => {
    if (!introEnabled) {
      setSiteVisible(true);
      setRevealStage(3);
      return;
    }
    if (phase !== 'showroom') {
      setRevealStage(-1);
      return;
    }
    setVideoFadeOut(true);
    setSiteVisible(true);
    setRevealStage(0);
    const t1 = window.setTimeout(() => setRevealStage(1), 130);
    const t2 = window.setTimeout(() => setRevealStage(2), 300);
    const t3 = window.setTimeout(() => setRevealStage(3), 500);
    const t4 = window.setTimeout(() => setVideoFadeOut(false), 520);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [phase, introEnabled]);

  const revealClasses = [
    revealStage >= 0 ? 'showroom-base' : '',
    revealStage >= 1 ? 'showroom-building' : '',
    revealStage >= 2 ? 'showroom-panel' : '',
    revealStage >= 3 ? 'showroom-nav' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="min-h-screen bg-void text-primary selection:bg-accent selection:text-inverse">
      {introEnabled && phase === 'brand' && (
        <IntroLoader onFinish={handleIntroFinish} />
      )}
      {introEnabled && (phase !== 'showroom' || videoFadeOut) && (
        <div
          className={`intro-video ${videoReady ? 'is-visible' : ''} ${videoFadeOut ? 'is-exiting' : ''}`}
          aria-hidden="true"
        >
          <video
            className="intro-video__media"
            muted
            autoPlay
            playsInline
            preload="auto"
            ref={introVideoRef}
          >
            <source src="/video1.mp4" type="video/mp4" />
          </video>
        </div>
      )}
      <div className={`app-content ${siteVisible ? 'app-content--visible' : ''} ${revealClasses}`}>
        <HeroSection canPlayBuildingVideo={!introEnabled || phase === 'showroom'} />
        <Footer />
      </div>
    </div>
  );
}
