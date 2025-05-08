import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';

export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  contractType: 'internship' | 'apprenticeship';
  postedDate: string;
  logoUrl?: string;
  isNew?: boolean;
  salary?: string;
}

interface InternshipCardProps {
  internship: Internship;
  onPress: () => void;
  horizontal?: boolean;
}

const InternshipCard = ({ internship, onPress, horizontal = false }: InternshipCardProps) => {
  const {
    title,
    company,
    location,
    duration,
    contractType,
    postedDate,
    logoUrl,
    isNew,
    salary,
  } = internship;

  // Default logo if none provided
  const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=random&size=100&color=fff`;
  
  // Format contract type label
  const contractTypeLabel = contractType === 'internship' ? 'Stage' : 'Alternance';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: logoUrl || defaultLogo }}
          style={styles.logo}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {isNew && <View style={styles.newBadge}><Text style={styles.newText}>Nouveau</Text></View>}
        </View>
        
        <Text style={styles.company}>{company}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏱️</Text>
            <Text style={styles.infoText}>{duration}</Text>
          </View>
          
          {salary && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💰</Text>
              <Text style={styles.infoText}>{salary}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.footerRow}>
          <View style={styles.contractTypeBadge}>
            <Text style={styles.contractTypeText}>{contractTypeLabel}</Text>
          </View>
          <Text style={styles.postedDate}>{postedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    marginBottom: spacing.m,
    ...shadows.small,
    overflow: 'hidden',
  },
  verticalContainer: {
    flexDirection: 'row',
    padding: spacing.m,
  },
  horizontalContainer: {
    width: 280,
    marginRight: spacing.m,
  },
  logoContainer: {
    marginRight: spacing.m,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.s,
  },
  newBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  newText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  company: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.s,
  },
  detailsContainer: {
    marginBottom: spacing.s,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoIcon: {
    width: 16,
    fontSize: typography.fontSizes.s,
    marginRight: spacing.xs,
  },
  infoText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  contractTypeBadge: {
    backgroundColor: colors.lightBackground,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  contractTypeText: {
    color: colors.primary,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
  },
  postedDate: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
});

export default InternshipCard; 