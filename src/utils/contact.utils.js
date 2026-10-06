import { Linking } from 'react-native';

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
