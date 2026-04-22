import React from 'react';
import RenderModal from '../modals/RenderModal';
import UnitDetailView from '../views/UnitDetailView';
import type { UnitInfo } from '../types';

type ShowroomModalsProps = {
  selectedUnit: UnitInfo | null;
  onCloseUnit: () => void;
  heroSlides: string[];
  showRenderModal: boolean;
  renderIndex: number;
  onCloseRenderModal: () => void;
  onPrevRender: () => void;
  onNextRender: () => void;
};

export default function ShowroomModals({
  selectedUnit,
  onCloseUnit,
  heroSlides,
  showRenderModal,
  renderIndex,
  onCloseRenderModal,
  onPrevRender,
  onNextRender
}: ShowroomModalsProps) {
  return (
    <>
      <UnitDetailView unit={selectedUnit} onClose={onCloseUnit} renders={heroSlides} />
      <RenderModal
        open={showRenderModal}
        images={heroSlides}
        index={renderIndex}
        onClose={onCloseRenderModal}
        onPrev={onPrevRender}
        onNext={onNextRender}
      />
    </>
  );
}
