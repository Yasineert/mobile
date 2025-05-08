import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import StyledCard from '../components/StyledCard';

interface ProfileScreenProps {
  navigation: any;
}

// Mock user data
const USER = {
  id: '1',
  name: 'Aglagal Hamza',
  email: 'Aglagal.hamza@gmail.com',
  avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
  education: 'Licence en informatique',
  location: 'Rabat, Maroc',
  resumeUploaded: true,
  bio: 'Étudiant en informatique passionné par le développement web et mobile. À la recherche d\'opportunités de stage pour mettre en pratique mes compétences.',
  skills: ['React', 'JavaScript', 'Node.js', 'UI/UX', 'Figma'],
  experience: [
    {
      title: 'Développeur Frontend Stagiaire',
      company: 'TechMaroc',
      duration: 'Juin 2022 - Août 2022',
    }
  ],
  completion: 85, // Pourcentage de complétion du profil
};

// Menu items data for better organization
const MENU_ITEMS = [
  {
    id: 'applications',
    icon: '📋',
    title: 'Mes candidatures',
    subtitle: 'Gérer vos candidatures en cours',
    route: 'MyApplications',
    badge: 3,
  },
  {
    id: 'saved',
    icon: '❤️',
    title: 'Offres sauvegardées',
    subtitle: 'Voir vos offres favorites',
    route: 'SavedInternships',
    badge: 5,
  },
  {
    id: 'resume',
    icon: '📄',
    title: 'Mon CV',
    subtitle: 'Voir et modifier votre CV',
    route: 'ResumePreview',
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Notifications',
    subtitle: 'Gérer vos préférences de notification',
    route: 'NotificationSettings',
  },
  {
    id: 'privacy',
    icon: '🔒',
    title: 'Confidentialité',
    subtitle: 'Paramètres de confidentialité',
    route: 'PrivacySettings',
  },
  {
    id: 'appearance',
    icon: '🌙',
    title: 'Apparence',
    subtitle: 'Personnaliser l\'apparence de l\'application',
    route: 'AppearanceSettings',
  }
];

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;
const PROFILE_IMAGE_SIZE = 110;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeTab, setActiveTab] = useState('about');
  
  // Animation values for header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT, Platform.OS === 'ios' ? 90 : 70],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const profileImageSize = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [PROFILE_IMAGE_SIZE, 40],
    extrapolate: 'clamp',
  });
  
  const profileImageMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT - PROFILE_IMAGE_SIZE / 2, 10],
    extrapolate: 'clamp',
  });
  
  const profileImageMarginLeft = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [(width - PROFILE_IMAGE_SIZE) / 2, 60],
    extrapolate: 'clamp',
  });
  
  const nameOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 1.5, HEADER_HEIGHT],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const namePositionX = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, 110],
    extrapolate: 'clamp',
  });
  
  // Progress bar for profile completion
  const ProfileCompletionBar = () => (
    <View style={styles.completionContainer}>
      <View style={styles.completionHeader}>
        <Text style={styles.completionTitle}>Profil complété à {USER.completion}%</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.completionAction}>Compléter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${USER.completion}%` }
          ]} 
        />
      </View>
      
      {USER.completion < 100 && (
        <Text style={styles.completionHint}>
          Complétez votre profil pour augmenter vos chances d'être remarqué
        </Text>
      )}
    </View>
  );
  
  // Tabs for switching between profile sections
  const ProfileTabs = () => {
    const tabs = [
      { id: 'about', label: 'À propos' },
      { id: 'experience', label: 'Expérience' },
      { id: 'skills', label: 'Compétences' },
    ];
    
    return (
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity 
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text 
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel
              ]}
            >
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  // Tab content based on active tab
  const TabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.bioText}>{USER.bio}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📧</Text>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{USER.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>📍</Text>
                <Text style={styles.infoLabel}>Localisation</Text>
                <Text style={styles.infoValue}>{USER.location}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🎓</Text>
                <Text style={styles.infoLabel}>Éducation</Text>
                <Text style={styles.infoValue}>{USER.education}</Text>
              </View>
            </View>
          </View>
        );
      case 'experience':
        return (
          <View style={styles.tabContent}>
            {USER.experience.length > 0 ? (
              USER.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <View style={styles.experienceDot} />
                  <View style={styles.experienceContent}>
                    <Text style={styles.experienceTitle}>{exp.title}</Text>
                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                    <Text style={styles.experienceDuration}>{exp.duration}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Aucune expérience ajoutée. Ajoutez des expériences pour améliorer votre profil.
                </Text>
                <TouchableOpacity 
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('EditProfile')}
                >
                  <Text style={styles.emptyStateButtonText}>Ajouter une expérience</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      case 'skills':
        return (
          <View style={styles.tabContent}>
            <View style={styles.skillsContainer}>
              {USER.skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  
  // MenuItem component
  const MenuItem = ({ icon, title, subtitle, onPress, badge = null }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconContainer}>
        <Text style={styles.menuIcon}>{icon}</Text>
        {badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=1064' }} 
          style={styles.headerBackground}
        />
        <View style={styles.headerOverlay} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>
      </Animated.View>
      
      {/* Floating header with name */}
      <Animated.View 
        style={[
          styles.floatingHeader,
          {
            opacity: nameOpacity,
          }
        ]}
      >
        <Animated.Text 
          style={[
            styles.floatingHeaderTitle,
            {
              transform: [{ translateX: namePositionX }]
            }
          ]}
        >
          {USER.name}
        </Animated.Text>
        
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Animated Profile Image */}
      <Animated.View
        style={[
          styles.profileImageContainer,
          {
            width: profileImageSize,
            height: profileImageSize,
            borderRadius: profileImageSize,
            transform: [
              { translateY: profileImageMarginTop },
              { translateX: profileImageMarginLeft }
            ],
          }
        ]}
      >
        <Image 
          source={{ uri: USER.avatar }} 
          style={styles.profileImage}
        />
      </Animated.View>
      
      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Spacer to account for profile image */}
        <View style={{ height: HEADER_HEIGHT + 60 }} />
        
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{USER.name}</Text>
          <Text style={styles.userTitle}>{USER.education}</Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.userLocation}>{USER.location}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile', { user: USER })}
          >
            <Text style={styles.editProfileButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>
        
        {/* Profile Completion */}
        <ProfileCompletionBar />
        
        {/* Profile Content Tabs */}
        <View style={styles.profileContentContainer}>
          <ProfileTabs />
          <TabContent />
        </View>
        
        {/* Quick Access */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>
          <View style={styles.quickAccessGrid}>
            {MENU_ITEMS.slice(0, 3).map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.quickAccessIconContainer}>
                  <Text style={styles.quickAccessIcon}>{item.icon}</Text>
                  {item.badge && (
                    <View style={styles.quickAccessBadge}>
                      <Text style={styles.quickAccessBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quickAccessLabel}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.slice(3).map(item => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                badge={item.badge}
                onPress={() => navigation.navigate(item.route)}
              />
            ))}
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={() => {
            // Handle logout logic
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }}
        >
          <Text style={styles.logoutButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    height: '100%',
    justifyContent: 'flex-end',
    padding: spacing.l,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.white,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    zIndex: 3,
  },
  floatingHeaderTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: '700',
    color: colors.white,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsButtonText: {
    fontSize: 20,
  },
  profileImageContainer: {
    position: 'absolute',
    zIndex: 2,
    borderWidth: 3,
    borderColor: colors.white,
    overflow: 'hidden',
    ...shadows.medium,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    zIndex: 0,
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  userName: {
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userTitle: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  locationIcon: {
    fontSize: typography.fontSizes.s,
    marginRight: spacing.xs,
  },
  userLocation: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  editProfileButton: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    backgroundColor: colors.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.small,
  },
  editProfileButtonText: {
    fontSize: typography.fontSizes.s,
    fontWeight: '600',
    color: colors.primary,
  },
  completionContainer: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    ...shadows.small,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  completionTitle: {
    fontSize: typography.fontSizes.s,
    fontWeight: '600',
    color: colors.text,
  },
  completionAction: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.lightBackground,
    borderRadius: 4,
    marginBottom: spacing.s,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  completionHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  profileContentContainer: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    ...shadows.small,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.m,
    position: 'relative',
  },
  activeTabButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  tabLabel: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 30,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabContent: {
    padding: spacing.m,
  },
  bioText: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.m,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  infoItem: {
    flex: 1,
    marginRight: spacing.s,
  },
  infoIcon: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
    fontWeight: '500',
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  experienceDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: spacing.s,
  },
  experienceContent: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  experienceCompany: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  experienceDuration: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: colors.lightBackground,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginRight: spacing.s,
    marginBottom: spacing.s,
  },
  skillText: {
    fontSize: typography.fontSizes.xs,
    color: colors.text,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.m,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    fontSize: typography.fontSizes.s,
    color: colors.white,
    fontWeight: '600',
  },
  quickAccessContainer: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.m,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    width: width * 0.27,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    alignItems: 'center',
    ...shadows.small,
  },
  quickAccessIconContainer: {
    position: 'relative',
    marginBottom: spacing.s,
  },
  quickAccessIcon: {
    fontSize: 24,
  },
  quickAccessBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '700',
  },
  quickAccessLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  menuContainer: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    overflow: 'hidden',
    ...shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIconContainer: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  menuIcon: {
    fontSize: 20,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: '700',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: typography.fontSizes.s,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.muted,
  },
  logoutButton: {
    marginHorizontal: spacing.l,
    marginBottom: spacing.l,
    backgroundColor: '#FEE2E2',
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: typography.fontSizes.m,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  lightBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default ProfileScreen; 