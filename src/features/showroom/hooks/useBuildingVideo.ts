import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroView } from '../types';

type UseBuildingVideoOptions = {
  rightView: HeroView;
  canPlay: boolean;
};

export function useBuildingVideo({ rightView, canPlay }: UseBuildingVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (canPlay) {
      return;
    }
    if (showVideo) {
      setShowVideo(false);
    }
    if (!hasPlayed) {
      setHasPlayed(true);
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [canPlay, hasPlayed, showVideo]);

  const markDone = useCallback(() => {
    setShowVideo(false);
    setHasPlayed(true);
  }, []);

  useEffect(() => {
    if (rightView !== 'proyecto') {
      if (showVideo) {
        setShowVideo(false);
      }
      if (!hasPlayed) {
        setHasPlayed(true);
      }
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    if (hasPlayed && showVideo) {
      setShowVideo(false);
    }
  }, [rightView, hasPlayed, showVideo]);

  useEffect(() => {
    if (rightView !== 'proyecto' || !showVideo) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const attemptPlay = async () => {
      if (!canPlay) {
        return;
      }
      try {
        if (video.currentTime > 0) {
          video.currentTime = 0;
        }
        await video.play();
      } catch (error) {
        // Autoplay might be blocked; ignore and fallback later.
      }
    };

    const handleCanPlay = () => {
      attemptPlay();
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    attemptPlay();

    const fallback = window.setTimeout(() => {
      if (video.readyState >= 2 && video.paused) {
        markDone();
      }
    }, 3500);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      window.clearTimeout(fallback);
    };
  }, [rightView, showVideo, canPlay, markDone]);

  return { videoRef, showVideo, markDone };
}
