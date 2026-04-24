import React, { useCallback, useEffect, useRef, useState } from 'react';
import IntroLoader from './components/IntroLoader';
import SiteFooter from './components/SiteFooter';
import HeroSection from './features/showroom/components/HeroSection';

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
        <SiteFooter />
      </div>
    </div>
  );
}
