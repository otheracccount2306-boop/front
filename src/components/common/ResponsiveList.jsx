import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { GridContext, useLayout } from '../../theme/layout';
import { spacing } from '../../theme/typography';

/**
 * @description FlatList que en el celular muestra una columna y en pantallas más anchas reparte las
 *              tarjetas en rejilla (2 o 3 columnas según quepan). Acepta las mismas props que
 *              FlatList, más el ancho mínimo de cada tarjeta.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} props - Props de FlatList
 * @param {number} [props.minItemWidth] - Ancho mínimo de cada tarjeta en puntos (por defecto 340)
 * @param {number} [props.maxColumns] - Máximo de columnas (por defecto 3)
 * @returns {React.JSX.Element} Lista adaptable
 */
const ResponsiveList = ({ minItemWidth = 340, maxColumns = 3, renderItem, contentContainerStyle, ...rest }) => {
  const layout = useLayout();
  const columns = layout.columns(minItemWidth, maxColumns);

  if (columns === 1) {
    return <FlatList renderItem={renderItem} contentContainerStyle={contentContainerStyle} {...rest} />;
  }

  const percent = `${100 / columns}%`;
  return (
    <GridContext.Provider value>
      <FlatList
        key={`grid-${columns}`}
        numColumns={columns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[contentContainerStyle, styles.grid]}
        renderItem={(info) => (
          <View style={[styles.cell, { width: percent, maxWidth: percent }]}>{renderItem(info)}</View>
        )}
        {...rest}
      />
    </GridContext.Provider>
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: spacing.sm,
  },
  row: {
    alignItems: 'stretch',
  },
  cell: {
    flexGrow: 0,
  },
});

export default ResponsiveList;
