import { Linking } from 'react-native';

/**
 * @description Interpreta el campo de contacto de un servicio, que es texto libre, y
 *              determina si es un correo, un teléfono o solo texto.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} contacto - Texto de contacto del servicio
 * @returns {{ type: 'mail'|'phone'|'text', label: string, url: string|null }|null} Acción de contacto o null si está vacío
 */
export const getContactAction = (contacto) => {
  const text = String(contacto || '').trim();
  if (!text) {
    return null;
  }
  if (text.includes('@')) {
    const email = (text.match(/[^\s,;]+@[^\s,;]+/) || [text])[0];
    return { type: 'mail', label: email, url: `mailto:${email}` };
  }
  const digits = text.replace(/[^\d+]/g, '');
  if (digits.replace(/\D/g, '').length >= 7) {
    return { type: 'phone', label: text, url: `tel:${digits}` };
  }
  return { type: 'text', label: text, url: null };
};

/**
 * @description Abre el marcador del dispositivo o el cliente de correo según la acción de contacto.
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {{ url: string|null }} action - Acción obtenida con getContactAction
 * @returns {Promise<void>} Promesa resuelta al intentar abrir el enlace
 */
export const openContact = async (action) => {
  if (!action || !action.url) {
    return;
  }
  try {
    await Linking.openURL(action.url);
  } catch {
    return;
  }
};
