import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import lobbyTransitionVideo from '../../assets/videolooby.mp4';
const lobbySceneImage = '/r4.png';

type LobbyElevatorProps = {
  isOpen: boolean;
  selectedFloor: string | null;
  stops: Array<{ key: string; label: string; composition: string }>;
  onToggle: () => void;
  onClose: () => void;
  onSelectStop: (floor: string) => void;
  disabled?: boolean;
};

export default function LobbyElevator({
  isOpen,
  selectedFloor,
  stops,
  onToggle,
  onClose,
  onSelectStop,
  disabled = false
}: LobbyElevatorProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionGuardRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      transitionGuardRef.current = false;
    }
  }, [isOpen]);

  const openLobbyWithTransition = () => {
    if (disabled || isOpen || isTransitioning) {
      return;
    }
    setIsTransitioning(true);
    transitionGuardRef.current = false;
  };

  const finishTransition = () => {
    if (transitionGuardRef.current) {
      return;
    }
    transitionGuardRef.current = true;
    setIsTransitioning(false);
    onToggle();
  };

  return (
    <>
      {!isOpen && !isTransitioning ? (
        <div className="pointer-events-none absolute left-4 bottom-4 z-40 sm:left-6 sm:bottom-6">
          <button
            type="button"
            onClick={openLobbyWithTransition}
            disabled={disabled}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[rgba(184,144,80,0.22)] bg-white/92 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--text-primary)] shadow-[0_14px_35px_rgba(15,12,10,0.12)] transition hover:-translate-y-[1px] hover:border-[rgba(184,144,80,0.45)] disabled:cursor-not-allowed disabled:opacity-50"
            aria-expanded={false}
            aria-controls="building-lobby-scene"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(184,144,80,0.22)] bg-[rgba(255,255,255,0.92)]">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M8 4h8M8 20h8M9 8l3-3 3 3M9 16l3 3 3-3M12 5v14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Lobby
          </button>
        </div>
      ) : null}

      <AnimatePresence>
        {isTransitioning ? (
          <motion.div
            key="building-lobby-transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="absolute inset-0 z-40 overflow-hidden rounded-[24px] bg-[#0f0c0a]"
          >
            <video
              className="h-full w-full object-cover"
              src={lobbyTransitionVideo}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={finishTransition}
              onError={finishTransition}
            />
          </motion.div>
        ) : null}

        {isOpen ? (
          <motion.div
            id="building-lobby-scene"
            initial={{ opacity: 0, scale: 1.015 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute inset-0 z-40 overflow-hidden rounded-[24px]"
          >
            <img
              src={lobbySceneImage}
              alt="Interior del lobby de VALS 360"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
              <div className="flex items-start justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.42)] bg-[rgba(247,245,243,0.72)] text-[var(--text-primary)] shadow-[0_12px_28px_rgba(15,12,10,0.1)] backdrop-blur-sm transition hover:bg-[rgba(247,245,243,0.88)]"
                  aria-label="Volver al edificio"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="M15 6l-6 6 6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="ml-auto w-full max-w-[440px] rounded-[26px] border border-[rgba(255,255,255,0.52)] bg-[rgba(247,245,243,0.78)] p-5 text-[var(--text-primary)] shadow-[0_20px_48px_rgba(15,12,10,0.14)] backdrop-blur-sm sm:p-6">
                <div className="mb-5">
                  <p className="font-serif text-[1.35rem] leading-none text-[var(--text-primary)]">
                    Niveles del edificio
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[rgba(85,85,85,0.82)]">
                    Seleccioná una planta para explorar su composición
                  </p>
                  <p className="mt-2 text-[11px] tracking-[0.04em] text-[rgba(85,85,85,0.68)]">
                    Subsuelo con 22 cocheras
                  </p>
                </div>

                <div className="grid max-h-[46svh] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                  {stops.map((stop) => {
                    const isActive = selectedFloor === stop.key;
                    return (
                      <button
                        key={stop.key}
                        type="button"
                        onClick={() => onSelectStop(stop.key)}
                        className={`rounded-[18px] border px-3 py-3.5 text-left transition ${
                          isActive
                            ? 'border-[rgba(184,144,80,0.42)] bg-[rgba(184,144,80,0.16)] text-[var(--text-primary)]'
                            : 'border-[rgba(184,144,80,0.14)] bg-white/64 text-[rgba(85,85,85,0.9)] hover:border-[rgba(184,144,80,0.26)] hover:bg-white/82'
                        }`}
                      >
                        <span className="block font-serif text-[1.02rem] leading-none text-[var(--text-primary)]">
                          {stop.label}
                        </span>
                        <span className="mt-2 block text-[10px] uppercase tracking-[0.14em] text-[rgba(85,85,85,0.72)]">
                          {stop.composition}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
