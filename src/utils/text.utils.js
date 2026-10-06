export const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

export const matchesTerm = (item, fields, term) => {
  const needle = normalizeText(term);
  if (!needle) {
    return true;
  }
  return fields.some((field) => normalizeText(item[field]).includes(needle));
};

export const getInitials = (nombre, apellido) => {
  const first = String(nombre || '').trim().charAt(0);
  const last = String(apellido || '').trim().charAt(0);
  return `${first}${last}`.toUpperCase() || '?';
};
