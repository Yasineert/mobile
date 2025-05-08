// Define theme constants
const colors = {
  primary: '#0056B3', // Main primary color (Ministry's blue)
  secondary: '#32CD32', // Secondary green color
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#DEE2E6',
  notification: '#FF6B6B',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  muted: '#ADB5BD',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

const typography = {
  fontSizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 16,
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
};

const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
};

const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  circle: 9999,
};

// Create the theme object
const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
};

// Export the theme and its components
export { colors, spacing, typography, shadows, borderRadius };
export default theme; 