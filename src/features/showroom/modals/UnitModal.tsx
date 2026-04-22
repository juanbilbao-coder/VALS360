import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import ModalShell from '../../../ui/ModalShell';
import { selectProjectContact } from '../data/selectors';
import Tour360Modal from './Tour360Modal';
import type { UnitInfo } from '../types';

type UnitModalProps = {
  unit: UnitInfo | null;
  onClose: () => void;
  renders: string[];
};

export default function UnitModal({ unit, onClose, renders }: UnitModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTour360, setShowTour360] = useState(false);

  useEffect(() => {
    if (!unit) {
      return;
    }
    setActiveIndex(0);
    setShowTour360(false);
  }, [unit]);

  if (!unit) {
    return null;
  }

  const contact = selectProjectContact();
  const primaryRender = unit.media?.render ?? renders[0];
  const planRender = unit.media?.plan ?? renders[1] ?? primaryRender;
  const alternateRender = renders[2] ?? primaryRender;
  const tour360 = unit.media?.tour360 ?? unit.tour360;
  const gallery = [
    { label: 'Render', src: primaryRender },
    { label: 'Axonometría', src: alternateRender },
    { label: 'Plano', src: planRender }
  ];
  const floorLabel = unit.floor === 0 ? 'PB' : `Piso ${unit.floor}`;

  const statusStyles: Record<string, string> = {
    Disponible: 'text-[#3C7A4D] bg-[rgba(60,122,77,0.12)] border-[rgba(60,122,77,0.25)]',
    Reservado: 'text-[#B37D2C] bg-[rgba(179,125,44,0.12)] border-[rgba(179,125,44,0.25)]',
    Vendido: 'text-[#9B3A3A] bg-[rgba(155,58,58,0.12)] border-[rgba(155,58,58,0.25)]'
  };

  const statusClass = statusStyles[unit.status] ?? 'text-secondary bg-white border-border-subtle';
  const whatsappNumber = contact.whatsapp.replace(/\D/g, '');
  const whatsappText = contact.messageTemplate
    .replace('{unit_code}', unit.code)
    .replace('{unit_type}', unit.type)
    .replace('{unit_area}', String(unit.area))
    .replace('{unit_floor}', String(unit.floor));
  const whatsappMessage = encodeURIComponent(whatsappText);
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      {createPortal(
        <ModalShell
          open
          onClose={onClose}
          overlayClassName="p-4 lg:p-8 items-center"
          backdropClassName="bg-black/60 backdrop-blur-sm"
          panelClassName="relative w-full max-w-[1200px] h-[calc(100dvh-32px)] lg:h-[calc(100dvh-64px)] max-h-[820px] bg-[#F7F5F3] border border-border-subtle rounded-[28px] overflow-hidden shadow-2xl flex flex-col lg:flex-row"
          panelMotionProps={{
            initial: { opacity: 0, y: 20, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 10, scale: 0.98 },
            transition: { duration: 0.4, ease: 'easeOut' }
          }}
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
      {/* LEFT COLUMN - GALLERY */}
      <div className="w-full lg:w-[60%] h-full bg-[#EFECE8] border-r border-border-subtle flex flex-col min-h-0">
        <div className="flex-1 min-h-0 flex items-center justify-center p-6 lg:p-10">
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.img
              key={gallery[activeIndex].label}
              src={gallery[activeIndex].src}
              alt={`${gallery[activeIndex].label} ${unit.code}`}
              className="max-h-full w-full object-contain rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </div>
        </div>
        <div className="shrink-0 px-6 pb-6 lg:px-10 lg:pb-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {gallery.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`flex flex-col gap-2 rounded-2xl border p-2 min-w-[120px] transition-all ${activeIndex === index ? 'border-primary' : 'border-border-subtle'} bg-white`}
              >
                <img src={item.src} alt={item.label} className="h-20 w-full object-cover rounded-xl" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-secondary text-left">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - SALES PANEL */}
      <div className="w-full lg:w-[40%] h-full bg-[#FBF8F4] flex flex-col min-h-0 overflow-hidden">
        <div className="shrink-0 px-6 lg:px-10 pt-6 lg:pt-8 pb-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-secondary">Unidad</p>
          <div className="mt-2 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="font-serif text-[42px] text-primary leading-none">{unit.code}</h3>
              <p className="text-sm text-secondary leading-relaxed">
                {unit.type} · {unit.area} m² · {unit.orientation}
              </p>
            </div>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${statusClass}`}>
              {unit.status}
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 lg:px-10 pb-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 rounded-[24px] border border-border-subtle bg-white p-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-secondary">Superficie</p>
              <p className="text-sm text-primary">{unit.area} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-secondary">Tipología</p>
              <p className="text-sm text-primary">{unit.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-secondary">Orientación</p>
              <p className="text-sm text-primary">{unit.orientation}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-secondary">Piso</p>
              <p className="text-sm text-primary">{floorLabel}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full border border-border-subtle bg-white px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-secondary">
              {unit.bedrooms > 0 ? `${unit.bedrooms} dormitorios` : 'Comercial'}
            </span>
            <span className="inline-flex items-center rounded-full border border-border-subtle bg-white px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-secondary">
              Material disponible
            </span>
          </div>

          {tour360 && (
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-border-subtle bg-white px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-primary transition-colors hover:border-primary"
              onClick={() => setShowTour360(true)}
            >
              Recorrer en 360°
            </button>
          )}
        </div>

        <div className="shrink-0 px-6 lg:px-10 py-5 border-t border-border-subtle bg-[#FBF8F4] flex flex-col gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-full bg-primary text-inverse px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-center transition-opacity hover:opacity-90"
          >
            Consultar por WhatsApp
          </a>
          <button className="w-full rounded-full border border-border-subtle px-6 py-3 text-xs uppercase tracking-[0.24em] text-primary transition-colors hover:border-primary">
            Solicitar presentación
          </button>
          <button className="w-full text-center text-xs uppercase tracking-[0.24em] text-secondary transition-colors hover:text-primary">
            Agendar visita
          </button>
        </div>
      </div>
    </ModalShell>,
        document.body
      )}
      <Tour360Modal open={showTour360} onClose={() => setShowTour360(false)} tour={tour360} />
    </>
  );
}
