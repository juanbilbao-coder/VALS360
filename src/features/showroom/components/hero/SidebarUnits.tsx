import React from 'react';
import type { UnitInfo } from '../../types';

type SidebarUnitsProps = {
  units: UnitInfo[];
  onSelectUnit: (unit: UnitInfo) => void;
};

export default function SidebarUnits({ units, onSelectUnit }: SidebarUnitsProps) {
  if (units.length === 0) {
    return (
      <div className="right-sidebar__panel-empty">
        <span>No hay unidades cargadas para este nivel.</span>
        <span>Podemos mostrarte otras tipologías disponibles desde el proyecto.</span>
      </div>
    );
  }

  const formatCode = (unit: UnitInfo) =>
    unit.code.replace(/^U-?/i, '').replace(/^PH-?/i, 'PH ').replace(/^LOC-?/i, 'LOC ').replace(/^OF-?/i, 'OF ');

  const formatType = (unit: UnitInfo) => (unit.bedrooms > 0 ? `${unit.bedrooms} dorm` : unit.type);

  return (
    <>
      {units.map((unit) => (
        <button
          key={unit.code}
          type="button"
          className={`right-sidebar__unit-card ${
            unit.status === 'Vendido' ? 'right-sidebar__unit-card--sold' : ''
          }`}
          onClick={() => onSelectUnit(unit)}
        >
          <div className="right-sidebar__unit-top">
            <span className="right-sidebar__unit-code">{formatCode(unit)}</span>
            <span className={`status-pill status-${unit.status.toLowerCase()}`}>{unit.status}</span>
          </div>
          <div className="right-sidebar__unit-meta">
            <span>{formatType(unit)}</span>
            <span>{unit.area} m²</span>
          </div>
          <div className="right-sidebar__unit-foot">
            <span>{unit.orientation}</span>
            <span className="right-sidebar__unit-link">Ver ficha</span>
          </div>
        </button>
      ))}
    </>
  );
}
