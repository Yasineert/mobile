import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base on standard 5" screen (scale factor)
const scale = SCREEN_WIDTH / 375;

type ColorType = {
  // Primary colors
  primary: string;
  secondary: string;
  tertiary: string;

  // Neutrals
  background: string;
  card: string;
  surface: string;
  border: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textLight: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Transportation type colors
  bus: string;
  train: string;
  metro: string;
  
  // Other UI elements
  shadow: string;
  backdrop: string;
  transparent: string;
  white: string;
  black: string;
};

export const COLORS: ColorType = {
  // Primary colors
  primary: '#3C6E71', // Teal blue (main brand color)
  secondary: '#D9594C', // Coral red (accent color)
  tertiary: '#F4A261', // Sandy orange

  // Neutrals
  background: '#F8F9FA',
  card: '#FFFFFF',
  surface: '#F0F2F5',
  border: '#E1E4E8',
  
  // Text colors
  text: '#353535',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Transportation type colors
  bus: '#3C6E71', // Teal blue
  train: '#4CAF50', // Green
  metro: '#D9594C', // Coral red
  
  // Other UI elements
  shadow: '#000000',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

type FontSizes = {
  size10: number;
  size12: number;
  size14: number;
  size16: number;
  size18: number;
  size20: number;
  size24: number;
  size28: number;
  size32: number;
};

type FontsType = {
  // Font families
  regular: string;
  medium: string;
  bold: string;
  
  // Font weights
  weightRegular: string;
  weightMedium: string;
  weightBold: string;
} & FontSizes;

// Normalize sizes based on screen width
export function normalize(size: number): number {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const FONTS: FontsType = {
  // Font families - use appropriate fonts available on the device
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
  
  // Font weights
  weightRegular: '400',
  weightMedium: '600',
  weightBold: '700',
  
  // Font sizes
  size10: normalize(10),
  size12: normalize(12),
  size14: normalize(14),
  size16: normalize(16),
  size18: normalize(18),
  size20: normalize(20),
  size24: normalize(24),
  size28: normalize(28),
  size32: normalize(32),
};

type SpacingType = {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
};

export const SPACING: SpacingType = {
  xs: normalize(4),
  s: normalize(8),
  m: normalize(16),
  l: normalize(24),
  xl: normalize(32),
  xxl: normalize(48),
};

type ShadowType = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

type ShadowsType = {
  small: ShadowType;
  medium: ShadowType;
  large: ShadowType;
};

export const SHADOWS: ShadowsType = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

type CardStyleType = {
  backgroundColor: string;
  borderRadius: number;
  padding: number;
} & ShadowType;

type CardStylesType = {
  basic: CardStyleType;
  elevated: CardStyleType;
  rounded: CardStyleType;
};

export const CARD_STYLES: CardStylesType = {
  basic: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    ...SHADOWS.small,
  },
  elevated: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.m,
    ...SHADOWS.medium,
  },
  rounded: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.m,
    ...SHADOWS.small,
  },
};

// Responsive design utilities
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;

export const getResponsiveValue = <T,>(phone: T, tablet: T): T => {
  return isTablet ? tablet : phone;
};

export const getBottomSpace = (): number => {
  return Platform.OS === 'ios' && SCREEN_HEIGHT >= 812 ? 34 : 0;
};

export const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? (SCREEN_HEIGHT >= 812 ? 44 : 20) : 0;
};

export default {
  COLORS,
  FONTS,
  SPACING,
  SHADOWS,
  CARD_STYLES,
  normalize,
  isSmallDevice,
  isTablet,
  getResponsiveValue,
  getBottomSpace,
  getStatusBarHeight,
}; 