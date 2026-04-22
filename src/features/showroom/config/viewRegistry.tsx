import React from 'react';
import ProjectView from '../views/ProjectView';
import ProgressView from '../views/ProgressView';
import UnitsView from '../views/UnitsView';
import LocationView from '../views/LocationView';
import ShareView from '../views/ShareView';
import type { HeroView, UnitFilters, UnitInfo } from '../types';

export type ViewRenderProps = {
  showBuildingVideo: boolean;
  canPlayBuildingVideo: boolean;
  buildingVideoRef: React.RefObject<HTMLVideoElement>;
  onVideoEnded: () => void;
  onVideoError: () => void;
  selectedFloor: string | null;
  hoveredFloor: string | null;
  onSelectFloor: (floor: string) => void;
  onBackToBuilding: () => void;
  onHoverFloor: (floor: string | null) => void;
  floorUnits: UnitInfo[];
  floorSummary: { available: number; total: number; note?: string } | null;
  isLobbyOpen: boolean;
  navigationStops: Array<{ key: string; label: string }>;
  onToggleLobby: () => void;
  onCloseLobby: () => void;
  onSelectNavigationStop: (floor: string) => void;
  filters: UnitFilters;
  onChangeFilters: React.Dispatch<React.SetStateAction<UnitFilters>>;
  onResetFilters: () => void;
  activeFilterChips: string[];
  units: UnitInfo[];
  onSelectUnit: (unit: UnitInfo) => void;
};

type ViewRenderer = (props: ViewRenderProps) => React.ReactElement;

export const viewRegistry: Record<HeroView, ViewRenderer> = {
  proyecto: (props) => (
    <ProjectView
      key="proyecto"
      showBuildingVideo={props.showBuildingVideo}
      canPlayBuildingVideo={props.canPlayBuildingVideo}
      buildingVideoRef={props.buildingVideoRef}
      onVideoEnded={props.onVideoEnded}
      onVideoError={props.onVideoError}
      selectedFloor={props.selectedFloor}
      hoveredFloor={props.hoveredFloor}
      onSelectFloor={props.onSelectFloor}
      onBackToBuilding={props.onBackToBuilding}
      onHoverFloor={props.onHoverFloor}
      floorUnits={props.floorUnits}
      floorSummary={props.floorSummary}
      onSelectUnit={props.onSelectUnit}
      isLobbyOpen={props.isLobbyOpen}
      navigationStops={props.navigationStops}
      onToggleLobby={props.onToggleLobby}
      onCloseLobby={props.onCloseLobby}
      onSelectNavigationStop={props.onSelectNavigationStop}
    />
  ),
  avances: () => <ProgressView key="avances" />,
  unidades: (props) => (
    <UnitsView
      key="unidades"
      filters={props.filters}
      onChangeFilters={props.onChangeFilters}
      onResetFilters={props.onResetFilters}
      activeFilterChips={props.activeFilterChips}
      units={props.units}
      onSelectUnit={props.onSelectUnit}
    />
  ),
  ubicacion: () => <LocationView key="ubicacion" />,
  compartir: () => <ShareView key="compartir" />
};
