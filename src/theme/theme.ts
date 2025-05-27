import { Platform, Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base on standard 5" screen (scale factor)
const scale = SCREEN_WIDTH / 375;

interface Spacing {
  space_2: number;
  space_4: number;
  space_8: number;
  space_10: number;
  space_12: number;
  space_15: number;
  space_16: number;
  space_18: number;
  space_20: number;
  space_24: number;
  space_28: number;
  space_30: number;
  space_32: number;
  space_36: number;
  // Add responsive spacing aliases
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
}

export const SPACING: Spacing = {
  space_2: 2,
  space_4: 4,
  space_8: 8,
  space_10: 10,
  space_12: 12,
  space_15: 15,
  space_16: 16,
  space_18: 18,
  space_20: 20,
  space_24: 24,
  space_28: 28,
  space_30: 30,
  space_32: 32,
  space_36: 36,
  // Add responsive spacing aliases
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

interface Color {
  primaryGreenHex: string;
  primaryRedHex: string;
  primaryOrangeHex: string;
  primaryLightGreenHex: string;
  primaryBlackHex: string;
  primaryDarkGreyHex: string;
  secondaryDarkGreyHex: string;
  primaryGreyHex: string;
  secondaryGreyHex: string;
  primaryLightGreyHex: string;
  secondaryLightGreyHex: string;
  primaryWhiteHex: string;
  primaryBlackRGBA: string;
  secondaryBlackRGBA: string;
  darkTealGreen: string;

  // Add new color structure
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
  card: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  bus: string;
  train: string;
  metro: string;
  shadow: string;
  backdrop: string;
  transparent: string;
  white: string;
  black: string;
  
  // Additional colors for auth screens
  dark: string;
  gray: string;
  darkGray: string;
  lightGray: string;
  light: string;

  // Navigator
  Navigator: {
    background: string;
    text: string;
    icon: string;
    iconFocused: string;
    labelColor: string;
  };
  // Discover Screen 
  DiscoverScreen: {
    background: string,

    headerText: {
      color: string,
    },
    SearchInput: {
      background: string,
      borderColor: string,
      IconColor: string,
      PlaceHolderColor: string,
      textColor: string,
    },
    Category: {
      Titlecolor: string,
      subTitlecolor: string,
    },

    CardSurprise: {
      background: string,
      colorText: string,
      market: {
        colorTitle: String,
      },
      colorPrice: String,
      ratingColor: String,
      headerColor: String,
      headerBackground: String,
      FavoriteBakcground: String,
      favoriteIcon: String,
      ratingAndDistanceColor: String,
    },
  },
}

export const COLORS: Color = {
  primaryGreenHex: '#167365',
  primaryOrangeHex: '#FF8C00',
  primaryLightGreenHex: '#32CD32',
  primaryRedHex: '#DC3535',
  primaryBlackHex: '#0C0F14',
  primaryDarkGreyHex: '#141921',
  secondaryDarkGreyHex: '#21262E',
  primaryGreyHex: '#252A32',
  secondaryGreyHex: '#252A32',
  primaryLightGreyHex: '#52555A',
  secondaryLightGreyHex: '#AEAEAE',
  primaryWhiteHex: '#FFFFFF',
  primaryBlackRGBA: 'rgba(12,15,20,0.5)',
  secondaryBlackRGBA: 'rgba(0,0,0,0.7)',
  darkTealGreen: '#00332c',

  // Add new color structure
  primary: '#3C6E71',
  secondary: '#D9594C',
  tertiary: '#F4A261',
  background: '#F8F9FA',
  card: '#FFFFFF',
  surface: '#F0F2F5',
  border: '#E1E4E8',
  text: '#353535',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  bus: '#3C6E71',
  train: '#4CAF50',
  metro: '#D9594C',
  shadow: '#000000',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
  
  // Additional colors for auth screens
  dark: '#353535',
  gray: '#6C757D',
  darkGray: '#495057',
  lightGray: '#E1E4E8',
  light: '#F8F9FA',

  // Navigator
  Navigator: {
    background: 'white',
    text: '#FFFFFF',
    icon: '#979694',
    iconFocused: '#01615f',
    labelColor: ' "#979694',
  },
  // Discover Screen 
  DiscoverScreen: {
    background: 'white',

    headerText: {
      color: "#01615f",
    },
    SearchInput: {
      background: "transparent",
      borderColor: "grey",
      IconColor: "grey",
      PlaceHolderColor: "grey",
      textColor: "black",
    },
    Category: {
      Titlecolor: "black",
      subTitlecolor: "#01615f",
    },
    CardSurprise: {
      background: "#ffffff",
      colorText: "#060d05",
      market: {
        colorTitle: "#ffffff"
      },
      colorPrice: "#01615f",
      ratingColor: "#349a72",
      headerColor: "red",
      headerBackground: "#ffdad3",
      FavoriteBakcground: "#4a4a4a",
      favoriteIcon: "#cad0d0",
      ratingAndDistanceColor: "#3b3837",
    },
  },
};

// Add SHADOWS export
export const SHADOWS = {
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

interface FontFamily {
  poppins_black: string;
  poppins_bold: string;
  poppins_extrabold: string;
  poppins_extralight: string;
  poppins_light: string;
  poppins_medium: string;
  poppins_regular: string;
  poppins_semibold: string;
  poppins_thin: string;
}

export const FONTFAMILY: FontFamily = {
  poppins_black: 'Poppins-Black',
  poppins_bold: 'Poppins-Bold',
  poppins_extrabold: 'Poppins-ExtraBold',
  poppins_extralight: 'Poppins-ExtraLight',
  poppins_light: 'Poppins-Light',
  poppins_medium: 'Poppins-Medium',
  poppins_regular: 'Poppins-Regular',
  poppins_semibold: 'Poppins-SemiBold',
  poppins_thin: 'Poppins-Thin',
};

interface FontSize {
  size_8: number;
  size_10: number;
  size_12: number;
  size_14: number;
  size_16: number;
  size_18: number;
  size_20: number;
  size_24: number;
  size_28: number;
  size_30: number;
}

export const FONTSIZE: FontSize = {
  size_8: 8,
  size_10: 10,
  size_12: 12,
  size_14: 14,
  size_16: 16,
  size_18: 18,
  size_20: 20,
  size_24: 24,
  size_28: 28,
  size_30: 30,
};

// Add FONTS export that includes font sizes
export const FONTS = {
  // Font weights
  weightRegular: '400',
  weightMedium: '600',
  weightBold: '700',
  
  // Font sizes
  size10: 10,
  size12: 12,
  size14: 14,
  size16: 16,
  size18: 18,
  size20: 20,
  size24: 24,
  size28: 28,
  size32: 32,
  
  // Font family - use appropriate fonts available on the device
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System',
};

// Card style presets
export const CARD_STYLES = {
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

export const normalize = (size: number): number => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const getBottomSpace = (): number => {
  return Platform.OS === 'ios' && SCREEN_HEIGHT >= 812 ? 34 : 0;
};

export const getStatusBarHeight = (): number => {
  return Platform.OS === 'ios' ? (SCREEN_HEIGHT >= 812 ? 44 : 20) : 0;
};

// Responsive design utilities
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH >= 768;

export const getResponsiveValue = <T,>(phone: T, tablet: T): T => {
  return isTablet ? tablet : phone;
};

interface BorderRadius {
  radius_4: number;
  radius_8: number;
  radius_10: number;
  radius_15: number;
  radius_20: number;
  radius_25: number;
}

export const BORDERRADIUS: BorderRadius = {
  radius_4: 4,
  radius_8: 8,
  radius_10: 10,
  radius_15: 15,
  radius_20: 20,
  radius_25: 25,
};

// Add a default export with all theme variables
export default {
  COLORS,
  SPACING,
  SHADOWS,
  FONTS,
  FONTSIZE,
  FONTFAMILY,
  BORDERRADIUS,
  CARD_STYLES,
  normalize,
  getBottomSpace,
  getStatusBarHeight,
  isSmallDevice,
  isTablet,
  getResponsiveValue,
};