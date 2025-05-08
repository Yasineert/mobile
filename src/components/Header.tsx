import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import theme, { colors, spacing, shadows, typography, borderRadius } from '../theme/theme';

interface HeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  transparent?: boolean;
  style?: ViewStyle;
  elevated?: boolean;
  subtitle?: string;
}

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
  style,
  elevated = true,
  subtitle,
}: HeaderProps) => {
  // Button press animations
  const [leftScale] = useState(new Animated.Value(1));
  const [rightScale] = useState(new Animated.Value(1));

  const animateButton = (animatedValue: Animated.Value, active: boolean) => {
    Animated.timing(animatedValue, {
      toValue: active ? 0.9 : 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleLeftPressIn = () => {
    if (onLeftPress) {
      animateButton(leftScale, true);
    }
  };

  const handleLeftPressOut = () => {
    if (onLeftPress) {
      animateButton(leftScale, false);
    }
  };

  const handleRightPressIn = () => {
    if (onRightPress) {
      animateButton(rightScale, true);
    }
  };

  const handleRightPressOut = () => {
    if (onRightPress) {
      animateButton(rightScale, false);
    }
  };

  const backgroundColor = transparent ? 'transparent' : colors.primary;
  const headerShadows = elevated && !transparent ? shadows.medium : {};

  return (
    <>
      <StatusBar 
        backgroundColor={transparent ? 'transparent' : colors.primary} 
        barStyle={transparent ? 'dark-content' : 'light-content'}
        translucent={transparent}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor,
            ...headerShadows,
          },
          style,
        ]}
      >
        <View style={styles.leftContainer}>
          {leftIcon && (
            <Animated.View style={{ transform: [{ scale: leftScale }] }}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  transparent ? styles.iconButtonTransparent : null
                ]}
                onPress={onLeftPress}
                onPressIn={handleLeftPressIn}
                onPressOut={handleLeftPressOut}
                disabled={!onLeftPress}
              >
                {leftIcon}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              { color: transparent ? colors.text : colors.white },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                { color: transparent ? colors.textSecondary : `${colors.white}CC` },
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightIcon && (
            <Animated.View style={{ transform: [{ scale: rightScale }] }}>
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  transparent ? styles.iconButtonTransparent : null
                ]}
                onPress={onRightPress}
                onPressIn={handleRightPressIn}
                onPressOut={handleRightPressOut}
                disabled={!onRightPress}
              >
                {rightIcon}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    zIndex: 10,
    ...(Platform.OS === 'ios' ? { paddingTop: 0 } : { paddingTop: 0 }),
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
    textAlign: 'center',
    marginTop: 2,
  },
  iconButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.circle,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonTransparent: {
    backgroundColor: `${colors.white}80`,
    ...shadows.small,
  },
});

export default Header; 