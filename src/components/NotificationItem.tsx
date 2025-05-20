import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Notification } from '../context/NotificationsContext';
import { COLORS, FONTS, SPACING, SHADOWS } from '../theme/theme';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) => {
  const navigation = useNavigation();
  const { id, title, message, type, read, timestamp, action } = notification;
  
  // Format the date
  const formattedDate = new Date(timestamp).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric', 
    month: 'short'
  });

  // Get the appropriate icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  // Get the background color based on type
  const getBackgroundColor = () => {
    if (!read) {
      return COLORS.primary + '10'; // Light background for unread
    }
    return 'transparent';
  };

  // Get the icon color based on type
  const getIconColor = () => {
    switch (type) {
      case 'info':
        return COLORS.primary;
      case 'warning':
        return COLORS.warning;
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  const handlePress = () => {
    if (!read) {
      onMarkAsRead(id);
    }
    
    if (action) {
      // @ts-ignore - Navigation typing issues
      navigation.navigate(action.screen, action.params);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Icon name={getIcon()} size={20} color={getIconColor()} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, !read && styles.unreadTitle]}>{title}</Text>
          {!read && <View style={styles.unreadDot} />}
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formattedDate}</Text>
          
          {action && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePress}
            >
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
      >
        <Icon name="close" size={16} color={COLORS.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.m,
    marginVertical: SPACING.s,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    ...SHADOWS.small,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.size16,
    fontWeight: FONTS.weightMedium,
    color: COLORS.text,
    marginRight: SPACING.s,
  },
  unreadTitle: {
    fontWeight: FONTS.weightBold,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  message: {
    fontSize: FONTS.size14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.s,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: FONTS.size12,
    color: COLORS.textLight,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 8,
  },
  actionText: {
    fontSize: FONTS.size12,
    fontWeight: FONTS.weightMedium,
    color: COLORS.primary,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.s,
  },
});

export default NotificationItem; 