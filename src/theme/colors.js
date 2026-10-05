/**
 * @description Paleta oficial UCC. Es la única fuente de colores de la aplicación:
 *              ningún otro archivo debe definir colores propios.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
const colors = {
  primary: '#007760',
  primaryDark: '#005A47',
  aqua: '#00A884',
  light: '#4DC5A5',
  pale: '#E0F5EF',
  gray1: '#3D3D3D',
  gray2: '#6B6B6B',
  gray3: '#A8A8A8',
  gray4: '#E8E8E8',
  white: '#FFFFFF',
  background: '#F7F9F8',
  accent: '#F5A623',
  error: '#E05252',
  success: '#00A884',
  errorLight: '#FBE9E9',
  accentLight: '#FDF1DA',
  shadow: '#000000',
  shadowSoft: 'rgba(0, 0, 0, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.45)',
};

const CATEGORY_PALETTE = [colors.primary, colors.aqua, colors.light, colors.accent, colors.primaryDark];

/**
 * @description Asigna un color de la paleta UCC a una categoría o código de forma
 *              determinista, para que el mismo valor siempre use el mismo color.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} value - Categoría, código o texto cualquiera
 * @returns {string} Color hexadecimal de la paleta
 */
export const getCategoryColor = (value) => {
  const text = String(value || '');
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 997;
  }
  return CATEGORY_PALETTE[hash % CATEGORY_PALETTE.length];
};

export default colors;
