import type { UnitInfo } from '../types';
import { selectFilterDefaults, selectFilterOptions, selectUnitData } from './selectors';

export const unitData: UnitInfo[] = selectUnitData();

export const filterDefaults = selectFilterDefaults();

export const filterOptions = selectFilterOptions();
