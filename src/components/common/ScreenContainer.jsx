import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';

/**
 * @description Contenedor base de pantalla: fondo general de la app, encabezado a todo el ancho y
 *              cuerpo centrado con ancho máximo para que se vea bien en el navegador.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.header] - Encabezado de la pantalla
 * @param {React.ReactNode} props.children - Contenido de la pantalla
 * @param {Object} [props.bodyStyle] - Estilos adicionales del cuerpo
 * @returns {React.JSX.Element} Contenedor de pantalla
 */
const ScreenContainer = ({ header, children, bodyStyle }) => (
  <View style={styles.root}>
    {header}
    <View style={[styles.body, bodyStyle]}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
});

export default ScreenContainer;
