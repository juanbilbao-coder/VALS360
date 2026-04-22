import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import ModalShell from '../../../ui/ModalShell';

type FloorModalProps = {
  floor: string | null;
  onClose: () => void;
};

export default function FloorModal({ floor, onClose }: FloorModalProps) {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const floorNumber = floor ? Number(floor) : NaN;
  const isNumericFloor = Number.isFinite(floorNumber);
  const floorLabel = floor
    ? isNumericFloor
      ? `Piso ${floorNumber}`
      : floor === 'local'
        ? 'Local'
        : floor === 'coworking'
          ? 'Coworking'
          : floor
    : '';

  if (!floor) {
    return null;
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      overlayClassName="p-4 lg:p-8"
      backdropClassName="bg-black/60"
      backdropMotionProps={{
        initial: { backdropFilter: 'blur(0px)' },
        animate: { backdropFilter: 'blur(8px)' },
        exit: { backdropFilter: 'blur(0px)' },
        transition: { duration: 0.5 }
      }}
      panelMotionProps={{
        initial: {
          scale: 0.9,
          y: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: '0px 0px 0px rgba(0,0,0,0)'
        },
        animate: {
          scale: 1,
          y: 0,
          backgroundColor: 'var(--glass-bg)',
          borderColor: 'var(--glass-border)',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.5)'
        },
        exit: {
          scale: 0.95,
          y: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.0)',
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: '0px 0px 0px rgba(0,0,0,0)'
        },
        transition: { duration: 0.6, type: 'spring', bounce: 0, damping: 20, stiffness: 100 }
      }}
      panelClassName="relative w-full max-w-[1400px] h-[90vh] backdrop-blur-[20px] border rounded-3xl overflow-hidden flex flex-col lg:flex-row"
      closeButton={
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-bg-overlay hover:bg-border-subtle rounded-full text-primary transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="font-sans text-xs font-bold tracking-widest uppercase">Cerrar</span>
        </button>
      }
    >
      <motion.div
        initial={{ x: '-150%', skewX: -15, opacity: 0 }}
        animate={{ x: '200%', skewX: -15, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.1 }}
        className="absolute inset-0 z-50 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
      />
      {/* Left: 60% - Visor Gráfico */}
      <div className="w-full lg:w-[60%] bg-bg-overlay p-8 flex flex-col items-center justify-center border-r border-border-subtle relative">
        <div className="absolute top-8 left-8 flex bg-bg-overlay rounded-full p-1 border border-border-subtle z-10">
          {isNumericFloor && (
            <>
              <button
                onClick={() => setViewMode('2D')}
                className={`px-6 py-2 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-colors ${viewMode === '2D' ? 'bg-primary text-inverse' : 'text-secondary hover:text-primary'
                  }`}
              >
                Plano 2D
              </button>
              <button
                onClick={() => setViewMode('3D')}
                className={`px-6 py-2 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-colors ${viewMode === '3D' ? 'bg-primary text-inverse' : 'text-secondary hover:text-primary'
                  }`}
              >
                3D
              </button>
            </>
          )}
        </div>
        {isNumericFloor ? (
          <img
            src={`https://picsum.photos/seed/${viewMode}floorplan${floor}/1000/800`}
            alt={`Vista ${viewMode} ${floorLabel}`}
            className="w-full max-w-3xl object-contain opacity-80 mix-blend-screen"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-center text-secondary">
            <p className="font-serif text-3xl text-primary mb-4">{floorLabel}</p>
            <p className="text-sm uppercase tracking-[0.2em]">Explorar unidad</p>
          </div>
        )}
      </div>

      {/* Right: 40% - Panel de Datos */}
      <div className="w-full lg:w-[40%] p-8 lg:p-12 overflow-y-auto no-scrollbar flex flex-col">
        <h2 className="font-sans text-sm text-accent mb-12 uppercase tracking-widest font-bold">
          {floorLabel} • Disponibilidad
        </h2>

        {isNumericFloor ? (
          <div className="space-y-12">
            {[1, 2, 3].map((unitIdx) => {
              const unitNumber = `${floor}0${unitIdx}`;
              const isAvailable = Math.random() > 0.3; // Random availability for demo
              return (
                <div key={unitNumber} className="group">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-serif font-bold text-[40px] text-primary leading-none">UNIDAD {unitNumber}</h4>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-[#4CAF50]' : 'bg-[#F44336]'}`}></span>
                    <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                      {isAvailable ? 'Disponible' : 'Vendido'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-bg-overlay rounded-full font-sans text-xs text-secondary border border-border-subtle">
                      {120 + unitIdx * 15} m²
                    </span>
                    <span className="px-4 py-2 bg-bg-overlay rounded-full font-sans text-xs text-secondary border border-border-subtle">
                      {3 + (unitIdx % 2)} Ambientes
                    </span>
                    <span className="px-4 py-2 bg-bg-overlay rounded-full font-sans text-xs text-secondary border border-border-subtle">
                      Frente
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-[1px] bg-border-subtle mt-12 group-last:hidden"></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-secondary text-sm leading-relaxed">
            Información detallada disponible para explorar esta unidad.
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-border-subtle">
          <p className="font-sans text-[10px] text-secondary leading-relaxed">
            Los planos, medidas y superficies son meramente orientativos y están sujetos a modificaciones y al avance técnico del proyecto.
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
