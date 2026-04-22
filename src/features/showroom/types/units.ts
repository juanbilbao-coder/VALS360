export type Tour360Hotspot = {
  targetSceneId: string;
  yaw: number;
  pitch: number;
};

export type Tour360Scene = {
  id: string;
  title: string;
  image360: string;
  initialYaw?: number;
  initialPitch?: number;
  hotspots?: Tour360Hotspot[];
};

export type Tour360Data = {
  initialSceneId?: string;
  scenes: Tour360Scene[];
};

export type UnitMedia = {
  render?: string | null;
  plan?: string | null;
  tour360?: Tour360Data | null;
};

export type UnitInfo = {
  id?: string;
  code: string;
  levelKey?: string;
  status: string;
  type: string;
  floor: number;
  area: number;
  orientation: string;
  bedrooms: number;
  price?: number | null;
  features?: string[];
  media?: UnitMedia;
  tour360?: Tour360Data;
};
