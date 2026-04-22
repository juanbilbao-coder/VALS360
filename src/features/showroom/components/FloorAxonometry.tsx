import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { UnitInfo } from '../types';

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
  points: string;
  labelX: number;
  labelY: number;
};

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 560;

function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

function buildUnitAreas(units: UnitInfo[]): UnitArea[] {
  const count = units.length;
  if (count === 0) {
    return [];
  }

  const rows = count > 4 ? 2 : 1;
  const columns = Math.ceil(count / rows);
  const gap = 18;
  const startX = 120;
  const startY = rows === 1 ? 170 : 115;
  const totalWidth = 760;
  const totalHeight = rows === 1 ? 240 : 330;
  const cellWidth = (totalWidth - gap * (columns - 1)) / columns;
  const cellHeight = (totalHeight - gap * (rows - 1)) / rows;
  const skew = 38;
  const depth = 26;

  return units.map((unit, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const rowOffset = row * 28;
    const x = startX + column * (cellWidth + gap) + rowOffset;
    const y = startY + row * (cellHeight + gap);
    const points = [
      `${x + skew},${y}`,
      `${x + cellWidth},${y + depth}`,
      `${x + cellWidth - skew},${y + cellHeight}`,
      `${x},${y + cellHeight - depth}`
    ].join(' ');

    return {
      unit,
      points,
      labelX: x + cellWidth / 2,
      labelY: y + cellHeight / 2
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
          <svg viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} role="img" aria-label={`Unidades de ${floorLabel}`}>
            <defs>
              <linearGradient id="floorAxonoPlate" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#F7F5F3" />
                <stop offset="100%" stopColor="#E6DED2" />
              </linearGradient>
            </defs>

            <polygon
              points="90,390 500,110 920,250 515,510"
              fill="url(#floorAxonoPlate)"
              stroke="rgba(120,95,55,0.24)"
              strokeWidth="2"
            />
            <polyline
              points="110,390 500,140 900,255"
              fill="none"
              stroke="rgba(120,95,55,0.16)"
              strokeWidth="2"
            />

            {unitAreas.map(({ unit, points, labelX, labelY }) => {
              const status = normalizeStatus(unit.status);
              return (
                <g
                  key={unit.code}
                  className={`floor-axono__unit floor-axono__unit--${status}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${unit.code}, ${formatUnitMeta(unit)}, ${unit.status}`}
                  onPointerEnter={() => setHoveredUnit(unit)}
                  onPointerLeave={() => setHoveredUnit(null)}
                  onFocus={() => setHoveredUnit(unit)}
                  onBlur={() => setHoveredUnit(null)}
                  onClick={() => onSelectUnit(unit)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectUnit(unit);
                    }
                  }}
                >
                  <polygon points={points} />
                  <text x={labelX} y={labelY - 8} textAnchor="middle" aria-hidden="true">
                    {unit.code}
                  </text>
                  <text x={labelX} y={labelY + 18} textAnchor="middle" className="floor-axono__unit-status" aria-hidden="true">
                    {unit.status}
                  </text>
                </g>
              );
            })}
          </svg>

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
