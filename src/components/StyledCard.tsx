import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Animated, Platform } from 'react-native';
import theme, { colors, spacing, shadows, typography, borderRadius } from '../theme/theme';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  style?: ViewStyle;
  rightContent?: React.ReactNode;
  leftIcon?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'gradient';
  status?: 'pending' | 'accepted' | 'rejected' | 'none';
  highlight?: boolean;
}

const StyledCard = ({
  title,
  subtitle,
  description,
  onPress,
  style,
  rightContent,
  leftIcon,
  footer,
  variant = 'default',
  status = 'none',
  highlight = false,
}: CardProps) => {
  // Animation for card press feedback
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: colors.white,
    };
    
    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'elevated':
        return {
          ...baseStyle,
          ...shadows.medium,
          borderWidth: 0.5,
          borderColor: 'rgba(0,0,0,0.05)',
        };
      case 'gradient':
        return {
          ...baseStyle,
          ...shadows.medium,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        };
      default:
        return {
          backgroundColor: colors.card,
        };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'accepted':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return 'transparent';
    }
  };

  const cardContent = (
    <Animated.View 
      style={[
        styles.container, 
        getCardStyle(), 
        highlight && styles.highlightedCard,
        { transform: [{ scale: scaleAnim }] },
        style
      ]}
    >
      {status !== 'none' && (
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor() },
          ]}
        />
      )}

      <View style={styles.contentContainer}>
        {leftIcon && (
          <View style={[
            styles.leftIconContainer,
            variant === 'gradient' && styles.gradientLeftIcon
          ]}>
            {leftIcon}
          </View>
        )}
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          {description && <Text style={styles.description} numberOfLines={2}>{description}</Text>}
        </View>
        
        {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      </View>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    marginVertical: spacing.s,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  highlightedCard: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: `${colors.primary}05`, // Very light primary color with transparency
  },
  contentContainer: {
    flexDirection: 'row',
    padding: spacing.m,
  },
  leftIconContainer: {
    marginRight: spacing.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientLeftIcon: {
    backgroundColor: `${colors.primary}10`,
    padding: spacing.xs,
    borderRadius: borderRadius.m,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rightContent: {
    marginLeft: spacing.s,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.m,
    backgroundColor: `${colors.card}80`,
  },
  statusIndicator: {
    height: 4,
    width: '100%',
  },
});

export default StyledCard; 