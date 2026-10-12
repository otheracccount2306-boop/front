/**
 * @description Textos del resumen del camino que dibuja el mapa del campus.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object|null} info - Resumen enviado por el mapa: { distancia, minutos, piso, escaleras }
 * @returns {{ main: string, steps: string|null }|null} Línea principal (tiempo y distancia) e
 *          indicación de escaleras
 */
export const routeSummary = (info) => {
  if (!info) {
    return null;
  }
  const main = `${info.minutos} min caminando · ${info.distancia} m`;
  const changes = Number(info.escaleras) || 0;
  let steps = null;
  if (changes > 0 && info.piso && String(info.piso) !== '1') {
    steps = `Sube al piso ${info.piso} por la escalera marcada en el mapa`;
  } else if (changes > 0) {
    steps = 'Usa la escalera marcada en el mapa';
  }
  return { main, steps };
};
