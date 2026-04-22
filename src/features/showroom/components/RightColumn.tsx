import React from 'react';
import HeroNavigation from './hero/HeroNavigation';
import RightSidebarLogo from './hero/RightSidebarLogo';
import SidebarPanel from './hero/SidebarPanel';
import ShowroomViews from './hero/ShowroomViews';
import type { HeroView, UnitFilters, UnitInfo } from '../types';

type SidebarSummary = {
  available: number;
  total: number;
  note?: string;
};

type RightColumnProps = {
  navigation: {
    rightView: HeroView;
    onChangeView: (view: HeroView) => void;
    isProjectView: boolean;
    showBuildingVideo: boolean;
  };
  building: {
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
    floorSummary: SidebarSummary | null;
    isLobbyOpen: boolean;
    navigationStops: Array<{ key: string; label: string }>;
    onToggleLobby: () => void;
    onCloseLobby: () => void;
    onSelectNavigationStop: (floor: string) => void;
  };
  units: {
    filters: UnitFilters;
    onChangeFilters: React.Dispatch<React.SetStateAction<UnitFilters>>;
    onResetFilters: () => void;
    activeFilterChips: string[];
    units: UnitInfo[];
    onSelectUnit: (unit: UnitInfo) => void;
  };
  sidebar: {
    sidebarFloorKey: string | null;
    sidebarSummary: SidebarSummary | null;
    sidebarUnits: UnitInfo[];
  };
};

export default function RightColumn({
  navigation,
  building,
  units,
  sidebar
}: RightColumnProps) {
  const { rightView, onChangeView, isProjectView, showBuildingVideo } = navigation;
  const {
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
    onSelectNavigationStop
  } = building;
  const { filters, onChangeFilters, onResetFilters, activeFilterChips, units: unitList, onSelectUnit } = units;
  const {
    sidebarFloorKey,
    sidebarSummary,
    sidebarUnits
  } = sidebar;
  const isFloorViewActive = rightView === 'proyecto' && Boolean(selectedFloor) && !showBuildingVideo;
  const visibleSidebarFloorKey = isFloorViewActive ? null : sidebarFloorKey;

  return (
    <div className="w-full lg:w-[68%] bg-[#F7F5F3] lg:sticky top-0 min-h-[100svh] lg:h-screen overflow-visible lg:overflow-hidden flex flex-col z-[1] relative">
      <div className={`right-shell ${visibleSidebarFloorKey ? 'right-shell--sidebar-open' : ''} ${isFloorViewActive ? 'right-shell--floor-view' : ''}`}>
        <div className="right-main">
          {/* Right column owns view switching and building/media stage. */}
          <HeroNavigation
            rightView={rightView}
            showBuildingVideo={showBuildingVideo}
            onChangeView={onChangeView}
          />

          <div
            className={`right-content flex-1 flex items-start justify-center relative z-10 pl-0 pr-0 pb-0 pt-0 ${
              isProjectView ? 'right-content--project' : 'right-content--offset'
            }`}
          >
            <ShowroomViews
              rightView={rightView}
              showBuildingVideo={showBuildingVideo}
              canPlayBuildingVideo={canPlayBuildingVideo}
              buildingVideoRef={buildingVideoRef}
              onVideoEnded={onVideoEnded}
              onVideoError={onVideoError}
              selectedFloor={selectedFloor}
              hoveredFloor={hoveredFloor}
              onSelectFloor={onSelectFloor}
              onBackToBuilding={onBackToBuilding}
              onHoverFloor={onHoverFloor}
              floorUnits={floorUnits}
              floorSummary={floorSummary}
              isLobbyOpen={isLobbyOpen}
              navigationStops={navigationStops}
              onToggleLobby={onToggleLobby}
              onCloseLobby={onCloseLobby}
              onSelectNavigationStop={onSelectNavigationStop}
              filters={filters}
              onChangeFilters={onChangeFilters}
              onResetFilters={onResetFilters}
              activeFilterChips={activeFilterChips}
              units={unitList}
              onSelectUnit={onSelectUnit}
            />
          </div>
        </div>

        {/* Sidebar owns floor hover context and unit quick access. */}
        <SidebarPanel
          logo={<RightSidebarLogo className="logo-right" />}
          sidebarFloorKey={visibleSidebarFloorKey}
          sidebarSummary={sidebarSummary}
          sidebarUnits={sidebarUnits}
          onSelectUnit={onSelectUnit}
        />
      </div>
    </div>
  );
}
