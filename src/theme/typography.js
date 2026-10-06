import { Platform } from 'react-native';
import colors from './colors';

export const fontSizes = {
  title: 24,
  section: 18,
  body: 14,
  small: 12,
  label: 10,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  card: 8,
  chip: 16,
  input: 8,
};

export const cardShadow = Platform.select({
  web: { boxShadow: `0px 1px 3px ${colors.shadowSoft}` },
  default: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
});
