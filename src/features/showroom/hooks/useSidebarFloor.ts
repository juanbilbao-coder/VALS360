import { useMemo } from 'react';
import type { UnitInfo } from '../types';
import {
  selectFloorOrder,
  selectSidebarSummaryByKey,
  selectSortedUnitsForCommercialList,
  selectUnitsForFloorKey
} from '../data/selectors';

type FloorSummaries = Record<string, { available: number; total: number; note?: string }>;

type UseSidebarFloorOptions = {
  selectedFloor: string | null;
  hoveredFloor: string | null;
  units: UnitInfo[];
  floorSummaries: FloorSummaries;
};

export function useSidebarFloor({ selectedFloor, hoveredFloor, units, floorSummaries }: UseSidebarFloorOptions) {
  const floorOrder = useMemo(() => selectFloorOrder(), []);

  const activeFloor = hoveredFloor ?? selectedFloor ?? null;
  const sidebarFloorKey = activeFloor;
  const sidebarFloorNumber = sidebarFloorKey && /^\d+$/.test(sidebarFloorKey) ? Number(sidebarFloorKey) : null;

  const sidebarUnits = useMemo(() => {
    return selectSortedUnitsForCommercialList(selectUnitsForFloorKey(sidebarFloorKey, units));
  }, [sidebarFloorKey, units]);

  const sidebarSummary = useMemo(() => {
    if (!sidebarFloorKey) {
      return null;
    }

    const explicitSummary = floorSummaries[sidebarFloorKey] ?? selectSidebarSummaryByKey(sidebarFloorKey);
    if (explicitSummary) {
      return explicitSummary;
    }

    return {
      available: sidebarUnits.filter((unit) => unit.status === 'Disponible').length,
      total: sidebarUnits.length,
      note: sidebarUnits.length > 0 ? 'Unidades disponibles para explorar' : 'Sin unidades cargadas'
    };
  }, [floorSummaries, sidebarFloorKey, sidebarUnits]);

  return {
    floorOrder,
    activeFloor,
    sidebarFloorKey,
    sidebarFloorNumber,
    sidebarUnits,
    sidebarSummary
  };
}
