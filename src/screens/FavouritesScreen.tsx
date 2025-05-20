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

interface FavoriteRoute {
  id: string;
  type: 'bus' | 'train' | 'metro';
  number: string;
  from: string;
  fromStreet?: string;
  to: string;
  toStreet?: string;
  time?: string;
  price: string;
}

// Define navigation props type
type FavouritesScreenNavigationProp = StackNavigationProp<any, 'Favourites'>;

interface FavouritesScreenProps {
  navigation: FavouritesScreenNavigationProp;
}

const FavouritesScreen = ({ navigation }: FavouritesScreenProps) => {
  const [activeTab, setActiveTab] = useState('routes');

  // Mock data for favorite routes in Marrakech
  const favoriteRoutes: FavoriteRoute[] = [
    {
      id: '1',
      type: 'bus',
      number: 'L3',
      from: 'From: Guéliz Center',
      to: 'To: Jamaa El-Fna Square',
      price: '5 MAD',
      time: '20/05/2023 | 9:00',
    },
    {
      id: '2',
      type: 'bus',
      number: 'L8',
      from: 'From: Marrakech Train Station',
      to: 'To: Menara Mall',
      price: '4 MAD',
      time: 'Next arrival: Today | 18:00',
    },
    {
      id: '3',
      type: 'metro',
      number: 'T1',
      from: 'From: Tramway Central',
      to: 'To: Tramway Palmeraie',
      price: '6 MAD',
      time: 'Next arrival: Today | 16:15',
    },
    {
      id: '4',
      type: 'train',
      number: 'T2',
      from: 'From: Marrakech Train Station',
      to: 'To: Casablanca',
      price: '90 MAD',
      time: 'Next arrival: Today | 16:15',
    },
  ];

  const renderRouteCard = (item: FavoriteRoute) => {
    return (
      <TouchableOpacity 
        style={styles.routeCard}
        onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
      >
        <View style={styles.routeCardHeader}>
          <View style={[
            styles.transportIconContainer,
            item.type === 'bus' && styles.busIcon,
            item.type === 'train' && styles.trainIcon,
            item.type === 'metro' && styles.metroIcon,
          ]}>
            {item.type === 'bus' && <Icon name="bus" size={20} color="#fff" />}
            {item.type === 'train' && <MaterialIcons name="train" size={20} color="#fff" />}
            {item.type === 'metro' && <MaterialIcons name="subway" size={20} color="#fff" />}
          </View>
          <Text style={styles.routeNumber}>{item.number}</Text>
        </View>
        
        <View style={styles.routeCardBody}>
          <View style={styles.routeDetails}>
            <Text style={styles.routeFrom}>{item.from}</Text>
            <Text style={styles.routeTo}>{item.to}</Text>
          </View>
          
          <View style={styles.routeMeta}>
            {item.time && <Text style={styles.routeTime}>{item.time}</Text>}
            <View style={styles.routePrice}>
              <Text style={styles.priceText}>price:{item.price}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favourite routes</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => setActiveTab('routes')}
        >
          <Icon name="swap-horizontal-outline" size={20} color={activeTab === 'routes' ? '#3498db' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'routes' && styles.activeTabText]}>Routes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'bus' && styles.activeTab]}
          onPress={() => setActiveTab('bus')}
        >
          <Icon name="bus-outline" size={20} color={activeTab === 'bus' ? '#3498db' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'bus' && styles.activeTabText]}>Bus</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'metro' && styles.activeTab]}
          onPress={() => setActiveTab('metro')}
        >
          <MaterialIcons name="subway" size={20} color={activeTab === 'metro' ? '#3498db' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'metro' && styles.activeTabText]}>Metro</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'train' && styles.activeTab]}
          onPress={() => setActiveTab('train')}
        >
          <MaterialIcons name="train" size={20} color={activeTab === 'train' ? '#3498db' : '#888'} />
          <Text style={[styles.tabText, activeTab === 'train' && styles.activeTabText]}>Train</Text>
        </TouchableOpacity>
      </View>

      {/* List of favorites */}
      <FlatList
        data={favoriteRoutes.filter(route => 
          activeTab === 'routes' || route.type === activeTab
        )}
        renderItem={({ item }) => renderRouteCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.routeList}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Add New Route Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add new route</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  routeList: {
    padding: 16,
    paddingBottom: 90, // Space for add button
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  routeCardHeader: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  transportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  busIcon: {
    backgroundColor: '#3498db',
  },
  trainIcon: {
    backgroundColor: '#2ecc71',
  },
  metroIcon: {
    backgroundColor: '#e74c3c',
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  routeCardBody: {
    padding: 16,
  },
  routeDetails: {
    marginBottom: 12,
  },
  routeFrom: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  routeTo: {
    fontSize: 16,
    color: '#333',
  },
  routeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeTime: {
    fontSize: 14,
    color: '#666',
  },
  routePrice: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  addButtonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    zIndex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FavouritesScreen; 