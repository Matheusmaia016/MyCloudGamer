import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },
};

export type AppTheme = typeof theme;
