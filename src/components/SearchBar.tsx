import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Text,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onFilterPress?: () => void;
  style?: ViewStyle;
  filterIcon?: React.ReactNode;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;
  showClearButton?: boolean;
  onClearPress?: () => void;
}

const SearchBar = ({
  placeholder = 'Rechercher...',
  value,
  onChangeText,
  onSubmit,
  onFilterPress,
  style,
  filterIcon,
  searchIcon,
  clearIcon,
  showClearButton = true,
  onClearPress,
}: SearchBarProps) => {
  const handleClear = () => {
    onChangeText('');
    if (onClearPress) {
      onClearPress();
    }
  };

  // Default icons if not provided
  const defaultSearchIcon = <Text style={styles.iconText}>🔍</Text>;
  const defaultClearIcon = <Text style={styles.iconText}>✕</Text>;
  const defaultFilterIcon = <Text style={styles.iconText}>⚙️</Text>;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <View style={styles.searchIconContainer}>
          {searchIcon || defaultSearchIcon}
        </View>
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        
        {value.length > 0 && showClearButton && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClear}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            {clearIcon || defaultClearIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {onFilterPress && (
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          {filterIcon || defaultFilterIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.l,
    paddingVertical: spacing.s,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 10,
  },
  searchIconContainer: {
    paddingHorizontal: spacing.m,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: typography.fontSizes.m,
    color: colors.text,
    paddingVertical: spacing.s,
  },
  clearButton: {
    padding: spacing.m,
  },
  filterButton: {
    marginLeft: spacing.m,
    width: 44,
    height: 44,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  iconText: {
    fontSize: typography.fontSizes.m,
  },
});

export default SearchBar; 