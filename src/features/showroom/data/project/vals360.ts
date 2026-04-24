import type { ProjectFloorStop, ProjectPayload, ProjectUnit } from '../../types';

const renderPool = ['/r1.png', '/r2.png', '/r3.png', '/r4.png'] as const;
const oneBedroomAreas = [50, 52, 54, 56, 58, 60] as const;
const twoBedroomAreas = [76, 78, 82, 86, 92, 98] as const;
const penthouseAreas = [138, 146] as const;
const localAreas = [72, 81, 94] as const;
const officeAreas = [42, 48, 54, 60] as const;
const orientations = ['Frente', 'Esquina', 'Contrafrente', 'Vista abierta'] as const;
const residentialStatusPattern = [
  'Disponible',
  'Disponible',
  'Reservado',
  'Disponible',
  'Vendido',
  'Disponible',
  'Reservado'
] as const;

type FloorHotspot = {
  left: number;
  top: number;
  width: number;
  height: number;
  align: 'left' | 'center' | 'right';
};

const floorHotspots: Record<string, FloorHotspot> = {
  pb: { left: 31.5, top: 82, width: 32, height: 8.6, align: 'left' },
  ep: { left: 31.5, top: 70.6, width: 29.5, height: 5.6, align: 'left' },

  '1': { left: 30.6, top: 59.2, width: 28.8, height: 4.8, align: 'left' },
  '2': { left: 29.9, top: 54.0, width: 28.2, height: 4.8, align: 'left' },
  '3': { left: 29.1, top: 48.8, width: 27.7, height: 4.8, align: 'left' },
  '4': { left: 28.4, top: 43.5, width: 27.1, height: 4.8, align: 'left' },
  '5': { left: 27.8, top: 38.2, width: 26.5, height: 4.8, align: 'left' },
  '6': { left: 27.1, top: 33.0, width: 25.9, height: 4.8, align: 'left' },
  '7': { left: 26.4, top: 27.9, width: 25.3, height: 4.2, align: 'left' },
  '8': { left: 25.8, top: 22.8, width: 24.7, height: 4.2, align: 'left' },
  '9': { left: 25.1, top: 17.7, width: 24.1, height: 4.2, align: 'left' },
  '10': { left: 24.5, top: 12.6, width: 23.5, height: 4.2, align: 'left' }
};

const demoTour360: ProjectUnit['tour360'] = {
  initialSceneId: 'ambiente-1',
  scenes: [
    {
      id: 'ambiente-1',
      title: 'Ambiente 1',
      image360: '/CAMULTICORRE.jpeg',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [{ targetSceneId: 'ambiente-2', yaw: 0, pitch: -0.12 }]
    },
    {
      id: 'ambiente-2',
      title: 'Ambiente 2',
      image360: '/CAMULTICORRE2.jpeg',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [{ targetSceneId: 'ambiente-1', yaw: 0, pitch: -0.12 }]
    }
  ]
};

function pickRender(index: number) {
  return renderPool[index % renderPool.length];
}

function buildMedia(index: number): NonNullable<ProjectUnit['media']> {
  return {
    render: pickRender(index),
    plan: pickRender(index + 1),
    tour360: demoTour360
  };
}

function buildResidentialFeatures(bedrooms: 1 | 2, floor: number, sequence: number) {
  const baseFeatures =
    bedrooms === 1
      ? ['Balcón', 'Cocina integrada', 'Dormitorio con placard']
      : ['Living comedor', 'Ventilación cruzada', 'Dormitorio principal en suite'];

  if (floor >= 7) {
    return [...baseFeatures.slice(0, 2), 'Vista abierta'];
  }

  if (sequence % 2 === 0) {
    return [...baseFeatures.slice(0, 2), 'Excelente iluminación'];
  }

  return baseFeatures;
}

function buildResidentialUnit({
  floor,
  sequence,
  bedrooms,
  mediaIndex
}: {
  floor: number;
  sequence: number;
  bedrooms: 1 | 2;
  mediaIndex: number;
}): ProjectUnit {
  const areaPool = bedrooms === 1 ? oneBedroomAreas : twoBedroomAreas;
  const area = areaPool[(floor + sequence) % areaPool.length];
  const orientation = orientations[(floor + sequence - 1) % orientations.length];
  const status = residentialStatusPattern[(floor + sequence - 1) % residentialStatusPattern.length];
  const code = `U-${floor}${String(sequence).padStart(2, '0')}`;

  return {
    id: `vals360-${code.toLowerCase()}`,
    code,
    levelKey: String(floor),
    status,
    type: bedrooms === 1 ? '1 dormitorio' : '2 dormitorios',
    floor,
    area,
    orientation,
    bedrooms,
    price: null,
    features: buildResidentialFeatures(bedrooms, floor, sequence),
    media: buildMedia(mediaIndex),
    tour360: demoTour360
  };
}

function buildPenthouseUnit(sequence: number): ProjectUnit {
  const code = `PH-${String(sequence).padStart(2, '0')}`;
  return {
    id: `vals360-${code.toLowerCase()}`,
    code,
    levelKey: '10',
    status: sequence === 1 ? 'Disponible' : 'Reservado',
    type: 'Penthouse',
    floor: 10,
    area: penthouseAreas[sequence - 1] ?? penthouseAreas[0],
    orientation: 'Vista abierta',
    bedrooms: 2,
    price: null,
    features: ['Terraza propia', 'Palier privado', 'Vista panorámica'],
    media: buildMedia(20 + sequence),
    tour360: demoTour360
  };
}

function buildCommercialUnit({
  code,
  type,
  levelKey,
  area,
  status,
  orientation,
  mediaIndex,
  features
}: {
  code: string;
  type: 'Local' | 'Oficina' | 'Coworking';
  levelKey: 'pb' | 'ep';
  area: number;
  status: 'Disponible' | 'Reservado' | 'Vendido';
  orientation: string;
  mediaIndex: number;
  features: string[];
}): ProjectUnit {
  return {
    id: `vals360-${code.toLowerCase()}`,
    code,
    levelKey,
    status,
    type,
    floor: 0,
    area,
    orientation,
    bedrooms: 0,
    price: null,
    features,
    media: buildMedia(mediaIndex),
    tour360: demoTour360
  };
}

function buildResidentialUnits() {
  const units: ProjectUnit[] = [];
  let mediaIndex = 0;

  for (let floor = 1; floor <= 6; floor += 1) {
    for (let sequence = 1; sequence <= 4; sequence += 1) {
      units.push(buildResidentialUnit({ floor, sequence, bedrooms: 1, mediaIndex }));
      mediaIndex += 1;
    }

    for (let sequence = 5; sequence <= 6; sequence += 1) {
      units.push(buildResidentialUnit({ floor, sequence, bedrooms: 2, mediaIndex }));
      mediaIndex += 1;
    }
  }

  for (let floor = 7; floor <= 9; floor += 1) {
    for (let sequence = 1; sequence <= 5; sequence += 1) {
      units.push(buildResidentialUnit({ floor, sequence, bedrooms: 1, mediaIndex }));
      mediaIndex += 1;
    }

    for (let sequence = 6; sequence <= 7; sequence += 1) {
      units.push(buildResidentialUnit({ floor, sequence, bedrooms: 2, mediaIndex }));
      mediaIndex += 1;
    }
  }

  units.push(buildPenthouseUnit(1), buildPenthouseUnit(2));

  return units;
}

function buildCommercialUnits() {
  const locals = localAreas.map((area, index) =>
    buildCommercialUnit({
      code: `LOC-${String(index + 1).padStart(2, '0')}`,
      type: 'Local',
      levelKey: 'pb',
      area,
      status: index === 1 ? 'Reservado' : 'Disponible',
      orientation: index === 0 ? 'Esquina' : 'Frente',
      mediaIndex: 80 + index,
      features: ['Frente vidriado', 'Acceso independiente', 'Excelente exposición']
    })
  );

  const offices = officeAreas.map((area, index) =>
    buildCommercialUnit({
      code: `OF-${String(index + 1).padStart(2, '0')}`,
      type: 'Oficina',
      levelKey: 'ep',
      area,
      status: index === 2 ? 'Vendido' : index === 1 ? 'Reservado' : 'Disponible',
      orientation: index % 2 === 0 ? 'Contrafrente' : 'Frente',
      mediaIndex: 90 + index,
      features: ['Planta flexible', 'Ideal estudio', 'Acceso controlado']
    })
  );

  const coworking = buildCommercialUnit({
    code: 'CW-01',
    type: 'Coworking',
    levelKey: 'ep',
    area: 120,
    status: 'Disponible',
    orientation: 'Frente',
    mediaIndex: 96,
    features: ['Espacio flexible', 'Sala de reuniones', 'Conectividad premium']
  });

  return [...locals, ...offices, coworking];
}

const allUnits = [...buildResidentialUnits(), ...buildCommercialUnits()];

function buildFloorSummary(key: string, label: string, floorNumber?: number) {
  const unitsForStop = allUnits.filter(
    (unit) => unit.levelKey === key || (floorNumber !== undefined && unit.floor === floorNumber)
  );

  const available = unitsForStop.filter((unit) => unit.status === 'Disponible').length;
  const total = unitsForStop.length;

  let note = 'Sin unidades cargadas';
  if (total > 0) {
    const unitTypes = Array.from(new Set(unitsForStop.map((unit) => unit.type)));
    if (unitTypes.length === 1) {
      note = unitTypes[0] === 'Coworking' ? 'Espacio de trabajo colaborativo' : unitTypes[0];
    } else if (unitTypes.includes('1 dormitorio') && unitTypes.includes('2 dormitorios')) {
      note = '1 y 2 dormitorios';
    } else {
      note = unitTypes.join(' · ');
    }
  }

  if (key === 'pb') note = 'Locales comerciales';
  if (key === 'ep') note = 'Oficinas y coworking';
  if (key === '10') note = 'Penthouses';

  return { available, total, note };
}

function buildNumericFloorStop(floorNumber: number): ProjectFloorStop {
  const key = String(floorNumber);
  const hotspot = floorHotspots[key];

  if (!hotspot) {
    throw new Error(`Missing hotspot config for floor ${key}`);
  }

  return {
    key,
    code: `P${floorNumber}`,
    label: `Piso ${floorNumber}`,
    lobbyComposition: floorNumber === 10 ? '2 departamentos' : '6 departamentos',
    kind: 'numeric',
    floorNumber,
    navigable: true,
    summary: buildFloorSummary(key, `Piso ${floorNumber}`, floorNumber),
    hotspot
  };
}

const floors: ProjectFloorStop[] = [
  {
    key: 'ss',
    code: 'SS',
    label: 'Subsuelo',
    lobbyComposition: '22 cocheras',
    kind: 'special',
    navigable: false,
    summary: {
      available: 22,
      total: 22,
      note: 'Cocheras'
    }
  },
  {
    key: 'pb',
    code: 'PB',
    label: 'Planta Baja',
    lobbyComposition: '3 locales · quincho · gimnasio · coworking',
    kind: 'special',
    navigable: true,
    summary: buildFloorSummary('pb', 'Planta Baja'),
    hotspot: floorHotspots.pb
  },
  {
    key: 'ep',
    code: 'EP',
    label: 'Entrepiso',
    lobbyComposition: '3 oficinas · 1 local · 3 deptos',
    kind: 'special',
    navigable: true,
    summary: buildFloorSummary('ep', 'Entrepiso'),
    hotspot: floorHotspots.ep
  },
  buildNumericFloorStop(1),
  buildNumericFloorStop(2),
  buildNumericFloorStop(3),
  buildNumericFloorStop(4),
  buildNumericFloorStop(5),
  buildNumericFloorStop(6),
  buildNumericFloorStop(7),
  buildNumericFloorStop(8),
  buildNumericFloorStop(9),
  buildNumericFloorStop(10)
];

export const vals360ProjectPayload: ProjectPayload = {
  project: {
    id: 'vals360',
    name: 'VALS 360',
    location: 'Río Tercero, Córdoba, Argentina',
    tagline: 'Residencias en esquina · Río Tercero',
    description:
      'Un showroom digital para recorrer el proyecto, explorar unidades y seguir el avance de obra con claridad.',
    contact: {
      whatsapp: '+5493510000000',
      messageTemplate:
        'Hola, estoy interesado en la unidad {unit_code} del proyecto VALS 360. ¿Podrían contactarme?'
    }
  },
  media: {
    heroSlides: [...renderPool]
  },
  floors,
  units: allUnits,
  filters: {
    defaults: {
      type: 'Todas',
      status: 'Todas',
      floor: 'Todos',
      area: 'Todos'
    },
    options: {
      type: ['Todas', '1 dormitorio', '2 dormitorios', 'Penthouse', 'Local', 'Oficina', 'Coworking'],
      status: ['Todas', 'Disponible', 'Reservado', 'Vendido'],
      floor: ['Todos', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      area: ['Todos', '60-80', '80-100', '100-130', '130+']
    }
  },
  progress: {
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
    phases: [
      { name: 'Movimiento de suelo', start: 0, span: 2, progress: 1 },
      { name: 'Estructura y losas', start: 2, span: 4, progress: 0.7 },
      { name: 'Envolvente y carpinterías', start: 4, span: 3, progress: 0.45 },
      { name: 'Instalaciones', start: 5, span: 3, progress: 0.35 },
      { name: 'Terminaciones', start: 6, span: 4, progress: 0.2 },
      { name: 'Amenities y exteriores', start: 7, span: 3, progress: 0.1 }
    ],
    milestones: [
      'Estructura: 70% completada',
      'Carpinterías: inicio de colocación',
      'Instalaciones: avance 35%'
    ],
    gallery: [
      {
        src: '/building-render.jpg',
        alt: 'Registro de obra 1',
        caption: 'Vista general de avance'
      },
      {
        src: '/render-2.jpg',
        alt: 'Registro de obra 2',
        caption: 'Frente y envolvente'
      },
      {
        src: '/r4.png',
        alt: 'Registro de obra 3',
        caption: 'Detalle de volumen'
      }
    ]
  },
  rules: {
    hideNonNavigableFloors: true,
    showSoldUnits: true,
    ctaPrimary: 'whatsapp',
    fallbacks: {
      missingRender: 'use_placeholder',
      missingPlan: 'hide',
      missing360: 'hide'
    }
  }
};
