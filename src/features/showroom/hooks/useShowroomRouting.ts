import { useCallback, useEffect, useRef } from 'react';
import { selectFloorKeyForUnit, selectIsValidFloorKey, selectUnitByCode } from '../data/selectors';
import type { UnitInfo } from '../types';

type UseShowroomRoutingParams = {
  selectedFloor: string | null;
  selectedUnit: UnitInfo | null;
  setSelectedFloor: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedUnit: React.Dispatch<React.SetStateAction<UnitInfo | null>>;
  setHoveredFloor: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useShowroomRouting({
  selectedFloor,
  selectedUnit,
  setSelectedFloor,
  setSelectedUnit,
  setHoveredFloor
}: UseShowroomRoutingParams) {
  const suppressUrlSyncRef = useRef(false);

  const applyStateFromPath = useCallback((path: string, replaceInvalid = false) => {
    const normalized = path.replace(/\/+$/, '') || '/';
    let nextFloor: string | null = null;
    let nextUnit: UnitInfo | null = null;

    if (normalized.startsWith('/unit/')) {
      const unitId = decodeURIComponent(normalized.slice('/unit/'.length));
      if (unitId) {
        const match = selectUnitByCode(unitId);
        if (match) {
          nextUnit = match;
          nextFloor = selectFloorKeyForUnit(match);
        }
      }
    } else if (normalized.startsWith('/floor/')) {
      const floorId = decodeURIComponent(normalized.slice('/floor/'.length));
      if (floorId && selectIsValidFloorKey(floorId)) {
        nextFloor = floorId;
      }
    }

    if (!nextFloor && !nextUnit && normalized !== '/') {
      if (replaceInvalid) {
        window.history.replaceState(null, '', '/');
      }
    }

    suppressUrlSyncRef.current = true;
    setSelectedFloor(nextFloor);
    setSelectedUnit(nextUnit);
    setHoveredFloor(null);
    window.setTimeout(() => {
      suppressUrlSyncRef.current = false;
    }, 0);
  }, [setHoveredFloor, setSelectedFloor, setSelectedUnit]);

  useEffect(() => {
    applyStateFromPath(window.location.pathname, true);
  }, [applyStateFromPath]);

  useEffect(() => {
    const handlePopState = () => {
      applyStateFromPath(window.location.pathname, true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [applyStateFromPath]);

  useEffect(() => {
    if (suppressUrlSyncRef.current) {
      return;
    }
    const nextPath = selectedUnit
      ? `/unit/${encodeURIComponent(selectedUnit.code)}`
      : selectedFloor
        ? `/floor/${encodeURIComponent(selectedFloor)}`
        : '/';

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
  }, [selectedFloor, selectedUnit]);
}
