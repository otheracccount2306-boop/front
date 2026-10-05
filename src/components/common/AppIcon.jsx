import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';

/**
 * @description Ícono de la familia Ionicons con el color gris secundario por defecto.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del ícono de Ionicons
 * @param {number} [props.size] - Tamaño en puntos, 20 por defecto
 * @param {string} [props.color] - Color del ícono
 * @param {Object} [props.style] - Estilos adicionales
 * @returns {React.JSX.Element} Ícono
 */
const AppIcon = ({ name, size = 20, color = colors.gray2, style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

export default AppIcon;
