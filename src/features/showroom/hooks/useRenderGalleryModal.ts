import { useState } from 'react';

type UseRenderGalleryModalParams = {
  totalSlides: number;
};

export function useRenderGalleryModal({ totalSlides }: UseRenderGalleryModalParams) {
  const [showRenderModal, setShowRenderModal] = useState(false);
  const [renderIndex, setRenderIndex] = useState(0);

  const openRenderModal = (index: number) => {
    setRenderIndex(index);
    setShowRenderModal(true);
  };

  const closeRenderModal = () => setShowRenderModal(false);

  const goPrevRender = () => {
    setRenderIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNextRender = () => {
    setRenderIndex((prev) => (prev + 1) % totalSlides);
  };

  return {
    showRenderModal,
    renderIndex,
    openRenderModal,
    closeRenderModal,
    goPrevRender,
    goNextRender
  };
}
