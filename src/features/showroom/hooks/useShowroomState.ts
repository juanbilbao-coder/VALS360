import { heroSlides } from '../data/media';
import { useHeroCarousel } from './useHeroCarousel';
import { useBuildingVideo } from './useBuildingVideo';
import { useRenderGalleryModal } from './useRenderGalleryModal';
import { useShowroomRouting } from './useShowroomRouting';
import { useShowroomStateCore } from './useShowroomStateCore';

type UseShowroomStateParams = {
  canPlayBuildingVideo: boolean;
};

export function useShowroomState({ canPlayBuildingVideo }: UseShowroomStateParams) {
  const {
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
    toggleLobby,
    closeLobby,
    selectNavigationStop
  } = useShowroomStateCore();

  const { index: heroSlide } = useHeroCarousel(heroSlides, 4800);
  const { videoRef: buildingVideoRef, showVideo: showBuildingVideo, markDone: markBuildingVideoDone } = useBuildingVideo({
    rightView,
    canPlay: canPlayBuildingVideo
  });
  const {
    showRenderModal,
    renderIndex,
    openRenderModal,
    closeRenderModal,
    goPrevRender,
    goNextRender
  } = useRenderGalleryModal({ totalSlides: heroSlides.length });

  useShowroomRouting({
    selectedFloor,
    selectedUnit,
    setSelectedFloor,
    setSelectedUnit,
    setHoveredFloor
  });

  return {
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
    toggleLobby,
    closeLobby,
    showRenderModal,
    renderIndex,
    openRenderModal,
    closeRenderModal,
    goPrevRender,
    goNextRender,
    selectNavigationStop
  };
}
