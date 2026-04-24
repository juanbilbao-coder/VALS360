import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import BuildingSvg from '../components/BuildingSvg';
import FloorAxonometry from '../components/FloorAxonometry';
import LobbyElevator from '../components/hero/LobbyElevator';
import { selectFloorLabelByKey } from '../data/selectors';
import type { UnitInfo } from '../types';

type ProjectViewProps = {
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
  onSelectUnit: (unit: UnitInfo) => void;
  isLobbyOpen: boolean;
  navigationStops: Array<{ key: string; label: string; composition: string }>;
  onToggleLobby: () => void;
  onCloseLobby: () => void;
  onSelectNavigationStop: (floor: string) => void;
};

export default function ProjectView({
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
  onSelectUnit,
  isLobbyOpen,
  navigationStops,
  onToggleLobby,
  onCloseLobby,
  onSelectNavigationStop
}: ProjectViewProps) {
  const floorLabel = selectFloorLabelByKey(selectedFloor) || 'Nivel seleccionado';

  return (
    <motion.div
      key="proyecto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full h-full flex items-start justify-center"
    >
      <div className="building-media">
        <AnimatePresence mode="wait">
          {showBuildingVideo ? (
            <motion.video
              key="building-video"
              ref={buildingVideoRef}
              className="building-video"
              muted
              autoPlay
              playsInline
              preload="auto"
              onEnded={onVideoEnded}
              onError={onVideoError}
              initial={{ opacity: 0 }}
              animate={{ opacity: canPlayBuildingVideo ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <source src="/video1.mp4" type="video/mp4" />
            </motion.video>
          ) : selectedFloor ? (
            <FloorAxonometry
              floorLabel={floorLabel}
              units={floorUnits}
              summary={floorSummary}
              onBack={onBackToBuilding}
              onSelectUnit={onSelectUnit}
            />
          ) : (
            <motion.div
              key="building-svg"
              className="relative w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: canPlayBuildingVideo ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <BuildingSvg
                selectedFloor={selectedFloor}
                onSelectFloor={onSelectFloor}
                hoveredFloor={hoveredFloor}
                onHoverFloor={onHoverFloor}
              />
              <LobbyElevator
                isOpen={isLobbyOpen}
                selectedFloor={selectedFloor}
                stops={navigationStops}
                onToggle={onToggleLobby}
                onClose={onCloseLobby}
                onSelectStop={onSelectNavigationStop}
                disabled={showBuildingVideo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
