import { useMemo } from 'react';
import type { UnitInfo } from '../types';
import {
  selectSidebarSummaryByKey,
  selectSortedUnitsForCommercialList,
  selectUnitsForFloorKey
} from '../data/selectors';

type UseSidebarFloorOptions = {
  selectedFloor: string | null;
  hoveredFloor: string | null;
  units: UnitInfo[];
};

export function useSidebarFloor({ selectedFloor, hoveredFloor, units }: UseSidebarFloorOptions) {
  // Hover only drives the facade highlight. Unit data is derived from the clicked floor.
  void hoveredFloor;
  const activeFloor = selectedFloor ?? null;
  const floorKey = activeFloor;

  const floorUnits = useMemo(() => {
    return selectSortedUnitsForCommercialList(selectUnitsForFloorKey(floorKey, units));
  }, [floorKey, units]);

  const floorSummary = useMemo(() => {
    if (!floorKey) {
      return null;
    }

    const explicitSummary = selectSidebarSummaryByKey(floorKey);
    if (explicitSummary) {
      return explicitSummary;
    }

    return {
      available: floorUnits.filter((unit) => unit.status === 'Disponible').length,
      total: floorUnits.length,
      note: floorUnits.length > 0 ? 'Unidades disponibles para explorar' : 'Sin unidades cargadas'
    };
  }, [floorKey, floorUnits]);

  return {
    activeFloor,
    floorUnits,
    floorSummary
  };
}
