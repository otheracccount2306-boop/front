import { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { spacing } from './typography';

export const BREAKPOINTS = {
  medium: 600,
  expanded: 1024,
};

export const SIDEBAR_WIDTH = 220;

export const SIDEBAR_MIN_WIDTH = BREAKPOINTS.expanded;

const CONTENT_MAX_WIDTH = {
  compact: null,
  medium: 840,
  expanded: 1200,
};

const BODY_PADDING = {
  compact: 0,
  medium: spacing.sm,
  expanded: spacing.lg,
};

export const getLayout = (width, isWeb = Platform.OS === 'web') => {
  let size = 'compact';
  if (width >= BREAKPOINTS.expanded) {
    size = 'expanded';
  } else if (width >= BREAKPOINTS.medium) {
    size = 'medium';
  }
  const sidebar = isWeb && size === 'expanded';
  const available = sidebar ? width - SIDEBAR_WIDTH : width;
  const contentMaxWidth = CONTENT_MAX_WIDTH[size];
  const bodyPadding = BODY_PADDING[size];
  const contentWidth = Math.min(available, contentMaxWidth || available) - bodyPadding * 2;
  return {
    size,
    isCompact: size === 'compact',
    isExpanded: size === 'expanded',
    sidebar,
    contentWidth,
    contentMaxWidth,
    bodyPadding,
    columns: (minItemWidth = 340, max = 3) =>
      size === 'compact' ? 1 : Math.max(1, Math.min(max, Math.floor(contentWidth / minItemWidth))),
  };
};

export const useLayout = () => {
  const { width } = useWindowDimensions();
  return getLayout(width);
};

export const GridContext = createContext(false);

export const useCardGutter = () => (useContext(GridContext) ? spacing.sm : spacing.lg);
