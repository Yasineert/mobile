import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import theme, { colors, spacing, borderRadius, shadows, typography } from '../theme/theme';

interface CardProps {
  title: string;
  subtitle?: string;
  description?: string;
  onPress?: () => void;
  style?: ViewStyle;
  rightContent?: React.ReactNode;
  leftIcon?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  status?: 'pending' | 'accepted' | 'rejected' | 'none';
}

const Card = ({
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
}: CardProps) => {
  
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows.small,
        };
      case 'elevated':
        return {
          backgroundColor: colors.white,
          ...shadows.medium,
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
    <View style={[styles.container, getCardStyle(), style]}>
      {status !== 'none' && (
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor() },
          ]}
        />
      )}

      <View style={styles.contentContainer}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          {description && <Text style={styles.description} numberOfLines={2}>{description}</Text>}
        </View>
        
        {rightContent && <View style={styles.rightContent}>{rightContent}</View>}
      </View>
      
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
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
  },
  statusIndicator: {
    height: 4,
    width: '100%',
  },
});

export default Card; 