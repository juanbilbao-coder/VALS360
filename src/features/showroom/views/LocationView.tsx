import React from 'react';
import { motion } from 'motion/react';
import mapaImage from '../../../../mapa.png';

export default function LocationView() {
  return (
    <motion.div
      key="ubicacion"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full h-full flex items-start justify-center"
    >
      <div className="location-view">
        <div className="location-copy">
          <h3 className="location-heading">Ubicado en una esquina estratégica de Río Tercero.</h3>
          <div className="location-copy__body">
            <p className="location-text">
              Sobre Libertad y Sarmiento, VALS 360 conecta vida urbana, servicios y espacios verdes en
              una ubicación central con acceso inmediato a comercios, clínicas, colegios y bancos.
            </p>
            <a
              className="btn-outline location-copy-cta"
              href="https://www.google.com/maps/search/?api=1&query=Libertad%20y%20Sarmiento%2C%20R%C3%ADo%20Tercero%2C%20C%C3%B3rdoba"
              target="_blank"
              rel="noreferrer"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>

        <div className="location-map">
          <div className="location-map-frame">
            <img src={mapaImage} alt="Mapa de ubicación VALS 360" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
