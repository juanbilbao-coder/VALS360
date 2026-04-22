import React from 'react';
import { motion } from 'motion/react';
import { ganttMonths, ganttPhases, ganttMilestones } from '../data/progress';
import { heroSlides } from '../data/media';

export default function ProgressView() {
  return (
    <motion.div
      key="avances"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full h-full flex items-start justify-center"
    >
      <div className="gantt-view gantt-view--shifted">
        <div className="gantt-header">
          <p className="eyebrow">Avances de obra</p>
          <h3 className="section-title">Estado de obra</h3>
          <p className="text-secondary leading-relaxed">
            Etapas, tiempos y evolución en una lectura simple y clara.
          </p>
        </div>

        <div className="gantt-grid">
          <div className="gantt-months">
            {ganttMonths.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          <div className="gantt-rows">
            {ganttPhases.map((phase) => (
              <div key={phase.name} className="gantt-row">
                <div className="gantt-label">{phase.name}</div>
                <div className="gantt-track">
                  <div
                    className="gantt-bar"
                    style={{ gridColumn: `${phase.start + 1} / span ${phase.span}` }}
                  >
                    <span className="gantt-progress" style={{ width: `${phase.progress * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gantt-milestones">
          <div>
            <p className="eyebrow">Hitos recientes</p>
            <ul>
              {ganttMilestones.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="gantt-gallery">
            {heroSlides.slice(0, 3).map((src) => (
              <img key={src} src={src} alt="Avance de obra" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
