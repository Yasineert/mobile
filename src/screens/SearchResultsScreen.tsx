"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from "react-native"
import MapView, { Marker, Polyline, type Region, PROVIDER_DEFAULT } from "react-native-maps"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import Geolocation from "react-native-geolocation-service"
import BusStopMarker from "../components/BusStopMarker"
import RouteSelector from "../components/RouteSelector"
import { busStops, busRoutes } from "../data/busData"

const { width, height } = Dimensions.get("window")

interface Coordinate {
  latitude: number
  longitude: number
}

const SearchResultsScreen: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 31.6295,
    longitude: -7.9811,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  })
  const [selectedRoute, setSelectedRoute] = useState<any>(null)
  const [origin, setOrigin] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [showRouteSelector, setShowRouteSelector] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const mapRef = useRef<MapView | null>(null)

  useEffect(() => {
    requestLocationPermission()
  }, [])

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      Geolocation.requestAuthorization("whenInUse").then((result) => {
        if (result === "granted") {
          getCurrentLocation()
        }
      })
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: "Location Permission",
          message: "This app needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        })
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation()
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({
          latitude,
          longitude,
        })
      },
      (error) => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    )
  }

  const handleSearch = (): void => {
    if (origin && destination) {
      setLoading(true)
      // Simulate API call to find route
      setTimeout(() => {
        // Find a sample route (in a real app, this would come from an API)
        const route = busRoutes.find((r) => r.id === "L12")
        setSelectedRoute(route)

        // Zoom to fit the route
        if (route && mapRef.current) {
          const coordinates = route.path.map((coord) => ({
            latitude: coord[0],
            longitude: coord[1],
          }))

          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 250, left: 50 },
            animated: true,
          })
        }

        setLoading(false)
        setShowRouteSelector(true)
      }, 1500)
        }
      }
      
  const handleRouteSelect = (transportType: string): void => {
    // In a real app, this would filter routes by transport type
    console.log(`Selected transport type: ${transportType}`)
      }
      
  // --- Helper to render all routes as colored lines ---
  const fadedColor = (hex: string) => {
    // Add 4D for 30% opacity if hex is #RRGGBB
    if (hex.length === 7) return hex + '4D';
    return hex;
  };

  const renderAllRoutes = (): React.ReactNode => {
    return busRoutes.map((route) => {
      const coordinates = route.path.map((coord) => ({
        latitude: coord[0],
        longitude: coord[1],
      }))
      // If selected, highlight; else, faded
      const isSelected = selectedRoute && selectedRoute.id === route.id
      return (
        <Polyline
          key={route.id}
          coordinates={coordinates}
          strokeWidth={isSelected ? 6 : 3}
          strokeColor={isSelected ? route.color : fadedColor(route.color)}
          lineDashPattern={isSelected ? undefined : [8, 8]}
          zIndex={isSelected ? 2 : 1}
        />
      )
    })
  }

  const renderAllBusStops = (): React.ReactNode => {
    return busStops.map((stop) => (
      <Marker
        key={stop.id}
        coordinate={{ latitude: stop.location[0], longitude: stop.location[1] }}
        title={stop.name}
        pinColor="#1E88E5"
        opacity={selectedRoute && !selectedRoute.stops.some((s: any) => s.id === stop.id) ? 0.4 : 1}
      >
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 2, borderWidth: 1, borderColor: '#1E88E5' }}>
          <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 10 }}>{stop.name}</Text>
        </View>
      </Marker>
    ))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Origin" value={origin} onChangeText={setOrigin} />
            <TextInput
              style={[styles.input, styles.destinationInput]}
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        minZoomLevel={10}
        maxZoomLevel={20}
      >
        {userLocation && <Marker coordinate={userLocation} title="You are here" pinColor="blue" />}
        {/* Show all routes and all stops, highlight selected */}
        {renderAllRoutes()}
        {renderAllBusStops()}
      </MapView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Finding the best routes...</Text>
        </View>
      )}

      {showRouteSelector && (
        <RouteSelector
          origin={origin}
          destination={destination}
          route={selectedRoute}
          onSelectTransport={handleRouteSelect}
        />
      )}

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          if (userLocation) {
            mapRef.current?.animateToRegion({
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            })
          }
        }}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>

      {/* Route color legend */}
      <View style={styles.legendContainer}>
        {busRoutes.map((route) => (
          <View key={route.id} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: route.color }]} />
            <Text style={styles.legendText}>{route.name}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: 15,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  destinationInput: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  searchButton: {
    backgroundColor: "#1E88E5",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  locationButton: {
    position: "absolute",
    bottom: 250,
    right: 20,
    backgroundColor: "#1E88E5",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -75,
    marginTop: -50,
    width: 150,
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  legendContainer: {
    position: 'absolute',
    bottom: 120,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 18,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
})

export default SearchResultsScreen; 
