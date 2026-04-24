import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { UnitInfo } from '../types';
import axonometryMock from '../../../../axonometria.jpeg';

type FloorSummary = {
  available: number;
  total: number;
  note?: string;
};

type FloorAxonometryProps = {
  floorLabel: string;
  units: UnitInfo[];
  summary: FloorSummary | null;
  onBack: () => void;
  onSelectUnit: (unit: UnitInfo) => void;
};

type UnitArea = {
  unit: UnitInfo;
  left: number;
  top: number;
  width: number;
  height: number;
};

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function buildUnitAreas(units: UnitInfo[]): UnitArea[] {
  const count = units.length;
  if (count === 0) {
    return [];
  }

  const rows = count <= 3 ? 1 : 2;
  const columns = Math.ceil(count / rows);
  const frameLeft = 17;
  const frameTop = rows === 1 ? 42 : 26;
  const frameWidth = 66;
  const frameHeight = rows === 1 ? 23 : 42;
  const gapX = 1.8;
  const gapY = 2.4;
  const cellWidth = (frameWidth - gapX * (columns - 1)) / columns;
  const cellHeight = (frameHeight - gapY * (rows - 1)) / rows;

  return units.map((unit, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;

    return {
      unit,
      left: frameLeft + column * (cellWidth + gapX),
      top: frameTop + row * (cellHeight + gapY),
      width: cellWidth,
      height: cellHeight
    };
  });
}

function formatUnitMeta(unit: UnitInfo) {
  return `${unit.type} · ${unit.area} m² · ${unit.orientation}`;
}

export default function FloorAxonometry({
  floorLabel,
  units,
  summary,
  onBack,
  onSelectUnit
}: FloorAxonometryProps) {
  const [hoveredUnit, setHoveredUnit] = useState<UnitInfo | null>(null);
  const unitAreas = useMemo(() => buildUnitAreas(units), [units]);
  const hasAxonometry = unitAreas.length > 0;
  const available = summary?.available ?? units.filter((unit) => unit.status === 'Disponible').length;
  const total = summary?.total ?? units.length;

  return (
    <motion.div
      key={`floor-${floorLabel}`}
      className="floor-axono"
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.985 }}
      transition={{ duration: 0.34, ease: 'easeOut' }}
    >
      <header className="floor-axono__header">
        <div>
          <p className="floor-axono__eyebrow">Vista de nivel</p>
          <h3>{floorLabel}</h3>
        </div>
        <p className="floor-axono__summary">
          {available} disponibles de {total}
        </p>
      </header>

      <button type="button" className="floor-axono__back" onClick={onBack}>
        ← Volver al edificio
      </button>

      {hasAxonometry ? (
        <div className="floor-axono__canvas" aria-label={`Axonometría interactiva de ${floorLabel}`}>
          <div className="floor-axono__stage" role="img" aria-label={`Unidades de ${floorLabel}`}>
            <img
              src={axonometryMock}
              alt={`Axonometría de referencia para ${floorLabel}`}
              className="floor-axono__mock-image"
            />

            <div className="floor-axono__units-layer">
              {unitAreas.map(({ unit, left, top, width, height }) => {
              const status = normalizeStatus(unit.status);
              return (
                <button
                  key={unit.code}
                  className={`floor-axono__unit floor-axono__unit--${status}`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`
                  }}
                  aria-label={`${unit.code}, ${formatUnitMeta(unit)}, ${unit.status}`}
                  onPointerEnter={() => setHoveredUnit(unit)}
                  onPointerLeave={() => setHoveredUnit(null)}
                  onFocus={() => setHoveredUnit(unit)}
                  onBlur={() => setHoveredUnit(null)}
                  onClick={() => onSelectUnit(unit)}
                  type="button"
                >
                  <span className="floor-axono__unit-topline" aria-hidden="true" />
                  <span className="floor-axono__unit-code">{unit.code}</span>
                  <span className="floor-axono__unit-meta">{unit.type} · {unit.area} m²</span>
                  <span className="floor-axono__unit-status-badge">{unit.status}</span>
                </button>
              );
            })}
            </div>
          </div>

          {hoveredUnit ? (
            <div className="floor-axono__tooltip">
              <span>{hoveredUnit.code}</span>
              <strong>{hoveredUnit.status}</strong>
              <p>{formatUnitMeta(hoveredUnit)}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="floor-axono__fallback">
          <p>No hay axonometría cargada para este nivel.</p>
          <div className="floor-axono__fallback-list">
            {units.map((unit) => (
              <button key={unit.code} type="button" onClick={() => onSelectUnit(unit)}>
                <span>{unit.code}</span>
                <small>{formatUnitMeta(unit)}</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
