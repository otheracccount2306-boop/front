import { Platform } from 'react-native';

const defaultUrl = Platform.select({
  android: 'http://10.0.2.2:8080/api/v1',
  default: 'http://localhost:8080/api/v1',
});

/**
 * @description URL base de la API. Se toma de la variable de entorno API_BASE_URL y, si no
 *              existe, usa localhost (10.0.2.2 en el emulador de Android).
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
export const API_BASE_URL = process.env.API_BASE_URL ? process.env.API_BASE_URL : defaultUrl;
