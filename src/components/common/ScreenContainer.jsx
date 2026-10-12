import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import { useLayout } from '../../theme/layout';

/**
 * @description Contenedor base de pantalla, mobile first: en el celular el cuerpo ocupa todo el
 *              ancho; en tabletas y computadores se centra con un ancho máximo y un margen lateral
 *              que crecen con la pantalla. El encabezado siempre va a todo el ancho.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} [props.header] - Encabezado de la pantalla
 * @param {React.ReactNode} props.children - Contenido de la pantalla
 * @param {Object} [props.bodyStyle] - Estilos adicionales del cuerpo
 * @returns {React.JSX.Element} Contenedor de pantalla
 */
const ScreenContainer = ({ header, children, bodyStyle }) => {
  const layout = useLayout();
  const responsive = {
    maxWidth: layout.contentMaxWidth || '100%',
    paddingHorizontal: layout.bodyPadding,
  };
  return (
    <View style={styles.root}>
      {header}
      <View style={[styles.body, responsive, bodyStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});

export default ScreenContainer;
