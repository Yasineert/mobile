import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import { busRoutes } from '../data/busData';
import { useNavigation } from '@react-navigation/native';

const BUS_STATUSES = ['On time', 'Delayed', 'Canceled'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'On time':
      return colors.success;
    case 'Delayed':
      return colors.warning;
    case 'Canceled':
      return colors.error;
    default:
      return colors.muted;
  }
};

const BusStatusScreen = () => {
  const navigation: any = useNavigation();
  // Only show buses
  const buses = busRoutes.filter((route) => route.type === 'bus');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plympton Avenue</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableHeader, { flex: 1.2 }]}>Bus</Text>
          <Text style={[styles.tableHeader, { flex: 2 }]}>Destination</Text>
          <Text style={[styles.tableHeader, { flex: 1.2 }]}>ETA</Text>
          <Text style={[styles.tableHeader, { flex: 1.5 }]}>Status</Text>
        </View>
        {buses.map((bus, idx) => {
          const status = BUS_STATUSES[idx % BUS_STATUSES.length];
          return (
            <TouchableOpacity
              key={bus.id}
              style={styles.tableRow}
              onPress={() => navigation.navigate('BusStopDetail', { busId: bus.id })}
            >
              <Text style={[styles.tableCell, { flex: 1.2 }]}>№ {bus.id}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{bus.name}</Text>
              <Text style={[styles.tableCell, { flex: 1.2 }]}>{bus.frequency}</Text>
              <View style={[styles.statusChip, { backgroundColor: getStatusColor(status) }]}> 
                <Text style={styles.statusChipText}>{status}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: 31.6295,
            longitude: -7.9811,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          }}
        >
          {buses.map((bus) => (
            <Marker
              key={bus.id}
              coordinate={{
                latitude: bus.path[0][0],
                longitude: bus.path[0][1],
              }}
            >
              <View style={styles.busMarker}>
                <Text style={styles.busMarkerText}>{bus.id}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
      <Button
        title="Show a route"
        variant="primary"
        size="large"
        style={styles.routeButton}
        onPress={() => navigation.navigate('Search')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.l,
    color: colors.text,
  },
  tableContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.l,
    ...shadows.small,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  tableHeader: {
    fontWeight: 'bold',
    color: colors.textSecondary,
    fontSize: typography.fontSizes.m,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  tableCell: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  statusChip: {
    borderRadius: borderRadius.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  statusChipText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: typography.fontSizes.s,
    textAlign: 'center',
  },
  mapContainer: {
    height: 220,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    marginBottom: spacing.l,
  },
  map: {
    flex: 1,
  },
  busMarker: {
    backgroundColor: colors.text,
    borderRadius: borderRadius.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busMarkerText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: typography.fontSizes.m,
  },
  routeButton: {
    marginTop: 'auto',
    marginBottom: spacing.l,
    backgroundColor: colors.error,
    borderRadius: borderRadius.l,
  },
});

export default BusStatusScreen; 