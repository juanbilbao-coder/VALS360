import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ModalShell from '../../../ui/ModalShell';

type RenderModalProps = {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function RenderModal({ open, images, index, onClose, onPrev, onNext }: RenderModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        onPrev();
      }
      if (event.key === 'ArrowRight') {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onPrev, onNext]);

  return createPortal(
    <ModalShell
      open={open}
      onClose={onClose}
      overlayClassName="p-6 lg:p-6 z-[80]"
      backdropClassName="render-modal__backdrop"
      panelClassName="render-modal__panel"
      panelMotionProps={{
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
        transition: { duration: 0.4, ease: 'easeOut' }
      }}
      closeButton={
        <button className="render-modal__close" onClick={onClose} type="button">
          <X className="w-4 h-4" />
          <span>Cerrar</span>
        </button>
      }
    >
      <button className="render-modal__nav render-modal__nav--prev" onClick={onPrev} type="button">
        ‹
      </button>
      <button className="render-modal__nav render-modal__nav--next" onClick={onNext} type="button">
        ›
      </button>

      <div className="render-modal__media">
        <img src={images[index]} alt={`Render VALS 360 ${index + 1}`} />
      </div>

      <div className="render-modal__footer">
        <span>Render {index + 1} de {images.length}</span>
      </div>
    </ModalShell>,
    document.body
  );
}
