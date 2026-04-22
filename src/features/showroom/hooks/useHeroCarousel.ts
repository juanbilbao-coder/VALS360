import { useEffect, useState } from 'react';

export function useHeroCarousel(slides: string[], intervalMs: number = 4800) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [slides.length, intervalMs]);

  useEffect(() => {
    if (slides.length === 0) {
      return;
    }
    if (index >= slides.length) {
      setIndex(0);
    }
  }, [index, slides.length]);

  return { index, setIndex };
}
