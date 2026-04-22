import React from 'react';
import { AnimatePresence } from 'motion/react';
import type { HeroView } from '../../types';
import { viewRegistry, type ViewRenderProps } from '../../config/viewRegistry';

type ShowroomViewsProps = ViewRenderProps & {
  rightView: HeroView;
};

export default function ShowroomViews({
  rightView,
  showBuildingVideo,
  canPlayBuildingVideo,
  buildingVideoRef,
  onVideoEnded,
  onVideoError,
  selectedFloor,
  hoveredFloor,
  onSelectFloor,
  onBackToBuilding,
  onHoverFloor,
  floorUnits,
  floorSummary,
  isLobbyOpen,
  navigationStops,
  onToggleLobby,
  onCloseLobby,
  onSelectNavigationStop,
  filters,
  onChangeFilters,
  onResetFilters,
  activeFilterChips,
  units,
  onSelectUnit
}: ShowroomViewsProps) {
  const ActiveView = viewRegistry[rightView];
  return (
    <AnimatePresence mode="wait">
      {ActiveView({
        showBuildingVideo,
        canPlayBuildingVideo,
        buildingVideoRef,
        onVideoEnded,
        onVideoError,
        selectedFloor,
        hoveredFloor,
        onSelectFloor,
        onBackToBuilding,
        onHoverFloor,
        floorUnits,
        floorSummary,
        isLobbyOpen,
        navigationStops,
        onToggleLobby,
        onCloseLobby,
        onSelectNavigationStop,
        filters,
        onChangeFilters,
        onResetFilters,
        activeFilterChips,
        units,
        onSelectUnit
      })}
    </AnimatePresence>
  );
}
