import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { busRoutes } from '../data/busData';

// Mock data for favorite routes
const FAVOURITE_ROUTES = [
  {
    id: '1',
    type: 'bus',
    name: 'Bus № 31',
    from: '72-74 Oxford St.',
    to: '20 Grosvenor Sq.',
    nextArrival: 'Today / 11:00',
    price: '100dh',
  },
  {
    id: '2',
    type: 'metro',
    name: 'Central Line',
    from: 'Great Portland St.',
    to: 'Baker Street',
    nextArrival: 'Today / 11:15',
    price: '50dh',
  },
  {
    id: '3',
    type: 'tram',
    name: 'Tram № 17',
    from: '377 Durnsford Rd.',
    to: '136 Buckhold Rd.',
    nextArrival: 'Today / 11:15',
    price: '50dh',
  },
];

const FILTERS = [
  { key: 'all', label: 'All', icon: 'apps-outline' },
  { key: 'bus', label: 'Bus', icon: 'bus-outline' },
  { key: 'tram', label: 'Tram', icon: 'train-outline' },
];

const getInitialFavorites = () =>
  busRoutes.map(route => ({
    id: route.id,
    type: route.type || 'bus',
    name: route.name,
    from: route.stops[0]?.name || '',
    to: route.stops[route.stops.length - 1]?.name || '',
    nextArrival: 'Today / 11:10', // Placeholder
    price: route.fare + 'dh',
  }));

const SavedInternshipsScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [routes, setRoutes] = useState(getInitialFavorites());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusRoute, setSelectedBusRoute] = useState<typeof busRoutes[0] | null>(null);

  const filteredRoutes = selectedFilter === 'all'
    ? routes
    : routes.filter(route => route.type === selectedFilter);

  const handleSaveRoute = () => {
    if (selectedBusRoute) {
      setRoutes([
        ...routes,
        {
          id: (routes.length + 1).toString(),
          type: selectedBusRoute.type || 'bus',
          name: selectedBusRoute.name,
          from: selectedBusRoute.stops[0]?.name || '',
          to: selectedBusRoute.stops[selectedBusRoute.stops.length - 1]?.name || '',
          nextArrival: 'Today / 12:00', // Placeholder
          price: selectedBusRoute.fare + 'dh',
        },
      ]);
      setModalVisible(false);
      setSelectedBusRoute(null);
    }
  };

  const handleRemoveRoute = (name: string) => {
    setRoutes(routes.filter(route => route.name !== name));
  };

  const renderRouteCard = ({ item }: { item: typeof FAVOURITE_ROUTES[0] }) => (
    <View style={styles.routeCard}>
      <View style={styles.routeCardHeader}>
        <View style={styles.routeTypeIcon}>
          <Ionicons
            name={
              item.type === 'bus' ? 'bus-outline' :
              item.type === 'tram' ? 'train-outline' :
              'bus-outline'
            }
            size={22}
            color="#1E88E5"
          />
        </View>
        <Text style={styles.routeName}>{item.name}</Text>
        <View style={styles.arrivalRow}>
          <Ionicons name="time-outline" size={16} color="#888" style={{ marginRight: 2 }} />
          <Text style={styles.arrivalText}>Next arrival : {item.nextArrival}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemoveRoute(item.name)}>
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      <View style={styles.routeCardBody}>
        <Text style={styles.routeFromTo}>↘ From: {item.from}</Text>
        <Text style={styles.routeFromTo}>↗ To: {item.to}</Text>
        <Text style={styles.routePrice}>price:{item.price}</Text>
      </View>
    </View>
  );

  // Only show routes not already in favorites and matching the filter
  const availableBusRoutes = busRoutes.filter(
    r => !routes.some(fav => fav.name === r.name) &&
      (selectedFilter === 'all' || r.type === selectedFilter)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favourite routes</Text>
      <View style={styles.filterBar}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterButton, selectedFilter === f.key && styles.filterButtonActive]}
            onPress={() => setSelectedFilter(f.key)}
          >
            <Ionicons name={f.icon} size={18} color={selectedFilter === f.key ? '#fff' : '#1E88E5'} />
            <Text style={[styles.filterLabel, selectedFilter === f.key && styles.filterLabelActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredRoutes}
        renderItem={renderRouteCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListFooterComponent={
          <TouchableOpacity style={styles.addRouteCard} onPress={() => setModalVisible(true)}>
            <Text style={styles.addRouteText}>Add new route </Text>
            <Ionicons name="add-circle-outline" size={20} color="#1E88E5" />
          </TouchableOpacity>
        }
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Route</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 16 }}>
              {availableBusRoutes.map(route => (
                <TouchableOpacity
                  key={route.id}
                  style={[styles.modalRouteButton, selectedBusRoute?.id === route.id && styles.modalRouteButtonActive]}
                  onPress={() => setSelectedBusRoute(route)}
                >
                  <Text style={[styles.modalRouteName, selectedBusRoute?.id === route.id && styles.modalRouteNameActive]}>{route.name}</Text>
                  <Text style={styles.modalRouteStops}>{route.stops[0]?.name} → {route.stops[route.stops.length - 1]?.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {selectedBusRoute && (
              <View style={styles.modalRouteDetails}>
                <Text style={styles.modalRouteDetailText}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {selectedBusRoute.name}</Text>
                <Text style={styles.modalRouteDetailText}><Text style={{ fontWeight: 'bold' }}>From:</Text> {selectedBusRoute.stops[0]?.name}</Text>
                <Text style={styles.modalRouteDetailText}><Text style={{ fontWeight: 'bold' }}>To:</Text> {selectedBusRoute.stops[selectedBusRoute.stops.length - 1]?.name}</Text>
                <Text style={styles.modalRouteDetailText}><Text style={{ fontWeight: 'bold' }}>Fare:</Text> {selectedBusRoute.fare}dh</Text>
                <Text style={styles.modalRouteDetailText}><Text style={{ fontWeight: 'bold' }}>Frequency:</Text> {selectedBusRoute.frequency}</Text>
              </View>
            )}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalVisible(false); setSelectedBusRoute(null); }}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveButton, !selectedBusRoute && { opacity: 0.5 }]}
                onPress={handleSaveRoute}
                disabled={!selectedBusRoute}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    color: '#222',
    textAlign: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#f2f4f7',
    borderRadius: 12,
    marginBottom: 18,
    padding: 4,
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#1E88E5',
  },
  filterLabel: {
    marginLeft: 6,
    color: '#1E88E5',
    fontWeight: '500',
    fontSize: 15,
  },
  filterLabelActive: {
    color: '#fff',
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTypeIcon: {
    marginRight: 10,
    backgroundColor: '#eaf2fb',
    borderRadius: 6,
    padding: 4,
  },
  routeName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1E88E5',
    flex: 1,
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrivalText: {
    fontSize: 13,
    color: '#888',
  },
  routeCardBody: {
    marginTop: 4,
  },
  routeFromTo: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  routePrice: {
    fontSize: 15,
    color: '#1E88E5',
    fontWeight: '600',
    marginTop: 4,
  },
  addRouteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addRouteText: {
    color: '#1E88E5',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1E88E5',
    textAlign: 'center',
  },
  modalRouteButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#f2f4f7',
  },
  modalRouteButtonActive: {
    backgroundColor: '#1E88E5',
  },
  modalRouteName: {
    fontSize: 15,
    color: '#1E88E5',
    fontWeight: '600',
  },
  modalRouteNameActive: {
    color: '#fff',
  },
  modalRouteStops: {
    fontSize: 13,
    color: '#666',
  },
  modalRouteDetails: {
    marginBottom: 10,
  },
  modalRouteDetailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  modalCancelText: {
    color: '#1E88E5',
    fontWeight: '600',
    fontSize: 15,
  },
  modalSaveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
});

export default SavedInternshipsScreen; 