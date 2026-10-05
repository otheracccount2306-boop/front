/**
 * @description Normaliza un texto para comparaciones: minúsculas y sin tildes.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Texto original, puede ser nulo
 * @returns {string} Texto en minúsculas sin tildes ni espacios sobrantes
 */
export const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

/**
 * @description Indica si algún campo de un objeto contiene el texto buscado, ignorando
 *              tildes y mayúsculas.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} item - Objeto a evaluar
 * @param {string[]} fields - Nombres de los campos donde buscar
 * @param {string} term - Texto buscado
 * @returns {boolean} true si el término está vacío o algún campo lo contiene
 */
export const matchesTerm = (item, fields, term) => {
  const needle = normalizeText(term);
  if (!needle) {
    return true;
  }
  return fields.some((field) => normalizeText(item[field]).includes(needle));
};

/**
 * @description Obtiene las iniciales de un nombre completo para el avatar.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} nombre - Nombres del usuario
 * @param {string} apellido - Apellidos del usuario
 * @returns {string} Hasta dos letras en mayúscula
 */
export const getInitials = (nombre, apellido) => {
  const first = String(nombre || '').trim().charAt(0);
  const last = String(apellido || '').trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
};
