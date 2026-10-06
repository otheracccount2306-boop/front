import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import AppIcon from '../common/AppIcon';

const CoverImage = ({ uri, height }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.container, { height }]}>
      {!loaded ? <AppIcon name="image-outline" size={32} color={colors.light} /> : null}
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={[StyleSheet.absoluteFill, { opacity: loaded ? 1 : 0 }]}
          resizeMode="cover"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.pale,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default CoverImage;
