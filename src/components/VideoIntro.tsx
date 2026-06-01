import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type VideoIntroProps = {
  onReveal: () => void;
  onComplete: () => void;
  desktopSrc: string;
  mobileSrc: string;
  fadeDurationMs?: number;
  fallbackDurationMs?: number;
  sessionKey?: string;
};

const DEFAULT_FADE_DURATION = 1500;
const DEFAULT_FALLBACK_DURATION = 3000;

export default function VideoIntro({
  onReveal,
  onComplete,
  desktopSrc,
  mobileSrc,
  fadeDurationMs = DEFAULT_FADE_DURATION,
  fallbackDurationMs = DEFAULT_FALLBACK_DURATION,
  sessionKey = 'vals360-video-intro-seen'
}: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);
  const playbackStartedRef = useRef(false);
  const completedRef = useRef(false);
  const [isFading, setIsFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const shouldSkipIntro = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const seenThisSession = window.sessionStorage.getItem(sessionKey) === '1';
    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navigationEntry?.type === 'reload';

    return seenThisSession && !isReload;
  }, [sessionKey]);

  const clearTimers = useCallback(() => {
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (completeTimerRef.current) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const finishIntro = useCallback(() => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    clearTimers();

    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(sessionKey, '1');
    }

    setIsFading(true);
    onReveal();

    completeTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, fadeDurationMs);
  }, [clearTimers, fadeDurationMs, onComplete, onReveal, sessionKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateViewport);
      return () => mediaQuery.removeEventListener('change', updateViewport);
    }

    mediaQuery.addListener(updateViewport);
    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  useEffect(() => {
    if (shouldSkipIntro) {
      onReveal();
      onComplete();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete, onReveal, shouldSkipIntro]);

  useEffect(() => {
    if (shouldSkipIntro) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      fallbackTimerRef.current = window.setTimeout(() => {
        finishIntro();
      }, fallbackDurationMs);
      return;
    }

    const handlePlaying = () => {
      playbackStartedRef.current = true;
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };

    const handleEnded = () => finishIntro();
    const handleError = () => finishIntro();

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Fallback timer below will dismiss the intro if autoplay is blocked.
      }
    };

    fallbackTimerRef.current = window.setTimeout(() => {
      if (!playbackStartedRef.current) {
        finishIntro();
      }
    }, fallbackDurationMs);

    tryPlay();

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      clearTimers();
    };
  }, [clearTimers, fallbackDurationMs, finishIntro, isMobile, shouldSkipIntro]);

  if (shouldSkipIntro) {
    return null;
  }

  return (
    <div className={`video-intro-overlay ${isFading ? 'is-fading' : ''}`} aria-hidden="true">
      <video
        ref={videoRef}
        key={isMobile ? 'mobile-intro' : 'desktop-intro'}
        className="video-intro-overlay__media"
        src={isMobile ? mobileSrc : desktopSrc}
        muted
        autoPlay
        playsInline
        preload="auto"
      />

      <button
        type="button"
        className="video-intro-skip"
        onClick={finishIntro}
      >
        Saltar intro
      </button>
    </div>
  );
}
