import React from 'react';
import { motion } from 'motion/react';

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
          <p className="location-text">
            <span className="location-title">UBICADO</span> en una esquina céntrica de la ciudad, en calle
            Libertad y Sarmiento. Un punto estratégico con inmejorables accesos: zona comercial y de
            servicios, a pocos minutos de clínicas, colegios y bancos. Además, si lo que necesitás es
            contacto con la naturaleza, el Paseo del Riel se encuentra a pocos pasos de tu residencia.
          </p>
        </div>

        <div className="location-map">
          <div className="location-marker">
            <span className="location-mark">V</span>
            <span className="location-line"></span>
          </div>
          <div className="location-map-frame">
            <img src="/ubicacion-map.svg" alt="Mapa de ubicación VALS 360" />
          </div>
          <a
            className="btn-outline location-map-cta"
            href="https://www.google.com/maps/search/?api=1&query=Libertad%20y%20Sarmiento%2C%20R%C3%ADo%20Tercero%2C%20C%C3%B3rdoba"
            target="_blank"
            rel="noreferrer"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>
    </motion.div>
  );
}
