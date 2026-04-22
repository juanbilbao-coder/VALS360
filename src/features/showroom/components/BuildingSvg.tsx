import React, { useMemo } from 'react';
import { selectBuildingHotspots } from '../data/selectors';
import buildingIllustration from '../assets/imagentomas-illustracion.png';

type BuildingSvgProps = {
  selectedFloor: string | null;
  hoveredFloor: string | null;
  onSelectFloor: (floor: string) => void;
  onHoverFloor?: (floor: string | null) => void;
};

export default function BuildingSvg({
  selectedFloor,
  hoveredFloor,
  onSelectFloor,
  onHoverFloor
}: BuildingSvgProps) {
  const hotspots = useMemo(() => selectBuildingHotspots(), []);

  return (
    <div className="building-stage building-stage--lift relative h-full w-full min-h-0 overflow-hidden">
      <img
        src={buildingIllustration}
        alt="Vista del edificio VALS 360"
        className="building-stage__illustration pointer-events-none absolute inset-0 z-0 h-full w-full select-none object-cover"
        draggable={false}
      />

      <div className="building-hotspots absolute inset-0 z-20">
        {hotspots.map((stop) => {
          const isSelected = selectedFloor === stop.key;
          const isHovered = hoveredFloor === stop.key;
          const align = stop.hotspot.align ?? 'left';

          return (
            <button
              key={stop.key}
              type="button"
              className={`building-hotspot building-hotspot--${align} ${isSelected ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                left: `${stop.hotspot.left}%`,
                top: `${stop.hotspot.top}%`,
                width: `${stop.hotspot.width}%`,
                height: `${stop.hotspot.height}%`
              }}
              onPointerEnter={() => onHoverFloor?.(stop.key)}
              onPointerLeave={() => onHoverFloor?.(null)}
              onFocus={() => onHoverFloor?.(stop.key)}
              onBlur={() => onHoverFloor?.(null)}
              onClick={() => onSelectFloor(stop.key)}
              aria-label={`Ver ${stop.label}`}
            >
              <span className="building-hotspot__bubble">{`Ver ${stop.label}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
