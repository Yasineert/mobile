import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

interface BusData {
  id: string;
  number: string;
  destination: string;
  eta: string;
  status: 'on time' | 'delayed' | 'cancelled';
}

// Define navigation props type
type BusStopScreenNavigationProp = StackNavigationProp<any, 'BusStop'>;
type BusStopScreenRouteProp = RouteProp<any, 'BusStop'>;

interface BusStopScreenProps {
  navigation: BusStopScreenNavigationProp;
  route: BusStopScreenRouteProp;
}

const BusStopScreen = ({ navigation, route }: BusStopScreenProps) => {
  // Normally you would get this from route.params
  const stopName = "Jamaa El-Fna Square";

  // Mock data for bus routes in Marrakech
  const busRoutes: BusData[] = [
    {
      id: '1',
      number: 'L3',
      destination: 'Guéliz Center',
      eta: '5 min',
      status: 'on time',
    },
    {
      id: '2',
      number: 'L8',
      destination: 'Marrakech Menara Airport',
      eta: '10 min',
      status: 'on time',
    },
    {
      id: '3',
      number: 'L16',
      destination: 'Majorelle Garden',
      eta: '22 min',
      status: 'on time',
    },
    {
      id: '4',
      number: 'T2',
      destination: 'Marrakech Train Station',
      eta: '25 min',
      status: 'cancelled',
    },
  ];

  const renderBusRoute = (item: BusData) => {
    return (
      <View style={styles.busRouteItem}>
        <View style={styles.busInfo}>
          <View style={styles.busNumberContainer}>
            <Text style={styles.busNumber}>{item.number}</Text>
          </View>
          
          <View style={styles.busDestination}>
            <Text style={styles.destinationText}>{item.destination}</Text>
          </View>
        </View>
        
        <View style={styles.timeInfo}>
          <View style={styles.busEta}>
            <Text style={styles.etaText}>{item.eta}</Text>
          </View>
          
          <View style={[
            styles.busStatus, 
            item.status === 'on time' ? styles.onTime : 
            item.status === 'delayed' ? styles.delayed : styles.cancelled
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{stopName}</Text>
      </View>

      {/* Tabs for Bus Routes */}
      <View style={styles.tabContainer}>
        <View style={styles.tabs}>
          <Text style={styles.tabLabel}>Bus</Text>
          <Text style={styles.tabLabel}>Destination</Text>
          <Text style={styles.tabLabel}>ETA</Text>
          <Text style={styles.tabLabel}>Status</Text>
        </View>
      </View>

      {/* List of Bus Routes */}
      <FlatList
        data={busRoutes}
        renderItem={({ item }) => renderBusRoute(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.busList}
      />

      {/* Show Route Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.showRouteButton}>
          <Text style={styles.buttonText}>Show a route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabLabel: {
    fontSize: 14,
    color: '#888',
  },
  busList: {
    padding: 16,
  },
  busRouteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  busInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busNumberContainer: {
    marginRight: 16,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  busDestination: {
    flex: 1,
  },
  destinationText: {
    fontSize: 14,
    color: '#333',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  busEta: {
    marginRight: 12,
  },
  etaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  busStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  onTime: {
    backgroundColor: '#2ecc71',
  },
  delayed: {
    backgroundColor: '#f39c12',
  },
  cancelled: {
    backgroundColor: '#e74c3c',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 20,
  },
  showRouteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusStopScreen;