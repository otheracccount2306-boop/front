import { Platform } from 'react-native';
import colors from './colors';

/**
 * @description Tamaños de fuente acordados para toda la aplicación.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const fontSizes = {
  title: 24,
  section: 18,
  body: 14,
  small: 12,
  label: 10,
};

/**
 * @description Escala de espaciado y radios de borde compartidos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

/**
 * @description Radios de borde de tarjetas, chips e inputs.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const radius = {
  card: 8,
  chip: 16,
  input: 8,
};

/**
 * @description Sombra leve de tarjetas: boxShadow en web y sombra nativa en móvil.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const cardShadow = Platform.select({
  web: { boxShadow: `0px 1px 3px ${colors.shadowSoft}` },
  default: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
});
