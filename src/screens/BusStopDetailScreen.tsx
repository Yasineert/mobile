import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Button from '../components/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import { busRoutes } from '../data/busData';
import { useRoute, useNavigation } from '@react-navigation/native';

const getStatusChip = (status: string) => {
  switch (status) {
    case 'current':
      return (
        <View style={[styles.statusChip, { backgroundColor: '#EAF2FF', flexDirection: 'row' }]}> 
          <Text style={styles.busIcon}>🚌</Text>
          <Text style={[styles.statusChipText, { color: colors.primary, marginLeft: 4 }]}>Current</Text>
        </View>
      );
    case 'on_time':
      return (
        <View style={[styles.statusChip, { backgroundColor: colors.success }]}> 
          <Text style={[styles.statusChipText, { color: colors.white }]}>On time</Text>
        </View>
      );
    case 'delayed':
      return (
        <View style={[styles.statusChip, { backgroundColor: colors.warning }]}> 
          <Text style={[styles.statusChipText, { color: colors.text }]}>Delayed</Text>
        </View>
      );
    default:
      return null;
  }
};

const BusStopDetailScreen = () => {
  const route = useRoute();
  const navigation: any = useNavigation();
  // @ts-ignore
  const { busId } = route.params || {};
  const bus = busRoutes.find((b) => b.id === busId);

  // Mock logic: current stop is the 4th, then on_time, delayed, etc.
  const getStatus = (idx: number) => {
    if (idx === 3) return 'current';
    if (idx === 6) return 'delayed';
    if (idx > 3 && idx !== 6) return 'on_time';
    return 'none';
  };

  // Mock arrival times
  const getTime = (idx: number) => {
    const base = 8 * 60; // 8:00 in minutes
    return `${Math.floor((base + idx * 10) / 60)}:${((base + idx * 10) % 60).toString().padStart(2, '0')}`;
  };

  if (!bus) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Bus not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bus № {bus.id}</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bus.stops.map((stop, idx) => (
          <View
            key={stop.id}
            style={[styles.stopCard, getStatus(idx) === 'current' && styles.currentStopCard]}
          >
            <View style={styles.stopHeader}>
              <Text style={styles.stopName}>{stop.name}</Text>
              {getStatusChip(getStatus(idx))}
            </View>
            <View style={styles.stopFooter}>
              <Text style={styles.arrivalIcon}>🕒</Text>
              <Text style={styles.arrivalText}>Next arrival : Today / {getTime(idx)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Button
        title="View in real time"
        variant="primary"
        size="large"
        style={styles.realtimeButton}
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
  scrollContent: {
    paddingBottom: 100,
  },
  stopCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.l,
    padding: spacing.m,
    marginBottom: spacing.s,
    ...shadows.small,
  },
  currentStopCard: {
    backgroundColor: '#EAF2FF',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stopName: {
    fontSize: typography.fontSizes.m,
    fontWeight: 'bold',
    color: colors.text,
  },
  statusChip: {
    borderRadius: borderRadius.s,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    flexDirection: 'row',
  },
  statusChipText: {
    fontWeight: '600',
    fontSize: typography.fontSizes.s,
    textAlign: 'center',
  },
  busIcon: {
    fontSize: 18,
  },
  stopFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  arrivalIcon: {
    fontSize: 16,
    color: colors.textSecondary,
    marginRight: 6,
  },
  arrivalText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  realtimeButton: {
    marginTop: 'auto',
    marginBottom: spacing.l,
    backgroundColor: colors.error,
    borderRadius: borderRadius.l,
  },
});

export default BusStopDetailScreen; 