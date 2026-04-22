import type { UnitFilters } from './filters';
import type { UnitInfo } from './units';

export type ProjectFallbackRules = {
  missingRender: 'use_placeholder' | 'hide';
  missingPlan: 'use_placeholder' | 'hide';
  missing360: 'use_placeholder' | 'hide';
};

export type ProjectContact = {
  whatsapp: string;
  messageTemplate: string;
};

export type ProjectInfo = {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  contact: ProjectContact;
};

export type ProjectFloorSummary = {
  available: number;
  total: number;
  note?: string;
};

export type ProjectFloorHotspot = {
  left: number;
  top: number;
  width: number;
  height: number;
  align?: 'left' | 'center' | 'right';
};

export type ProjectFloorStopKind = 'numeric' | 'special';

export type ProjectFloorStop = {
  key: string;
  code: string;
  label: string;
  kind: ProjectFloorStopKind;
  floorNumber?: number;
  navigable: boolean;
  summary: ProjectFloorSummary;
  hotspot?: ProjectFloorHotspot;
};

export type ProjectUnit = UnitInfo & {
  id: string;
  price: number | null;
  features: string[];
  media: NonNullable<UnitInfo['media']>;
};

export type ProjectMedia = {
  heroSlides: string[];
};

export type ProjectProgressPhase = {
  name: string;
  start: number;
  span: number;
  progress: number;
};

export type ProjectProgress = {
  months: string[];
  phases: ProjectProgressPhase[];
  milestones: string[];
};

export type ProjectFilterConfig = {
  defaults: UnitFilters;
  options: Record<keyof UnitFilters, string[]>;
};

export type ProjectRules = {
  hideNonNavigableFloors: boolean;
  showSoldUnits: boolean;
  ctaPrimary: 'whatsapp' | 'contact';
  fallbacks: ProjectFallbackRules;
};

export type ProjectPayload = {
  project: ProjectInfo;
  media: ProjectMedia;
  floors: ProjectFloorStop[];
  units: ProjectUnit[];
  filters: ProjectFilterConfig;
  progress: ProjectProgress;
  rules: ProjectRules;
};
