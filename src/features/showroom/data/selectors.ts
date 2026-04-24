import type { ProjectFloorStop, ProjectFloorSummary, ProjectPayload, ProjectUnit, UnitInfo } from '../types';
import { vals360ProjectPayload } from './project/vals360';

const activeProjectPayload = vals360ProjectPayload;

const numericFloorStops = activeProjectPayload.floors.filter((floor) => floor.kind === 'numeric');
const specialFloorStops = activeProjectPayload.floors.filter((floor) => floor.kind === 'special');
const floorStopsByKey = new Map(activeProjectPayload.floors.map((floor) => [floor.key, floor]));
const unitStatusOrder: Record<string, number> = {
  Disponible: 0,
  Reservado: 1,
  Vendido: 2
};

export function selectProjectPayload(): ProjectPayload {
  return activeProjectPayload;
}

export function selectProjectInfo() {
  return activeProjectPayload.project;
}

export function selectProjectContact() {
  return activeProjectPayload.project.contact;
}

export function selectHeroSlides() {
  return activeProjectPayload.media.heroSlides;
}

export function selectUnitData(): ProjectUnit[] {
  return activeProjectPayload.units;
}

export function selectUnitByCode(unitCode: string) {
  return activeProjectPayload.units.find((unit) => unit.code === unitCode) ?? null;
}

export function selectFloorKeyForUnit(unit: UnitInfo | null | undefined) {
  if (!unit) {
    return null;
  }

  if (unit.levelKey) {
    return unit.levelKey;
  }

  if (unit.floor > 0) {
    return String(unit.floor);
  }

  const normalizedType = unit.type.toLowerCase();
  if (normalizedType === 'local') {
    return 'local';
  }
  if (normalizedType === 'coworking') {
    return 'coworking';
  }

  return null;
}

export function selectFloorStopByKey(floorKey: string | null | undefined): ProjectFloorStop | null {
  if (!floorKey) {
    return null;
  }
  return floorStopsByKey.get(floorKey) ?? null;
}

export function selectFloorLabelByKey(floorKey: string | null | undefined) {
  return selectFloorStopByKey(floorKey)?.label ?? '';
}

export function selectNavigationStops() {
  return activeProjectPayload.floors
    .filter((floor) => floor.navigable)
    .map((floor) => ({
      key: floor.key,
      label: floor.label,
      composition: floor.lobbyComposition
    }));
}

export function selectBuildingHotspots() {
  return activeProjectPayload.floors
    .filter((floor) => floor.navigable && floor.hotspot)
    .map((floor) => ({
      key: floor.key,
      label: floor.label,
      hotspot: floor.hotspot!
    }));
}

export function selectFloorOrder() {
  return numericFloorStops
    .map((floor) => floor.floorNumber ?? 0)
    .filter((floorNumber) => floorNumber > 0)
    .sort((left, right) => left - right);
}

export function selectIsValidFloorKey(floorKey: string | null | undefined) {
  return Boolean(selectFloorStopByKey(floorKey));
}

export function selectUnitsForFloorKey(floorKey: string | null | undefined, units: UnitInfo[] = activeProjectPayload.units) {
  const floorStop = selectFloorStopByKey(floorKey);
  if (!floorStop) {
    return [];
  }

  const unitsByLevelKey = units.filter((unit) => unit.levelKey === floorStop.key);
  if (unitsByLevelKey.length > 0) {
    return unitsByLevelKey;
  }

  if (floorStop.kind === 'numeric') {
    return units.filter((unit) => unit.floor === floorStop.floorNumber);
  }

  const normalizedStopLabel = floorStop.label.toLowerCase();
  return units.filter((unit) => unit.type.toLowerCase() === normalizedStopLabel);
}

export function selectSortedUnitsForCommercialList(units: UnitInfo[]) {
  return units
    .slice()
    .sort((left, right) => {
      const statusDiff = (unitStatusOrder[left.status] ?? 99) - (unitStatusOrder[right.status] ?? 99);
      if (statusDiff !== 0) {
        return statusDiff;
      }

      const bedroomDiff = (right.bedrooms ?? 0) - (left.bedrooms ?? 0);
      if (bedroomDiff !== 0) {
        return bedroomDiff;
      }

      const areaDiff = right.area - left.area;
      if (areaDiff !== 0) {
        return areaDiff;
      }

      return left.code.localeCompare(right.code, undefined, { numeric: true, sensitivity: 'base' });
    });
}

export function selectSidebarSummaryByKey(floorKey: string | null | undefined) {
  return selectFloorStopByKey(floorKey)?.summary ?? null;
}

export function selectSidebarPreviewImage(units: UnitInfo[]) {
  return selectSortedUnitsForCommercialList(units).find((unit) => unit.media?.render)?.media?.render ?? activeProjectPayload.media.heroSlides[0];
}

export function selectFilterDefaults() {
  return { ...activeProjectPayload.filters.defaults };
}

export function selectFilterOptions() {
  const typeOptions = Array.from(new Set(activeProjectPayload.units.map((unit) => unit.type))).sort((left, right) =>
    left.localeCompare(right)
  );
  const statusOptions = Array.from(new Set(activeProjectPayload.units.map((unit) => unit.status)));
  const floorOptions = Array.from(
    new Set(
      activeProjectPayload.units
        .map((unit) => unit.floor)
        .filter((floor) => floor >= 0)
        .map((floor) => String(floor))
    )
  ).sort((left, right) => Number(left) - Number(right));

  return {
    ...activeProjectPayload.filters.options,
    type: ['Todas', ...typeOptions],
    status: ['Todas', ...statusOptions],
    floor: ['Todos', ...floorOptions]
  };
}

export function selectBuildingFloorCount() {
  return numericFloorStops.length;
}

export function selectSpecialFloorStops() {
  return specialFloorStops.map((floor) => floor.key);
}

export function selectUnitsByFloor() {
  return activeProjectPayload.units.reduce<Record<number, number>>((accumulator, unit) => {
    if (unit.floor > 0) {
      accumulator[unit.floor] = (accumulator[unit.floor] ?? 0) + 1;
    }
    return accumulator;
  }, {});
}

export function selectFloorSummaries() {
  return activeProjectPayload.floors.reduce<Record<string, ProjectFloorSummary>>((accumulator, floor) => {
    accumulator[floor.key] = floor.summary;
    return accumulator;
  }, {});
}

export function selectProgressMonths() {
  return activeProjectPayload.progress.months;
}

export function selectProgressPhases() {
  return activeProjectPayload.progress.phases;
}

export function selectProgressMilestones() {
  return activeProjectPayload.progress.milestones;
}

export function selectProgressGallery() {
  return activeProjectPayload.progress.gallery;
}
