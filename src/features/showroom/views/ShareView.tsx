import React from 'react';
import { motion } from 'motion/react';

export default function ShareView() {
  return (
    <motion.div
      key="compartir"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full h-full flex items-start justify-center"
    >
      <div className="share-view">
        <div className="share-header">
          <p className="eyebrow">Compartir</p>
          <h3 className="section-title">Compartí el proyecto</h3>
          <p className="text-secondary leading-relaxed">
            Copiá el link, enviá por WhatsApp o descargá el brochure para presentar VALS 360.
          </p>
        </div>
        <div className="share-actions">
          <button
            className="btn-pildora"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Copiar link
          </button>
          <button className="btn-outline">Compartir por WhatsApp</button>
          <button className="btn-outline">Descargar brochure</button>
        </div>
      </div>
    </motion.div>
  );
}
