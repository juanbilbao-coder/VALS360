import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import ModalShell from '../../../ui/ModalShell';
import Tour360Viewer from '../components/Tour360Viewer';
import type { Tour360Data } from '../types';

type Tour360ModalProps = {
  open: boolean;
  onClose: () => void;
  tour?: Tour360Data | null;
};

export default function Tour360Modal({ open, onClose, tour }: Tour360ModalProps) {
  const [activeSceneId, setActiveSceneId] = useState<string>('');

  const scenes = tour?.scenes ?? [];

  useEffect(() => {
    if (!open || scenes.length === 0) {
      return;
    }
    const nextId = tour?.initialSceneId ?? scenes[0]?.id ?? '';
    setActiveSceneId(nextId);
  }, [open, tour?.initialSceneId, scenes]);

  const activeScene = useMemo(() => {
    if (scenes.length === 0) return null;
    return scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];
  }, [activeSceneId, scenes]);

  if (!open || scenes.length === 0) {
    return null;
  }

  return createPortal(
    <ModalShell
      open
      onClose={onClose}
      overlayClassName="p-4 lg:p-8 items-center"
      backdropClassName="bg-black/60 backdrop-blur-sm"
      panelClassName="relative w-full max-w-[1100px] h-[78vh] max-h-[720px] bg-[#F7F5F3] border border-border-subtle rounded-[24px] overflow-hidden shadow-2xl flex flex-col"
      closeButton={
        <button
          className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-secondary transition-colors hover:text-primary"
          onClick={onClose}
          type="button"
        >
          <X className="w-4 h-4" />
          <span>Cerrar</span>
        </button>
      }
    >
      <div className="shrink-0 px-6 lg:px-8 py-5 border-b border-border-subtle flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-secondary">Recorrido 360°</p>
          <h3 className="font-serif text-2xl text-primary">{activeScene?.title ?? 'Recorrido 360°'}</h3>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-6 lg:p-8">
        <Tour360Viewer
          src={activeScene?.image360 ?? ''}
          label={activeScene?.title ?? 'Recorrido 360°'}
          hotspots={activeScene?.hotspots ?? []}
          initialYaw={activeScene?.initialYaw}
          initialPitch={activeScene?.initialPitch}
          onSelectScene={(sceneId) => setActiveSceneId(sceneId)}
        />
      </div>

      <div className="shrink-0 px-6 lg:px-8 pb-6 flex flex-wrap gap-3">
        {scenes.slice(0, 4).map((scene) => {
          const isActive = scene.id === activeScene?.id;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => setActiveSceneId(scene.id)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                isActive
                  ? 'bg-primary text-inverse border-primary'
                  : 'bg-white text-secondary border-border-subtle hover:border-primary'
              }`}
            >
              {scene.title}
            </button>
          );
        })}
      </div>
    </ModalShell>,
    document.body
  );
}
