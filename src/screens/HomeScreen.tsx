import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const RED = '#E53935';

const TRANSPORT_CARD = {
  balance: '100dh',
  passId: '798 014',
  title: 'Marrakech Ride',
};

const TRIPS = [
  {
    type: 'bus',
    number: '31',
    from: '72-74 Oxford St.',
    to: '20 Grosvenor Sq.',
    price: '10 dh',
  },
  {
    type: 'metro',
    number: 'Central Line',
    from: 'Great Portland St.',
    to: 'Baker Street',
    price: '50 dh',
  },
  {
    type: 'bus',
    number: '79',
    from: '103 Seymour Pl.',
    to: 'London NW1 5BR',
    price: '70 dh',
  },
  {
    type: 'tram',
    number: '17',
    from: '377 Durnsford Rd.',
    to: '136 Buckhold Rd.',
    price: '40 dh',
  },
  {
    type: 'tram',
    number: '9',
    from: '...',
    to: '...',
    price: '90 dh',
  },
  {
    type: 'bus',
    number: '90',
    from: '...',
    to: '...',
    price: '60 dh',
  },
];

const getTransportIcon = (type: string) => {
  switch (type) {
    case 'bus':
      return '🚌';
    case 'tram':
      return '🚋';
    case 'metro':
      return '🚇';
    default:
      return '🚍';
  }
};

const HomeScreen = () => {
  const navigation: any = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="View Bus Status"
        variant="primary"
        size="large"
        style={{ margin: 16 }}
        onPress={() => navigation.navigate('BusStatus')}
      />
      <StatusBar backgroundColor={RED} barStyle="light-content" />
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <Text style={styles.searchBarText}>Marrakech transport</Text>
        <TouchableOpacity style={styles.bellButton}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
      {/* Transport Card */}
      <View style={styles.transportCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={styles.transportCardTitle}>{TRANSPORT_CARD.title}</Text>
          <TouchableOpacity>
            <Text style={styles.cardMenuIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.transportCardBalanceLabel}>Balance</Text>
        <Text style={styles.transportCardBalance}>{TRANSPORT_CARD.balance}</Text>
        <View style={styles.transportCardFooter}>
          <Text style={styles.transportCardPassIdLabel}>Pass id</Text>
          <Text style={styles.transportCardPassId}>{TRANSPORT_CARD.passId}</Text>
        </View>
      </View>
      {/* Add new pass */}
      <TouchableOpacity style={styles.addPassButton}>
        <Text style={styles.addPassText}>Add new pass</Text>
        <Text style={styles.addPassPlus}>＋</Text>
      </TouchableOpacity>
      {/* Last Trips */}
      <View style={styles.lastTripsHeaderRow}>
        <Text style={styles.lastTripsHeader}>Your last trips</Text>
        <TouchableOpacity>
          <Text style={styles.lastTripsMenu}>☰</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.tripsList} showsVerticalScrollIndicator={false}>
        <View style={styles.tripsGrid}>
          {TRIPS.map((trip, idx) => (
            <View key={idx} style={styles.tripCard}>
              <View style={styles.tripCardHeader}>
                <Text style={styles.tripIcon}>{getTransportIcon(trip.type)}</Text>
                <Text style={styles.tripTitle}>
                  {trip.type === 'metro' ? trip.number : `${trip.type.charAt(0).toUpperCase() + trip.type.slice(1)} Nº ${trip.number}`}
                </Text>
              </View>
              <Text style={styles.tripFromTo}>
                <Text style={styles.tripArrow}>↖ </Text>From: {trip.from}
              </Text>
              <Text style={styles.tripFromTo}>
                <Text style={styles.tripArrow}>↘ </Text>To: {trip.to}
              </Text>
              <Text style={styles.tripPriceLabel}>Price:</Text>
              <Text style={styles.tripPrice}>{trip.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Bottom Navigation (placeholder, as actual navigation is handled elsewhere) */}
      <View style={styles.bottomNav}>
        <Text style={styles.bottomNavIcon}>🏠</Text>
        <Text style={styles.bottomNavIcon}>🔍</Text>
        <Text style={styles.bottomNavIconActive}>⬜</Text>
        <Text style={styles.bottomNavIcon}>⚙️</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarWrapper: {
    backgroundColor: RED,
    borderRadius: 12,
    margin: spacing.l,
    marginBottom: spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    justifyContent: 'space-between',
  },
  searchBarText: {
    color: colors.white,
    fontSize: typography.fontSizes.l,
    fontWeight: '500',
    flex: 1,
  },
  bellButton: {
    marginLeft: spacing.m,
    padding: spacing.s,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  bellIcon: {
    fontSize: 22,
    color: colors.white,
  },
  transportCard: {
    backgroundColor: RED,
    borderRadius: 18,
    marginHorizontal: spacing.l,
    marginBottom: spacing.s,
    padding: spacing.l,
    ...shadows.medium,
  },
  transportCardTitle: {
    color: colors.white,
    fontSize: typography.fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.s,
  },
  cardMenuIcon: {
    color: colors.white,
    fontSize: 22,
    opacity: 0.8,
  },
  transportCardBalanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSizes.s,
    marginTop: spacing.s,
  },
  transportCardBalance: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  transportCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  transportCardPassIdLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: typography.fontSizes.s,
  },
  transportCardPassId: {
    color: colors.white,
    fontSize: typography.fontSizes.l,
    fontWeight: '600',
  },
  addPassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: spacing.s,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    ...shadows.small,
  },
  addPassText: {
    color: RED,
    fontWeight: '600',
    fontSize: typography.fontSizes.m,
    marginRight: spacing.s,
  },
  addPassPlus: {
    color: RED,
    fontSize: 22,
    fontWeight: '700',
  },
  lastTripsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    marginBottom: spacing.s,
  },
  lastTripsHeader: {
    fontSize: typography.fontSizes.l,
    fontWeight: '700',
    color: colors.text,
  },
  lastTripsMenu: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  tripsList: {
    paddingBottom: 100,
  },
  tripsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: spacing.l,
  },
  tripCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    width: '47%',
    marginBottom: spacing.l,
    padding: spacing.m,
    ...shadows.small,
  },
  tripCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  tripIcon: {
    fontSize: 24,
    marginRight: spacing.s,
  },
  tripTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: '600',
    color: colors.text,
  },
  tripFromTo: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  tripArrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tripPriceLabel: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginTop: spacing.s,
  },
  tripPrice: {
    fontSize: typography.fontSizes.m,
    fontWeight: 'bold',
    color: RED,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...shadows.medium,
  },
  bottomNavIcon: {
    fontSize: 28,
    color: colors.textSecondary,
    opacity: 0.7,
  },
  bottomNavIconActive: {
    fontSize: 28,
    color: RED,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 