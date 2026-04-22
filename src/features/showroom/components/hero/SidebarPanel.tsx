import React, { useMemo } from 'react';
import type { UnitInfo } from '../../types';
import { selectFloorLabelByKey } from '../../data/selectors';
import SidebarUnits from './SidebarUnits';
import SidebarActions from './SidebarActions';

type SidebarSummary = {
  available: number;
  total: number;
  note?: string;
};

type SidebarPanelProps = {
  logo: React.ReactNode;
  sidebarFloorKey: string | null;
  sidebarSummary: SidebarSummary | null;
  sidebarUnits: UnitInfo[];
  onSelectUnit: (unit: UnitInfo) => void;
};

export default function SidebarPanel({
  logo,
  sidebarFloorKey,
  sidebarSummary,
  sidebarUnits,
  onSelectUnit
}: SidebarPanelProps) {
  const floorLabel = useMemo(() => selectFloorLabelByKey(sidebarFloorKey), [sidebarFloorKey]);
  const unitBreakdown = useMemo(() => {
    const available = sidebarUnits.filter((unit) => unit.status === 'Disponible').length;
    const reserved = sidebarUnits.filter((unit) => unit.status === 'Reservado').length;
    const sold = sidebarUnits.filter((unit) => unit.status === 'Vendido').length;
    return [
      { label: 'Disponibles', value: available, tone: 'available' },
      { label: 'Reservadas', value: reserved, tone: 'reserved' },
      { label: 'Vendidas', value: sold, tone: 'sold' }
    ].filter((item) => item.value > 0);
  }, [sidebarUnits]);

  return (
    <aside className={`right-sidebar ${sidebarFloorKey ? 'right-sidebar--expanded' : ''}`}>
      <div className="right-sidebar__logo">
        {logo}
      </div>

      <div className={`right-sidebar__panel ${sidebarFloorKey ? 'is-visible' : ''}`}>
        {sidebarFloorKey ? (
          <>
            <div className="right-sidebar__panel-head">
              <p className="eyebrow">Selección de unidades</p>
              <h4>{floorLabel.toUpperCase()}</h4>
              {sidebarSummary && (
                <p className="right-sidebar__panel-meta">
                  {sidebarSummary.available} disponibles de {sidebarSummary.total}
                </p>
              )}
              {sidebarSummary?.note && (
                <p className="right-sidebar__panel-note">{sidebarSummary.note}</p>
              )}
              <p className="right-sidebar__panel-caption">
                Seleccioná una unidad para abrir la ficha y consultar con el equipo comercial.
              </p>
              {unitBreakdown.length > 0 && (
                <div className="right-sidebar__panel-breakdown">
                  {unitBreakdown.map((item) => (
                    <span
                      key={item.label}
                      className={`right-sidebar__summary-pill right-sidebar__summary-pill--${item.tone}`}
                    >
                      {item.value} {item.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="right-sidebar__panel-list">
              <SidebarUnits units={sidebarUnits} onSelectUnit={onSelectUnit} />
            </div>
          </>
        ) : (
          <p className="right-sidebar__panel-hint">Pasá por un piso para ver unidades.</p>
        )}
      </div>

      <SidebarActions />
    </aside>
  );
}
