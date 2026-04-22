import React from 'react';
import { motion } from 'motion/react';
import { filterOptions } from '../data/units';
import type { UnitInfo, UnitFilters } from '../types';

type UnitsViewProps = {
  filters: UnitFilters;
  onChangeFilters: React.Dispatch<React.SetStateAction<UnitFilters>>;
  onResetFilters: () => void;
  activeFilterChips: string[];
  units: UnitInfo[];
  onSelectUnit: (unit: UnitInfo) => void;
};

export default function UnitsView({
  filters,
  onChangeFilters,
  onResetFilters,
  activeFilterChips,
  units,
  onSelectUnit
}: UnitsViewProps) {
  return (
    <motion.div
      key="unidades"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full h-full flex items-start justify-center"
    >
      <div className="units-view">
        <div className="units-header">
          <p className="eyebrow">Explorar unidades</p>
          <h3 className="section-title">Disponibilidad comercial</h3>
          <p className="text-secondary leading-relaxed">
            Filtrá por tipología, piso, superficie y estado para encontrar la unidad ideal.
          </p>
        </div>

        <div className="units-filters">
          <select
            value={filters.type}
            onChange={(event) => onChangeFilters((prev) => ({ ...prev, type: event.target.value }))}
          >
            {filterOptions.type.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) => onChangeFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            {filterOptions.status.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            value={filters.floor}
            onChange={(event) => onChangeFilters((prev) => ({ ...prev, floor: event.target.value }))}
          >
            {filterOptions.floor.map((item) => (
              <option key={item} value={item}>{item === '0' ? 'PB' : item}</option>
            ))}
          </select>
          <select
            value={filters.area}
            onChange={(event) => onChangeFilters((prev) => ({ ...prev, area: event.target.value }))}
          >
            {filterOptions.area.map((item) => (
              <option key={item} value={item}>{item} m²</option>
            ))}
          </select>
          <button className="btn-outline" onClick={onResetFilters}>
            Limpiar filtros
          </button>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="units-chips">
            {activeFilterChips.map((chip) => (
              <span key={chip} className="pill">{chip}</span>
            ))}
          </div>
        )}

        <div className="units-list">
          {units.map((unit) => (
            <div key={unit.code} className="unit-card">
              <div>
                <h4 className="unit-title">{unit.code}</h4>
                <p className="unit-meta">{unit.type} · {unit.area} m² · {unit.orientation}</p>
              </div>
              <div className="unit-actions">
                <span className={`status-pill status-${unit.status.toLowerCase()}`}>{unit.status}</span>
                <button className="btn-link" onClick={() => onSelectUnit(unit)}>Ver ficha</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
