export const ALL_VALUE = 'ALL';

/**
 * @description Crea una opción de chip de categoría.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Valor enviado al filtrar
 * @param {string} label - Texto mostrado en el chip
 * @returns {{ value: string, label: string }} Opción de chip
 */
const chip = (value, label) => ({ value, label });

/**
 * @description Chips de categoría de los servicios de bienestar.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const WELLBEING_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('PSICOLOGIA', 'Psicología'),
  chip('SALUD', 'Salud'),
  chip('DEPORTE', 'Deporte'),
  chip('CULTURA', 'Cultura'),
  chip('PASTORAL', 'Pastoral'),
  chip('BECAS', 'Becas'),
];

/**
 * @description Chips de categoría del calendario académico.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const CALENDAR_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('EXAMENES', 'Exámenes'),
  chip('RECESOS', 'Recesos'),
  chip('INSCRIPCIONES', 'Inscripciones'),
  chip('EVENTOS_ESPECIALES', 'Eventos'),
];

/**
 * @description Chips de categoría de los espacios del campus.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 */
export const SPACE_CHIPS = [
  chip(ALL_VALUE, 'Todos'),
  chip('AULA', 'Aula'),
  chip('LABORATORIO', 'Laboratorio'),
  chip('OFICINA', 'Oficina'),
  chip('BIBLIOTECA', 'Biblioteca'),
  chip('CAFETERIA', 'Cafetería'),
  chip('AREA_COMUN', 'Área común'),
];

/**
 * @description Chips de categoría de las noticias.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const NEWS_CHIPS = [
  chip(ALL_VALUE, 'Todas'),
  chip('INSTITUCIONAL', 'Institucional'),
  chip('ACADEMICO', 'Académico'),
  chip('BIENESTAR', 'Bienestar'),
];

/**
 * @description Chips de categoría de los eventos institucionales.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
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

/**
 * @description Convierte un código de categoría del backend en una etiqueta legible en español.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} categoria - Código de categoría, por ejemplo AREA_COMUN
 * @returns {string} Etiqueta legible, por ejemplo "Área común"
 */
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

/**
 * @description Devuelve el nombre del ícono de Ionicons asociado a una categoría.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} categoria - Código de categoría
 * @returns {string} Nombre del ícono
 */
export const categoryIcon = (categoria) => ICONS[categoria] || 'ellipse-outline';

/**
 * @description Construye chips de categoría a partir de los datos cargados, para categorías
 *              que el backend define libremente, como las de las preguntas frecuentes.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Array} items - Elementos con campo categoria
 * @param {string} allLabel - Etiqueta del chip que muestra todo
 * @returns {Array<{ value: string, label: string }>} Chips únicos ordenados alfabéticamente
 */
export const buildChipsFromItems = (items, allLabel = 'Todas') => {
  const unique = [...new Set(items.map((item) => item.categoria).filter(Boolean))].sort();
  return [chip(ALL_VALUE, allLabel), ...unique.map((value) => chip(value, categoryLabel(value)))];
};
