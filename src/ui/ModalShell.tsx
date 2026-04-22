import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, type MotionProps } from 'motion/react';

type MotionConfig = Pick<MotionProps, 'initial' | 'animate' | 'exit' | 'transition'>;

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayClassName?: string;
  panelClassName?: string;
  backdropClassName?: string;
  closeButton?: React.ReactNode;
  panelMotionProps?: MotionConfig;
  backdropMotionProps?: MotionConfig;
};

export default function ModalShell({
  open,
  onClose,
  children,
  overlayClassName = '',
  panelClassName = '',
  backdropClassName = '',
  closeButton,
  panelMotionProps,
  backdropMotionProps
}: ModalShellProps) {
  const previousOverflow = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow.current ?? '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const overlayMotion: MotionConfig = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  };

  const panelMotion: MotionConfig = panelMotionProps ?? {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.98 },
    transition: { duration: 0.35, ease: 'easeOut' }
  };

  const backdropMotion: MotionConfig = backdropMotionProps ?? {};
  const backdropClasses = backdropClassName ? backdropClassName : 'bg-black/60';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          {...overlayMotion}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 ${overlayClassName}`}
        >
          <motion.div
            {...backdropMotion}
            className={`absolute inset-0 ${backdropClasses}`}
            onClick={onClose}
          />
          <motion.div
            {...panelMotion}
            className={`relative ${panelClassName}`}
            role="dialog"
            aria-modal="true"
          >
            {closeButton}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
