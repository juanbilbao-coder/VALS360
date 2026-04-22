import { useMemo } from 'react';
import type { UnitInfo, UnitFilters } from '../types';

export function useUnitFilters(units: UnitInfo[], filters: UnitFilters) {
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      if (filters.type !== 'Todas' && unit.type !== filters.type) return false;
      if (filters.status !== 'Todas' && unit.status !== filters.status) return false;
      if (filters.floor !== 'Todos' && unit.floor !== Number(filters.floor)) return false;
      if (filters.area !== 'Todos') {
        const range = filters.area;
        if (range === '60-80' && (unit.area < 60 || unit.area > 80)) return false;
        if (range === '80-100' && (unit.area < 80 || unit.area > 100)) return false;
        if (range === '100-130' && (unit.area < 100 || unit.area > 130)) return false;
        if (range === '130+' && unit.area < 130) return false;
      }
      return true;
    });
  }, [filters.area, filters.floor, filters.status, filters.type, units]);

  const activeFilterChips = useMemo(() => {
    return [
      filters.type !== 'Todas' ? `Tipo: ${filters.type}` : null,
      filters.status !== 'Todas' ? `Estado: ${filters.status}` : null,
      filters.floor !== 'Todos' ? `Piso: ${filters.floor === '0' ? 'PB' : filters.floor}` : null,
      filters.area !== 'Todos' ? `m²: ${filters.area}` : null
    ].filter(Boolean) as string[];
  }, [filters.area, filters.floor, filters.status, filters.type]);

  return { filteredUnits, activeFilterChips };
}
