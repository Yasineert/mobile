import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNotifications } from '../context/NotificationsContext';
import { COLORS, FONTS, SPACING } from '../theme/theme';

interface NotificationIconProps {
  iconName: string;
  focused: boolean;
  color: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ 
  iconName, 
  focused, 
  color 
}) => {
  const { unreadCount } = useNotifications();
  
  return (
    <View style={styles.container}>
      <Icon name={iconName} size={24} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationIcon; 