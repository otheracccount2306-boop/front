import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { GridContext, useLayout } from '../../theme/layout';
import { spacing } from '../../theme/typography';

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
