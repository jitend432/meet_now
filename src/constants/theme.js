import { RFValue } from 'react-native-responsive-fontsize';
import { scale } from '../utils/Scaling';

export const RV = (size) => RFValue(size);

export const COLORS = {
  primary: '#114d23',
  //background: '#f9f3e6',
  background: '#ffffff',
  button: '#0e5a2f',
  white: '#ffffff',
  black: '#000000',
  button2: '#285f26',
  
  primaryDark: '#0B5345',
  surfaceCard: '#F8F9FA',
  textMain: '#1A1A1A',
  textLight: '#b3ad92',
  textMuted: '#6C757D',
  success: '#198754',
  error: '#DC3545',
  border: '#DEE2E6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  logoBg: '#009900',
  
};

export const RADIUS = {
   xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  round: 999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const SIZES = {
  avatar: scale(110),
  avatarlg: scale(200),
  avatarmini: scale(70),
  icon: scale(24),
};

export const FONTSIZE = {
  xxs: RV(10),
  xs: RV(12),
  sm: RV(14),
  md: RV(16),
  lg: RV(18),
  xl: RV(20),
  xxl: RV(24),
  h3: RV(28),
  h2: RV(32),
  h1: RV(36),
  display: RV(42), //splash
};

export const LETTER_SPACING = {
  tight: -0.5,
  normal: 0,
  medium: 0.5,
  wide: 1,
  extraWide: 1.5,
};