import { useEffect, useMemo, useState } from 'react';
import { filterDefaults, unitData } from '../data/units';
import { selectNavigationStops } from '../data/selectors';
import type { HeroView, UnitFilters, UnitInfo } from '../types';
import { useSidebarFloor } from './useSidebarFloor';
import { useUnitFilters } from './useUnitFilters';

export function useShowroomStateCore() {
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const [rightView, setRightView] = useState<HeroView>('proyecto');
  const [filters, setFilters] = useState<UnitFilters>({ ...filterDefaults });
  const [selectedUnit, setSelectedUnit] = useState<UnitInfo | null>(null);
  const [isLobbyOpen, setIsLobbyOpen] = useState(false);

  const isProjectView = rightView === 'proyecto';
  const { filteredUnits, activeFilterChips } = useUnitFilters(unitData, filters);
  const { floorUnits, floorSummary } = useSidebarFloor({
    selectedFloor,
    hoveredFloor,
    units: unitData
  });
  const navigationStops = useMemo(() => selectNavigationStops(), []);

  const selectNavigationStop = (floorKey: string) => {
    setHoveredFloor(null);
    setSelectedFloor(floorKey);
    setIsLobbyOpen(false);
  };

  const selectFloor = (floor: string) => {
    setIsLobbyOpen(false);
    setSelectedFloor(floor);
  };

  const clearFloor = () => {
    setHoveredFloor(null);
    setSelectedFloor(null);
    setIsLobbyOpen(false);
  };

  const hoverFloor = (floor: string | null) => {
    setHoveredFloor(floor);
  };

  const resetFilters = () => setFilters({ ...filterDefaults });
  const toggleLobby = () => setIsLobbyOpen((prev) => !prev);
  const closeLobby = () => setIsLobbyOpen(false);

  useEffect(() => {
    if (rightView !== 'proyecto') {
      setIsLobbyOpen(false);
    }
  }, [rightView]);

  return {
    rightView,
    setRightView,
    isProjectView,
    selectedFloor,
    setSelectedFloor,
    hoveredFloor,
    setHoveredFloor,
    selectFloor,
    clearFloor,
    hoverFloor,
    floorUnits,
    floorSummary,
    navigationStops,
    filters,
    setFilters,
    resetFilters,
    activeFilterChips,
    filteredUnits,
    selectedUnit,
    setSelectedUnit,
    isLobbyOpen,
    setIsLobbyOpen,
    toggleLobby,
    closeLobby,
    selectNavigationStop
  };
}
