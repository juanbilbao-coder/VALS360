import React from 'react';
import type { HeroView } from '../../../types';

type HeroNavigationProps = {
  rightView: HeroView;
  showBuildingVideo: boolean;
  onChangeView: (view: HeroView) => void;
};

export default function HeroNavigation({ rightView, showBuildingVideo, onChangeView }: HeroNavigationProps) {
  if (rightView !== 'proyecto') {
    return (
      <div className="right-vertical-nav right-vertical-nav--back z-20">
        <button type="button" onClick={() => onChangeView('proyecto')} className="btn-outline">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className={`right-vertical-nav z-20 ${showBuildingVideo ? 'menu-hidden' : 'menu-visible'}`}>
      <nav className="right-vertical-links rounded-[22px] border border-[rgba(255,255,255,0.45)] bg-[rgba(247,245,243,0.68)] px-5 py-4 shadow-[0_16px_34px_rgba(15,12,10,0.08)] backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onChangeView('proyecto')}
          className={`hover:text-primary transition-colors bg-transparent p-0 border-0 text-left ${rightView === 'proyecto' ? 'text-primary' : 'text-secondary'}`}
        >
          PROYECTO
        </button>
        <button
          type="button"
          onClick={() => onChangeView('avances')}
          className={`hover:text-primary transition-colors bg-transparent p-0 border-0 text-left ${rightView === 'avances' ? 'text-primary' : 'text-secondary'}`}
        >
          AVANCES DE OBRA
        </button>
        <button
          type="button"
          onClick={() => onChangeView('unidades')}
          className={`hover:text-primary transition-colors bg-transparent p-0 border-0 text-left ${rightView === 'unidades' ? 'text-primary' : 'text-secondary'}`}
        >
          EXPLORAR UNIDADES
        </button>
        <button
          type="button"
          onClick={() => onChangeView('ubicacion')}
          className={`hover:text-primary transition-colors bg-transparent p-0 border-0 text-left ${rightView === 'ubicacion' ? 'text-primary' : 'text-secondary'}`}
        >
          UBICACION
        </button>
        <button
          type="button"
          onClick={() => onChangeView('compartir')}
          className={`hover:text-primary transition-colors bg-transparent p-0 border-0 text-left ${rightView === 'compartir' ? 'text-primary' : 'text-secondary'}`}
        >
          COMPARTIR
        </button>
      </nav>
    </div>
  );
}
