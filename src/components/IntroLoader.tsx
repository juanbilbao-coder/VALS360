import React, { useEffect, useRef, useState } from 'react';

type IntroLoaderProps = {
  onFinish: () => void;
  durationMs?: number;
};

const DEFAULT_DURATION = 1100;

export default function IntroLoader({ onFinish, durationMs = DEFAULT_DURATION }: IntroLoaderProps) {
  const [exiting, setExiting] = useState(false);
  const exitTimeout = useRef<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    exitTimeout.current = window.setTimeout(() => {
      setExiting(true);
      onFinish();
    }, durationMs);

    return () => {
      if (exitTimeout.current) {
        window.clearTimeout(exitTimeout.current);
      }
      document.body.style.overflow = '';
    };
  }, [durationMs, onFinish]);

  return (
    <div className={`intro-screen ${exiting ? 'intro-exit' : ''}`} aria-hidden="true">
      <div className="intro-brand">
        <img src="/logo3.png" alt="VALS 360" className="intro-logo" />
      </div>
    </div>
  );
}
