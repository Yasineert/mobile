import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';
import theme from '../theme/theme';
import { StackNavigationProp } from '@react-navigation/stack';

// Try to import LinearGradient, but don't fail if it's not available
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  // If LinearGradient is not available, we'll use a View instead
  LinearGradient = View;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface TransportStop {
  id: string;
  name: string;
  coordinates: Location;
  type: 'bus' | 'train' | 'metro';
}

interface BusStop {
  id: string;
  name: string;
  time: string;
  isCurrent?: boolean;
  isPassed?: boolean;
  isDelayed?: boolean;
  delayMinutes?: number;
}

// Define navigation props type
type MapScreenNavigationProp = StackNavigationProp<any, 'Map'>;

interface MapScreenProps {
  navigation: MapScreenNavigationProp;
  route?: {
    params?: {
      routeId?: string;
      stops?: BusStop[];
      currentStopId?: string;
    }
  };
}

const { width, height } = Dimensions.get('window');

const MapScreen = ({ navigation, route }: MapScreenProps) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [activeTab, setActiveTab] = useState('bus');
  const [routeStops, setRouteStops] = useState<BusStop[]>([]);
  const [routeId, setRouteId] = useState<string | undefined>();
  const [currentStopId, setCurrentStopId] = useState<string | undefined>();
  const mapRef = useRef<MapView>(null);

  // Get the custom map style
  const mapStyle = getMapStyle();
  
  // Handle route parameters
  useEffect(() => {
    if (route?.params) {
      const { routeId: paramRouteId, stops, currentStopId: paramCurrentStopId } = route.params;
      
      if (paramRouteId) {
        setRouteId(paramRouteId);
      }
      
      if (stops && stops.length > 0) {
        setRouteStops(stops);
      }
      
      if (paramCurrentStopId) {
        setCurrentStopId(paramCurrentStopId);
      }
    }
  }, [route?.params]);

  // Generate route coordinates based on route stops or use default
  const getRouteCoordinates = () => {
    if (routeStops.length > 0) {
      // Create coordinates for route stops with slight variations to create a realistic path
      const stopCoordinates = routeStops.map((stop, index) => {
        // Base coordinates for different locations in Marrakech
        const baseCoordinates: {[key: string]: Location} = {
          'Airport': { latitude: 31.6100, longitude: -8.0300 },
          'Marrakech Menara Airport': { latitude: 31.6100, longitude: -8.0300 },
          'Marrakesh Station': { latitude: 31.6295, longitude: -7.9811 },
          'Marrakech Train Station': { latitude: 31.6295, longitude: -7.9811 },
          'Guéliz': { latitude: 31.6315, longitude: -7.9890 },
          'Guéliz Center': { latitude: 31.6315, longitude: -7.9890 },
          'Majorelle Garden': { latitude: 31.6414, longitude: -7.9895 },
          'Jamaa El-Fna': { latitude: 31.6345, longitude: -8.0000 },
          'Jamaa el-Fnaa': { latitude: 31.6345, longitude: -8.0000 },
          'Jamaa el Fna Square': { latitude: 31.6345, longitude: -8.0000 },
          'Medina': { latitude: 31.6325, longitude: -8.0050 },
          'Hivernage': { latitude: 31.6230, longitude: -7.9950 },
          'Menara Mall': { latitude: 31.6180, longitude: -8.0100 },
          'Ménara Mall': { latitude: 31.6180, longitude: -8.0100 },
          'Bab Doukkala': { latitude: 31.6260, longitude: -7.9950 },
          'Koutoubia Mosque': { latitude: 31.6280, longitude: -7.9950 },
        };
        
        // Get base coordinates for the stop or use default
        let coords = baseCoordinates[stop.name];
        if (!coords) {
          // Default coordinates with slight variation if location not found
          coords = {
            latitude: 31.6295 + (index * 0.002),
            longitude: -7.9811 - (index * 0.003)
          };
        }
        
        return coords;
      });
      
      return stopCoordinates;
    }
    
    // Default route coordinates if no stops are provided
    return [
      { latitude: 31.6295, longitude: -7.9811 }, // Marrakesh Train Station
      { latitude: 31.6305, longitude: -7.9850 },
      { latitude: 31.6315, longitude: -7.9890 },
      { latitude: 31.6325, longitude: -7.9930 },
      { latitude: 31.6335, longitude: -7.9970 },
      { latitude: 31.6345, longitude: -8.0000 }, // Jemaa el-Fnaa
    ];
  };
  
  const routeCoordinates = getRouteCoordinates();

  // Marrakesh stops data
  const transportStops: TransportStop[] = [
    {
      id: '1',
      name: 'Marrakesh Train Station',
      coordinates: { latitude: 31.6295, longitude: -7.9811 },
      type: 'train',
    },
    {
      id: '2',
      name: 'Gueliz Bus Stop',
      coordinates: { latitude: 31.6315, longitude: -7.9890 },
      type: 'bus',
    },
    {
      id: '3',
      name: 'Menara Gardens',
      coordinates: { latitude: 31.6106, longitude: -8.0328 },
      type: 'bus',
    },
    {
      id: '4',
      name: 'Jemaa el-Fnaa',
      coordinates: { latitude: 31.6345, longitude: -8.0000 },
      type: 'bus',
    },
    {
      id: '5',
      name: 'Majorelle Garden',
      coordinates: { latitude: 31.6414, longitude: -7.9895 },
      type: 'bus',
    },
  ];

  // Request location permission
  const requestLocationPermission = async () => {
    const granted = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );

    if (granted === 'granted') {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => console.log('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Center on user location
  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  // Render markers based on transport type and route stops
  const renderMarkers = () => {
    // If we have route stops, render those instead of the default transport stops
    if (routeStops.length > 0) {
      return routeCoordinates.map((coordinate, index) => {
        const stop = routeStops[index];
        if (!stop) return null; // Skip if no stop data
        
        const isCurrentStop = stop.id === currentStopId || stop.isCurrent;
        const isPassed = stop.isPassed;
        const isDelayed = stop.isDelayed;
        
        // Choose marker color based on stop status
        let markerColor = '#3498db'; // Default blue
        if (isCurrentStop) markerColor = '#2ecc71'; // Green for current
        else if (isPassed) markerColor = '#95a5a6'; // Gray for passed
        else if (isDelayed) markerColor = '#e74c3c'; // Red for delayed
        
        return (
          <Marker
            key={stop.id || `route-stop-${index}`}
            coordinate={coordinate}
            title={stop.name}
            description={stop.time}
            pinColor={isCurrentStop ? 'green' : isPassed ? 'gray' : isDelayed ? 'red' : 'blue'}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: markerColor },
              isCurrentStop && styles.currentStopMarker,
              isPassed && styles.passedStopMarker,
              isDelayed && styles.delayedStopMarker,
            ]}>
              {isCurrentStop ? (
                <Icon name="location" size={16} color={theme.COLORS.white} />
              ) : isPassed ? (
                <Icon name="checkmark" size={16} color={theme.COLORS.white} />
              ) : isDelayed ? (
                <Icon name="time" size={16} color={theme.COLORS.white} />
              ) : (
                <Icon name="bus" size={16} color={theme.COLORS.white} />
              )}
            </View>
          </Marker>
        );
      }).filter(Boolean); // Filter out any null markers
    }
    
    // Default behavior - show transport stops
    return transportStops
      .filter(stop => activeTab === 'all' || stop.type === activeTab)
      .map(stop => (
        <Marker
          key={stop.id}
          coordinate={stop.coordinates}
          title={stop.name}
        >
          <View style={[
            styles.markerContainer,
            stop.type === 'bus' && styles.busMarker,
            stop.type === 'train' && styles.trainMarker,
            stop.type === 'metro' && styles.metroMarker,
          ]}>
            {stop.type === 'bus' && <Icon name="bus" size={16} color={theme.COLORS.white} />}
            {stop.type === 'train' && <MaterialIcons name="train" size={16} color={theme.COLORS.white} />}
            {stop.type === 'metro' && <MaterialIcons name="subway" size={16} color={theme.COLORS.white} />}
          </View>
        </Marker>
      ));
  };

  // Custom gradient card
  const RouteCardContent = () => {
    // Get the first and last stop from routeStops if available
    const fromStop = routeStops.length > 0 ? routeStops[0] : null;
    const toStop = routeStops.length > 0 ? routeStops[routeStops.length - 1] : null;
    
    // Get the current stop if available
    const currentStop = routeStops.find(stop => stop.id === currentStopId || stop.isCurrent);
    
    return (
      <View style={styles.routeCard}>
        <View style={styles.routeInfo}>
          <View style={styles.busLogoContainer}>
            <Text style={styles.busLogo}>{routeId || 'L3'}</Text>
          </View>
          
          <View style={styles.routeDetails}>
            <View style={styles.routeEndpoints}>
              <Text style={styles.routeFrom}>From: {fromStop?.name || 'Guéliz'}</Text>
              <Icon name="arrow-forward" size={16} color={theme.COLORS.textSecondary} />
              <Text style={styles.routeTo}>To: {toStop?.name || 'Jamaa el-Fnaa'}</Text>
            </View>
            <View style={styles.routeMetaInfo}>
              <Icon name="time-outline" size={14} color={theme.COLORS.textSecondary} style={styles.timeIcon} />
              <Text style={styles.routeTime}>
                Next arrival: Today | {new Date().getHours()}:{new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.showRouteButton}
          onPress={() => navigation.navigate('RouteDetail', { routeId: routeId || 'L3' })}
        >
          <Text style={styles.showRouteText}>Show a route</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 31.6295,
          longitude: -7.9900,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton={false}
        customMapStyle={mapStyle}
      >
        {/* Route Line */}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="#01615f"  // Couleur verte comme dans l'image
          lineDashPattern={[0]}  // Ligne continue
        />
        
        {/* Render Stop Markers */}
        {renderMarkers()}
      </MapView>
      
      {/* Top Controls */}
      <View style={styles.topControls}>
        <View style={styles.transportFilters}>
          <TouchableOpacity 
            style={[styles.filterButton, activeTab === 'bus' && styles.activeFilterButton]}
            onPress={() => setActiveTab('bus')}
          >
            <Icon name="bus-outline" size={20} color={activeTab === 'bus' ? theme.COLORS.white : theme.COLORS.text} />
            <Text style={[styles.filterText, activeTab === 'bus' && styles.activeFilterText]}>Bus</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, activeTab === 'metro' && styles.activeFilterButton]}
            onPress={() => setActiveTab('metro')}
          >
            <MaterialIcons name="subway" size={20} color={activeTab === 'metro' ? theme.COLORS.white : theme.COLORS.text} />
            <Text style={[styles.filterText, activeTab === 'metro' && styles.activeFilterText]}>Metro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, activeTab === 'train' && styles.activeFilterButton]}
            onPress={() => setActiveTab('train')}
          >
            <MaterialIcons name="train" size={20} color={activeTab === 'train' ? theme.COLORS.white : theme.COLORS.text} />
            <Text style={[styles.filterText, activeTab === 'train' && styles.activeFilterText]}>Train</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, activeTab === 'all' && styles.activeFilterButton]}
            onPress={() => setActiveTab('all')}
          >
            <Icon name="options-outline" size={20} color={activeTab === 'all' ? theme.COLORS.white : theme.COLORS.text} />
            <Text style={[styles.filterText, activeTab === 'all' && styles.activeFilterText]}>All</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Route Card */}
      {LinearGradient === View ? (
        <RouteCardContent />
      ) : (
        <LinearGradient
          colors={[theme.COLORS.card, theme.COLORS.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.routeCard}
        >
          <View style={styles.routeInfo}>
            <View style={styles.busLogoContainer}>
              <Text style={styles.busLogo}>L3</Text>
            </View>
            
            <View style={styles.routeDetails}>
              <View style={styles.routeEndpoints}>
                <Text style={styles.routeFrom}>From: Gueliz</Text>
                <Icon name="arrow-forward" size={16} color={theme.COLORS.textSecondary} />
                <Text style={styles.routeTo}>To: Jemaa el-Fnaa</Text>
              </View>
              <View style={styles.routeMetaInfo}>
                <Icon name="time-outline" size={14} color={theme.COLORS.textSecondary} style={styles.timeIcon} />
                <Text style={styles.routeTime}>Next arrival: Today | 18:00</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.showRouteButton}
            onPress={() => navigation.navigate('RouteDetail', { routeId: '1' })}
          >
            <Text style={styles.showRouteText}>Show a route</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
      
      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity 
          style={styles.mapControlButton}
          onPress={centerOnUserLocation}
        >
          <Icon name="locate" size={24} color={theme.COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mapControlButton}>
          <Icon name="layers-outline" size={24} color={theme.COLORS.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Custom map style
const getMapStyle = () => [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  // New marker styles for route stops
  currentStopMarker: {
    backgroundColor: '#2ecc71', // Green for current stop
    borderColor: '#fff',
    borderWidth: 2,
  },
  passedStopMarker: {
    backgroundColor: '#95a5a6', // Gray for passed stops
    borderColor: '#fff',
    borderWidth: 1,
  },
  delayedStopMarker: {
    backgroundColor: '#e74c3c', // Red for delayed stops
    borderColor: '#fff',
    borderWidth: 2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 60,
    left: theme.SPACING.m,
    right: theme.SPACING.m,
    zIndex: 1,
  },
  transportFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.COLORS.card,
    borderRadius: 25,
    padding: 6,
    ...theme.SHADOWS.medium,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.SPACING.s,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: theme.COLORS.primary,
  },
  filterText: {
    fontSize: theme.FONTS.size14,
    color: theme.COLORS.text,
    marginLeft: 6,
  },
  activeFilterText: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
  routeCard: {
    position: 'absolute',
    bottom: 20,
    left: theme.SPACING.m,
    right: theme.SPACING.m,
    backgroundColor: theme.COLORS.card,
    borderRadius: 16,
    padding: theme.SPACING.m,
    ...theme.SHADOWS.medium,
    borderLeftWidth: 4,
    borderLeftColor: '#01615f',
  },
  routeInfo: {
    flexDirection: 'row',
    marginBottom: theme.SPACING.m,
  },
  busLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#01615f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  busLogo: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  routeDetails: {
    flex: 1,
  },
  routeEndpoints: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  routeFrom: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.text,
    marginRight: 6,
  },
  routeTo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.text,
    marginLeft: 6,
  },
  routeMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  routeTime: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  showRouteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    ...theme.SHADOWS.small,
  },
  showRouteText: {
    color: theme.COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    right: theme.SPACING.m,
    top: height / 2 - 60,
    zIndex: 1,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.COLORS.card,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...theme.SHADOWS.small,
  },
  markerContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.primary,
    borderWidth: 2,
    borderColor: theme.COLORS.white,
    ...theme.SHADOWS.small,
  },
  busMarker: {
    backgroundColor: theme.COLORS.bus,
  },
  trainMarker: {
    backgroundColor: theme.COLORS.train,
  },
  metroMarker: {
    backgroundColor: theme.COLORS.metro,
  },
});

export default MapScreen; 