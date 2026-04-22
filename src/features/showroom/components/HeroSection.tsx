import React from 'react';
import { useShowroomState } from '../hooks/useShowroomState';
import LeftPanel from './hero/LeftPanel';
import RightColumn from './RightColumn';
import ShowroomModals from './ShowroomModals';

export default function HeroSection({ canPlayBuildingVideo }: { canPlayBuildingVideo: boolean }) {
  const {
    heroSlides,
    heroSlide,
    rightView,
    setRightView,
    isProjectView,
    showBuildingVideo,
    buildingVideoRef,
    markBuildingVideoDone,
    selectedFloor,
    hoveredFloor,
    selectFloor,
    clearFloor,
    hoverFloor,
    sidebarFloorKey,
    sidebarUnits,
    sidebarSummary,
    navigationStops,
    filters,
    setFilters,
    resetFilters,
    activeFilterChips,
    filteredUnits,
    selectedUnit,
    setSelectedUnit,
    isLobbyOpen,
    toggleLobby,
    closeLobby,
    showRenderModal,
    renderIndex,
    openRenderModal,
    closeRenderModal,
    goPrevRender,
    goNextRender,
    selectNavigationStop
  } = useShowroomState({ canPlayBuildingVideo });

  return (
    <>
      {/* Orchestration container: layout + view composition only. */}
      <section id="inicio" className="relative flex flex-col lg:flex-row items-stretch">
        <LeftPanel
          heroSlides={heroSlides}
          heroSlide={heroSlide}
          onOpenRenderModal={openRenderModal}
        />

        <RightColumn
          navigation={{
            rightView,
            onChangeView: setRightView,
            isProjectView,
            showBuildingVideo
          }}
          building={{
            canPlayBuildingVideo,
            buildingVideoRef,
            onVideoEnded: markBuildingVideoDone,
            onVideoError: markBuildingVideoDone,
            selectedFloor,
            hoveredFloor,
            onSelectFloor: selectFloor,
            onBackToBuilding: clearFloor,
            onHoverFloor: hoverFloor,
            floorUnits: sidebarUnits,
            floorSummary: sidebarSummary,
            isLobbyOpen,
            navigationStops,
            onToggleLobby: toggleLobby,
            onCloseLobby: closeLobby,
            onSelectNavigationStop: selectNavigationStop
          }}
          units={{
            filters,
            onChangeFilters: setFilters,
            onResetFilters: resetFilters,
            activeFilterChips,
            units: filteredUnits,
            onSelectUnit: setSelectedUnit
          }}
          sidebar={{
            sidebarFloorKey,
            sidebarSummary,
            sidebarUnits
          }}
        />
      </section>

      <ShowroomModals
        selectedUnit={selectedUnit}
        onCloseUnit={() => setSelectedUnit(null)}
        heroSlides={heroSlides}
        showRenderModal={showRenderModal}
        renderIndex={renderIndex}
        onCloseRenderModal={closeRenderModal}
        onPrevRender={goPrevRender}
        onNextRender={goNextRender}
      />
    </>
  );
}
