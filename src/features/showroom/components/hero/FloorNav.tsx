import React from 'react';

type FloorNavProps = {
  sidebarFloorNumber: number | null;
  floorOrder: number[];
  onSetFloor: (floor: number) => void;
};

export default function FloorNav({
  sidebarFloorNumber,
  floorOrder,
  onSetFloor
}: FloorNavProps) {
  if (sidebarFloorNumber === null) {
    return null;
  }

  const idx = floorOrder.indexOf(sidebarFloorNumber);
  const canGoUp = idx > 0;
  const canGoDown = idx >= 0 && idx < floorOrder.length - 1;

  return (
    <div className="right-sidebar__panel-nav">
      <button
        type="button"
        className="sidebar-step-btn"
        onClick={() => {
          if (idx > 0) {
            onSetFloor(floorOrder[idx - 1]);
          }
        }}
        disabled={!canGoUp}
        aria-label="Ir al piso anterior"
      >
        <span className="sidebar-step-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M5 17h4v-3h4v-3h4V8h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 8l-2-2m2 2l-2 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <button
        type="button"
        className="sidebar-step-btn"
        onClick={() => {
          if (idx >= 0 && idx < floorOrder.length - 1) {
            onSetFloor(floorOrder[idx + 1]);
          }
        }}
        disabled={!canGoDown}
        aria-label="Ir al piso siguiente"
      >
        <span className="sidebar-step-icon sidebar-step-icon--down" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M5 7h4v3h4v3h4v3h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 16l-2-2m2 2l-2 2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
