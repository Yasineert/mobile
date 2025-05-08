import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { busRoutes } from '../data/busData';

const getColor = (route: any) => route.color || '#1E88E5';

const groupByType = (routes: any[]) => {
  const bus = routes.filter((r: any) => r.type === 'bus');
  const tram = routes.filter((r: any) => r.type === 'tram');
  return { bus, tram };
};

const ApplyFormScreen = () => {
  const [search, setSearch] = useState('');
  const { bus, tram } = groupByType(
    busRoutes.filter((r: any) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const renderLine = (route: any) => (
    <View key={route.id} style={[styles.lineBox, { borderColor: getColor(route) }]}> 
      <View style={[styles.lineIdBox, { backgroundColor: getColor(route) }]}> 
        <Text style={styles.lineId}>{route.id}</Text>
      </View>
      <Text style={styles.lineName}>{route.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All lines</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Which line"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Bus</Text>
        <View style={styles.linesRow}>{bus.map(renderLine)}</View>
        <Text style={styles.sectionTitle}>Tram</Text>
        <View style={styles.linesRow}>{tram.map(renderLine)}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#f2f4f7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 18,
    marginBottom: 8,
  },
  linesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  lineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  lineIdBox: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  lineId: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  lineName: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
});

export default ApplyFormScreen;
