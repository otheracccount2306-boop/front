export const ALL_VALUE = 'ALL';

const chip = (value, label) => ({ value, label });

export const WELLBEING_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('PSICOLOGIA', 'Psicología'),
  chip('SALUD', 'Salud'),
  chip('DEPORTE', 'Deporte'),
  chip('CULTURA', 'Cultura'),
  chip('PASTORAL', 'Pastoral'),
  chip('BECAS', 'Becas'),
];

export const CALENDAR_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('EXAMENES', 'Exámenes'),
  chip('RECESOS', 'Recesos'),
  chip('INSCRIPCIONES', 'Inscripciones'),
  chip('EVENTOS_ESPECIALES', 'Eventos'),
];

export const SPACE_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('AULA', 'Aula'),
  chip('LABORATORIO', 'Laboratorio'),
  chip('OFICINA', 'Oficina'),
  chip('BIBLIOTECA', 'Biblioteca'),
  chip('CAFETERIA', 'Cafetería'),
  chip('AREA_COMUN', 'Área común'),
];

export const NEWS_CHIPS = [
  chip(ALL_VALUE, 'Todas'),
  chip('INSTITUCIONAL', 'Institucional'),
  chip('ACADEMICO', 'Académico'),
  chip('BIENESTAR', 'Bienestar'),
];

export const EVENT_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('ACADEMICO', 'Académico'),
  chip('INSTITUCIONAL', 'Institucional'),
  chip('DEPORTE', 'Deporte'),
  chip('CULTURA', 'Cultura'),
];

const LABELS = {
  INICIO_CLASES: 'Inicio de clases',
  EXAMENES: 'Exámenes',
  RECESOS: 'Recesos',
  INSCRIPCIONES: 'Inscripciones',
  EVENTOS_ESPECIALES: 'Eventos especiales',
  PSICOLOGIA: 'Psicología',
  SALUD: 'Salud',
  DEPORTE: 'Deporte',
  CULTURA: 'Cultura',
  PASTORAL: 'Pastoral',
  BECAS: 'Becas',
  DEPARTAMENTO: 'Departamento',
  AULA: 'Aula',
  LABORATORIO: 'Laboratorio',
  OFICINA: 'Oficina',
  BIBLIOTECA: 'Biblioteca',
  CAFETERIA: 'Cafetería',
  AREA_COMUN: 'Área común',
  INSTITUCIONAL: 'Institucional',
  ACADEMICO: 'Académico',
  BIENESTAR: 'Bienestar',
  MATRICULAS: 'Matrículas',
  TRAMITES: 'Trámites',
};

const ICONS = {
  PSICOLOGIA: 'happy-outline',
  SALUD: 'medkit-outline',
  DEPORTE: 'football-outline',
  CULTURA: 'color-palette-outline',
  PASTORAL: 'heart-outline',
  BECAS: 'cash-outline',
  DEPARTAMENTO: 'business-outline',
  AULA: 'school-outline',
  LABORATORIO: 'flask-outline',
  OFICINA: 'briefcase-outline',
  BIBLIOTECA: 'library-outline',
  CAFETERIA: 'cafe-outline',
  AREA_COMUN: 'people-outline',
};

export const categoryLabel = (categoria) => {
  if (!categoria) {
    return '';
  }
  if (LABELS[categoria]) {
    return LABELS[categoria];
  }
  const text = String(categoria).replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const categoryIcon = (categoria) => ICONS[categoria] || 'ellipse-outline';

export const buildChipsFromItems = (items, allLabel = 'Todas') => {
  const unique = [...new Set(items.map((item) => item.categoria).filter(Boolean))].sort();
  return [chip(ALL_VALUE, allLabel), ...unique.map((value) => chip(value, categoryLabel(value)))];
};
