import React, { useEffect, useState } from 'react';
import IntroLoader from './components/IntroLoader';
import SiteFooter from './components/SiteFooter';
import HeroSection from './features/showroom/components/HeroSection';

export default function App() {
  const introEnabled = true;
  const [phase, setPhase] = useState<'brand' | 'showroom'>(introEnabled ? 'brand' : 'showroom');
  const [revealStage, setRevealStage] = useState(introEnabled ? -1 : 3);
  const [siteVisible, setSiteVisible] = useState(!introEnabled);

  const handleIntroFinish = () => {
    if (phase !== 'brand') {
      return;
    }
    setPhase('showroom');
  };

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
    setSiteVisible(true);
    setRevealStage(0);
    const t1 = window.setTimeout(() => setRevealStage(1), 130);
    const t2 = window.setTimeout(() => setRevealStage(2), 300);
    const t3 = window.setTimeout(() => setRevealStage(3), 500);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
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
      <div className={`app-content ${siteVisible ? 'app-content--visible' : ''} ${revealClasses}`}>
        <HeroSection canPlayBuildingVideo={!introEnabled || phase === 'showroom'} />
        <SiteFooter />
      </div>
    </div>
  );
}
