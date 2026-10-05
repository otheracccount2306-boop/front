import { useEffect, useState } from 'react';

/**
 * @description Crea una versión con debounce de una función: solo se ejecuta cuando pasan
 *              los milisegundos indicados sin nuevas llamadas.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Function} fn - Función a ejecutar
 * @param {number} delay - Espera en milisegundos
 * @returns {Function} Función con debounce que expone el método cancel
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
};

/**
 * @description Hook que devuelve un valor retrasado: se actualiza solo después de que el
 *              valor original deje de cambiar durante el tiempo indicado.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {any} value - Valor a retrasar
 * @param {number} delay - Espera en milisegundos, 300 por defecto
 * @returns {any} Valor con debounce
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
