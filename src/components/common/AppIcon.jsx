import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';

const AppIcon = ({ name, size = 20, color = colors.gray2, style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

export default AppIcon;
