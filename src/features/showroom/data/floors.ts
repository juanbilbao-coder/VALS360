import {
  selectBuildingFloorCount,
  selectFloorSummaries,
  selectSpecialFloorStops,
  selectUnitsByFloor
} from './selectors';

export const buildingFloorCount = selectBuildingFloorCount();

export const specialFloorStops = selectSpecialFloorStops();

export const unitsByFloor = selectUnitsByFloor();

export const floorSummaries = selectFloorSummaries();
