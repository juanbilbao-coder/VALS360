import React from 'react';
import UnitModal from '../modals/UnitModal';
import type { UnitInfo } from '../types';

type UnitDetailViewProps = {
  unit: UnitInfo | null;
  onClose: () => void;
  renders: string[];
};

export default function UnitDetailView({ unit, onClose, renders }: UnitDetailViewProps) {
  return <UnitModal unit={unit} onClose={onClose} renders={renders} />;
}
