import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import transportApi, { Card, Trip, AddCreditRequest } from '../services/api';
import { busRoutes, busStops, getRouteById, BusRoute } from '../services/busData';

// Try to import LinearGradient, but don't fail if it's not available
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  // If LinearGradient is not available, we'll use a View instead
  LinearGradient = View;
}

interface RouteData {
  id: string;
  type: 'bus' | 'train' | 'metro' | 'tram';
  number: string;
  from: string;
  to: string;
  fromStreet?: string;
  toStreet?: string;
  price: string;
  time?: string;
  date?: string;
}

interface BusData {
  id: string;
  number: string;
  destination: string;
  eta: string;
  status: 'on time' | 'delayed' | 'cancelled';
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

// Define navigation props type
type TransportScreenNavigationProp = StackNavigationProp<any, 'Home'>;

interface TransportScreenProps {
  navigation: TransportScreenNavigationProp;
}

const { width } = Dimensions.get('window');

// For demo purposes, hardcode the userId
const DEMO_USER_ID = "user1";

const TransportScreen = ({ navigation }: TransportScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cardInfo, setCardInfo] = useState<Card | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [creditModalVisible, setCreditModalVisible] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  
  // New state for favorite modal
  const [favoriteModalVisible, setFavoriteModalVisible] = useState(false);
  const [selectedTransportType, setSelectedTransportType] = useState('bus');
  const [selectedLine, setSelectedLine] = useState('');
  const [favoriteName, setFavoriteName] = useState('');
  const [favoriteError, setFavoriteError] = useState('');
  const [favorites, setFavorites] = useState<Array<{id: string, name: string, type: string, line: string}>>([]);
  
  // New state for filter modal
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    transportType: 'all',
    priceRange: 'all',
    sortBy: 'date'
  });
  
  // Animation values
  const refreshRotation = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  // Filter data based on search query
  const getFilteredFavorites = useCallback(() => {
    if (!searchQuery.trim()) {
      return favorites;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return favorites.filter(fav => 
      fav.name.toLowerCase().includes(query) || 
      fav.line.toLowerCase().includes(query) || 
      fav.type.toLowerCase().includes(query)
    );
  }, [favorites, searchQuery]);

  const getFilteredTrips = useCallback(() => {
    if (!trips) return [];
    
    let filteredTrips = trips;
    
    // Filter by category/type if not on "all" tab
    if (activeCategory !== 'all') {
      filteredTrips = filteredTrips.filter(trip => trip.type === activeCategory);
    }
    
    // Apply search query filter if any
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredTrips = filteredTrips.filter(trip => 
        trip.line.toLowerCase().includes(query) || 
        trip.fromLocation.toLowerCase().includes(query) || 
        trip.toLocation.toLowerCase().includes(query) ||
        trip.type.toLowerCase().includes(query)
      );
    }
    
    return filteredTrips;
  }, [trips, activeCategory, searchQuery]);
  
  const getFilteredRoutes = useCallback(() => {
    let filteredBusRoutes = busRoutes;
    
    // Filter by type based on active category
    if (activeCategory === 'bus') {
      filteredBusRoutes = filteredBusRoutes.filter(route => route.type === 'bus');
    } else if (activeCategory === 'tram') {
      filteredBusRoutes = filteredBusRoutes.filter(route => route.type === 'tram');
    }
    
    // Apply search query filter if any
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredBusRoutes = filteredBusRoutes.filter(route => 
        route.id.toLowerCase().includes(query) || 
        route.name.toLowerCase().includes(query) || 
        (route.type && route.type.toLowerCase().includes(query))
      );
    }
    
    // Apply additional filters from filter modal
    if (filterOptions.transportType !== 'all') {
      filteredBusRoutes = filteredBusRoutes.filter(route => route.type && route.type === filterOptions.transportType);
    }
    
    // Apply sorting
    if (filterOptions.sortBy === 'name') {
      filteredBusRoutes.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filterOptions.sortBy === 'price') {
      filteredBusRoutes.sort((a, b) => a.fare - b.fare);
    }
    
    return filteredBusRoutes;
  }, [busRoutes, activeCategory, searchQuery, filterOptions]);

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Fetch card info and trips on component mount
  useEffect(() => {
    loadCardInfo();
    loadTrips();
    
    // Fade in animation for the card
    Animated.timing(cardOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const startRefreshAnimation = () => {
    refreshRotation.setValue(0);
    Animated.timing(refreshRotation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const loadCardInfo = async () => {
    try {
      setCardLoading(true);
      const card = await transportApi.getCardInfo(DEMO_USER_ID);
      setCardInfo(card);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to load card information");
      }
      console.error("Failed to load card info:", error);
    } finally {
      setCardLoading(false);
    }
  };

  const loadTrips = async () => {
    try {
      setTripsLoading(true);
      startRefreshAnimation();
      const tripData = await transportApi.getTrips(DEMO_USER_ID);
      setTrips(tripData);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "Failed to load trips");
      }
      console.error("Failed to load trips:", error);
    } finally {
      setTripsLoading(false);
    }
  };

  const handleAddCredit = async () => {
    if (!creditAmount || isNaN(Number(creditAmount)) || Number(creditAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0");
      return;
    }

    try {
      setLoading(true);
      const request: AddCreditRequest = {
        userId: DEMO_USER_ID,
        amount: Number(creditAmount)
      };

      const updatedCard = await transportApi.addCredit(request);
      
      // Update the card info with new balance
      setCardInfo(updatedCard);
      
      // Animate the change if required
      if (cardOpacity) {
        // Flash effect to highlight the balance change
        Animated.sequence([
          Animated.timing(cardOpacity, {
            toValue: 0.6,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(cardOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      setPaymentSuccess(true);
      setPaymentMessage(`Successfully added ${creditAmount} MAD to your card`);
      
      // Reset and close modal after 2 seconds
      setTimeout(() => {
        setCreditModalVisible(false);
        setCreditAmount('');
        setPaymentSuccess(false);
        setPaymentMessage('');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Payment Failed", error.message);
      } else {
        Alert.alert("Payment Failed", "An error occurred while processing your payment");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = () => {
    // Validate inputs
    if (!selectedLine) {
      setFavoriteError('Please select a line');
      return;
    }
    
    if (!favoriteName.trim()) {
      setFavoriteError('Please enter a name for this favorite');
      return;
    }
    
    // Add to favorites
    const newFavorite = {
      id: Date.now().toString(),
      name: favoriteName.trim(),
      type: selectedTransportType,
      line: selectedLine
    };
    
    setFavorites([...favorites, newFavorite]);
    
    // Reset form and close modal
    setFavoriteName('');
    setSelectedLine('');
    setFavoriteError('');
    setFavoriteModalVisible(false);
    
    // Show confirmation
    Alert.alert('Success', `${favoriteName} has been added to your favorites`);
  };
  
  // Filter lines based on selected transport type
  const getFilteredLines = () => {
    return busRoutes.filter(route => route.type === selectedTransportType);
  };

  const categories: CategoryItem[] = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'bus', name: 'Bus', icon: 'bus' },
    { id: 'tram', name: 'Tram', icon: 'tram' },
    { id: 'favourite', name: 'Saved', icon: 'star' },
  ];

  // Convert API trips to format expected by UI
  const mapTripsToRouteData = (): RouteData[] => {
    if (!trips) return [];
    
    return getFilteredTrips()
      .map(trip => {
        // Format datetime
        const tripDate = new Date(trip.time);
        const formattedDate = tripDate.toLocaleDateString();
        const formattedTime = tripDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return {
          id: trip.id.toString(),
          type: trip.type as 'bus' | 'train' | 'metro' | 'tram',
          number: trip.line,
          from: `From: ${trip.fromLocation}`,
          to: `To: ${trip.toLocation}`,
          price: `${trip.price} MAD`,
          time: `${formattedDate} | ${formattedTime}`,
        };
      });
  };

  const filteredRoutes = mapTripsToRouteData();

  const renderRouteCard = (item: RouteData) => {
    let iconBgColor;
    
    switch (item.type) {
      case 'bus':
        iconBgColor = theme.COLORS.bus;
        break;
      case 'tram':
        iconBgColor = theme.COLORS.train;
        break;
      case 'train':
        iconBgColor = theme.COLORS.train;
        break;
      case 'metro':
        iconBgColor = theme.COLORS.metro;
        break;
      default:
        iconBgColor = theme.COLORS.bus;
    }

    return (
      <TouchableOpacity 
        style={styles.tripCard}
        onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
      >
        <View style={[styles.routeIconContainer, { backgroundColor: iconBgColor }]} />
        <View style={styles.routeContent}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeNumber}>{item.number}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.routeFrom}>{item.from}</Text>
            <Text style={styles.routeTo}>{item.to}</Text>
          </View>
          {item.time && (
            <View style={styles.timeContainer}>
              <Icon name="time-outline" size={14} color={theme.COLORS.textSecondary} />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = (item: CategoryItem) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        activeCategory === item.id && styles.activeCategoryItem
      ]}
      onPress={() => {
        setActiveCategory(item.id);
        // Give haptic feedback or visual indication if needed
      }}
    >
      {item.id === 'train' || item.id === 'metro' ? (
        <MaterialIcons 
          name={item.icon} 
          size={22} 
          color={activeCategory === item.id ? theme.COLORS.white : theme.COLORS.textSecondary} 
        />
      ) : (
        <Icon 
          name={`${item.icon}${activeCategory !== item.id ? '-outline' : ''}`} 
          size={22} 
          color={activeCategory === item.id ? theme.COLORS.white : theme.COLORS.textSecondary} 
        />
      )}
      <Text 
        style={[
          styles.categoryText, 
          activeCategory === item.id && styles.activeCategoryText
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Custom card content for header
  const HeaderRideCard = () => (
    <View style={styles.headerCardWrapper}>
      <LinearGradient
        colors={['#236561', '#c04f44']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerRideCard}
      >
      <View style={styles.rideCardHeader}>
          <View>
        <Text style={styles.rideTitle}>Marrakesh Transport Card</Text>
          </View>
        <View style={styles.rideDiscount}>
          <Text style={styles.discountText}>-15%</Text>
        </View>
      </View>
      <Animated.View style={[
          styles.rideCardContent, 
          {opacity: cardOpacity}
        ]}>
        <View>
          <Text style={styles.balanceLabel}>Balance</Text>
          {cardLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.balance}>{cardInfo ? `${cardInfo.balance} MAD` : '0 MAD'}</Text>
          )}
        </View>
        <View style={styles.cardValue}>
          <Text style={styles.valueLabel}>{cardInfo ? cardInfo.cardNumber : 'M-XXXXX'}</Text>
        </View>
      </Animated.View>
      </LinearGradient>
      <TouchableOpacity 
        style={styles.addPassButton}
        onPress={() => setCreditModalVisible(true)}
      >
        <Text style={styles.addPassText}>+ Add credit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBusRouteItem = (item: BusRoute) => {
    // Choose icon based on type
    const IconComponent = item.type === 'bus' 
      ? () => <Icon name="bus" size={20} color="#fff" />
      : () => <MaterialIcons name="tram" size={20} color="#fff" />;
      
    return (
      <TouchableOpacity
        style={[
          styles.busRouteItem, 
          { 
            borderLeftColor: item.color, 
            borderLeftWidth: 4,
            backgroundColor: `${item.color}10`, // Use route color with 10% opacity for background
          }
        ]}
        onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
      >
        <View style={[styles.busRouteIcon, { backgroundColor: item.color }]}>
          <Text style={styles.busRouteLineId}>{item.id}</Text>
        </View>
        <Text style={styles.busRouteName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.busRouteFrequency}>{item.frequency}</Text>
        
        {item.stops.length > 0 && (
          <View style={styles.busRouteStops}>
            <Icon name="location-outline" size={12} color={theme.COLORS.textSecondary} />
            <Text style={styles.busRouteStopsText}>
              {`${item.stops.length} stops`}
            </Text>
          </View>
        )}
        
        <View style={styles.busRouteFare}>
          <Text style={styles.busRouteFareText}>{item.fare} MAD</Text>
        </View>
        
        <View style={[styles.iconContainer, { backgroundColor: item.color + '30' }]}>
          <IconComponent />
        </View>
      </TouchableOpacity>
    );
  };

  // Handle applying filters
  const applyFilters = (newFilters: typeof filterOptions) => {
    setFilterOptions(newFilters);
    setFilterModalVisible(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterOptions({
      transportType: 'all',
      priceRange: 'all',
      sortBy: 'date'
    });
    setFilterModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.COLORS.background} />
      
      {/* Add Credit Modal */}
      <Modal
        visible={creditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCreditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Credit</Text>
            
            {paymentSuccess ? (
              <View style={styles.successContainer}>
                <MaterialIcons name="check-circle" size={50} color="green" />
                <Text style={styles.successText}>{paymentMessage}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalLabel}>Enter Amount (MAD)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={creditAmount}
                  onChangeText={setCreditAmount}
                  placeholder="0.00"
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setCreditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.confirmButton, loading && styles.disabledButton]}
                    onPress={handleAddCredit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Add Credit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Add Favorite Modal */}
      <Modal
        visible={favoriteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFavoriteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Favorite Route</Text>
            
            {/* Transport Type Selector */}
            <Text style={styles.modalLabel}>Transport Type</Text>
            <View style={styles.transportTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  selectedTransportType === 'bus' && styles.transportTypeSelected
                ]}
                onPress={() => setSelectedTransportType('bus')}
              >
                <Icon name="bus" size={22} color={selectedTransportType === 'bus' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  selectedTransportType === 'bus' && styles.transportTypeTextSelected
                ]}>Bus</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  selectedTransportType === 'tram' && styles.transportTypeSelected
                ]}
                onPress={() => setSelectedTransportType('tram')}
              >
                <MaterialIcons name="tram" size={22} color={selectedTransportType === 'tram' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  selectedTransportType === 'tram' && styles.transportTypeTextSelected
                ]}>Tram</Text>
              </TouchableOpacity>
            </View>
            
            {/* Line Selector */}
            <Text style={styles.modalLabel}>Select Line</Text>
            <View style={styles.lineSelector}>
              <FlatList
                data={getFilteredLines()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.lineItem,
                      selectedLine === item.id && { backgroundColor: `${item.color}30` }
                    ]}
                    onPress={() => setSelectedLine(item.id)}
                  >
                    <View style={[styles.lineIcon, { backgroundColor: item.color }]}>
                      <Text style={styles.lineIconText}>{item.id}</Text>
                    </View>
                    <Text style={styles.lineText}>{item.name}</Text>
                    {selectedLine === item.id && (
                      <Icon name="checkmark-circle" size={20} color={theme.COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={true}
                style={styles.lineList}
                ListEmptyComponent={() => (
                  <Text style={styles.emptyListText}>No lines available</Text>
                )}
              />
            </View>
            
            {/* Name Field */}
            <Text style={styles.modalLabel}>Name (e.g. "Work", "Home")</Text>
            <TextInput
              style={styles.modalInput}
              value={favoriteName}
              onChangeText={setFavoriteName}
              placeholder="Enter a name for this favorite"
            />
            
            {favoriteError ? (
              <Text style={styles.errorText}>{favoriteError}</Text>
            ) : null}
            
            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setFavoriteModalVisible(false);
                  setSelectedLine('');
                  setFavoriteName('');
                  setFavoriteError('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton]}
                onPress={handleAddFavorite}
              >
                <Text style={styles.confirmButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>
            
            {/* Transport Type Filter */}
            <Text style={styles.modalLabel}>Transport Type</Text>
            <View style={styles.transportTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.transportType === 'all' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, transportType: 'all'})}
              >
                <Icon name="apps" size={22} color={filterOptions.transportType === 'all' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.transportType === 'all' && styles.transportTypeTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.transportType === 'bus' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, transportType: 'bus'})}
              >
                <Icon name="bus" size={22} color={filterOptions.transportType === 'bus' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.transportType === 'bus' && styles.transportTypeTextSelected
                ]}>Bus</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.transportType === 'tram' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, transportType: 'tram'})}
              >
                <MaterialIcons name="tram" size={22} color={filterOptions.transportType === 'tram' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.transportType === 'tram' && styles.transportTypeTextSelected
                ]}>Tram</Text>
              </TouchableOpacity>
            </View>
            
            {/* Price Range Filter */}
            <Text style={styles.modalLabel}>Price Range</Text>
            <View style={styles.transportTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.priceRange === 'all' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, priceRange: 'all'})}
              >
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.priceRange === 'all' && styles.transportTypeTextSelected
                ]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.priceRange === 'low' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, priceRange: 'low'})}
              >
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.priceRange === 'low' && styles.transportTypeTextSelected
                ]}>0-5 MAD</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.priceRange === 'high' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, priceRange: 'high'})}
              >
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.priceRange === 'high' && styles.transportTypeTextSelected
                ]}>6+ MAD</Text>
              </TouchableOpacity>
            </View>
            
            {/* Sort By Filter */}
            <Text style={styles.modalLabel}>Sort By</Text>
            <View style={styles.transportTypeSelector}>
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.sortBy === 'date' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, sortBy: 'date'})}
              >
                <Icon name="time-outline" size={22} color={filterOptions.sortBy === 'date' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.sortBy === 'date' && styles.transportTypeTextSelected
                ]}>Date</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.sortBy === 'name' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, sortBy: 'name'})}
              >
                <Icon name="text-outline" size={22} color={filterOptions.sortBy === 'name' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.sortBy === 'name' && styles.transportTypeTextSelected
                ]}>Name</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transportTypeButton, 
                  filterOptions.sortBy === 'price' && styles.transportTypeSelected
                ]}
                onPress={() => setFilterOptions({...filterOptions, sortBy: 'price'})}
              >
                <Icon name="pricetag-outline" size={22} color={filterOptions.sortBy === 'price' ? theme.COLORS.white : theme.COLORS.textSecondary} />
                <Text style={[
                  styles.transportTypeText,
                  filterOptions.sortBy === 'price' && styles.transportTypeTextSelected
                ]}>Price</Text>
              </TouchableOpacity>
            </View>
            
            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={resetFilters}
              >
                <Text style={styles.cancelButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.confirmButton]}
                onPress={() => applyFilters(filterOptions)}
              >
                <Text style={styles.confirmButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Header with Search - Fixed at top */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marrakesh Transport</Text>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color={theme.COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, line, or type..."
            placeholderTextColor={theme.COLORS.textLight}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close-circle" size={20} color={theme.COLORS.textSecondary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
            <Icon name="options-outline" size={20} color={theme.COLORS.white} />
          </TouchableOpacity>
          )}
        </View>
        
        {/* Filter status indicator */}
        {(filterOptions.transportType !== 'all' || filterOptions.priceRange !== 'all' || filterOptions.sortBy !== 'date') && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              Filters applied: {filterOptions.transportType !== 'all' ? filterOptions.transportType : ''} 
              {filterOptions.priceRange !== 'all' ? ` • ${filterOptions.priceRange === 'low' ? '0-5 MAD' : '6+ MAD'}` : ''}
              {filterOptions.sortBy !== 'date' ? ` • Sorted by ${filterOptions.sortBy}` : ''}
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.clearFiltersText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Transport Card in Header */}
      <HeaderRideCard />

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={styles.scrollContentContainer}
      >
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryItem(item)}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

        {/* Show favorites if in favorite tab */}
        {activeCategory === 'favourite' && (
          <View style={styles.favoritesContainer}>
            {getFilteredFavorites().length > 0 ? (
              getFilteredFavorites().map(fav => (
                <TouchableOpacity 
                  key={fav.id} 
                  style={styles.favoriteItem}
                  onPress={() => {
                    // Handle navigation to route details
                  }}
                >
                  <View style={[
                    styles.favoriteIconContainer,
                    { backgroundColor: fav.type === 'bus' ? theme.COLORS.bus : theme.COLORS.train }
                  ]}>
                    {fav.type === 'bus' ? 
                      <Icon name="bus" size={20} color="#fff" /> : 
                      <MaterialIcons name="tram" size={20} color="#fff" />
                    }
                  </View>
                  <View style={styles.favoriteContent}>
                    <Text style={styles.favoriteName}>{fav.name}</Text>
                    <View style={styles.favoriteDetails}>
                      <Text style={styles.favoriteLineText}>Line {fav.line}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriteAction}
                    onPress={() => {
                      // Delete favorite
                      const newFavorites = favorites.filter(f => f.id !== fav.id);
                      setFavorites(newFavorites);
                    }}
                  >
                    <Icon name="trash-outline" size={20} color={theme.COLORS.error} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : searchQuery ? (
              <View style={styles.emptyContainer}>
                <Icon name="search-outline" size={48} color={theme.COLORS.textLight} />
                <Text style={styles.emptyText}>No favorites match your search</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={clearSearch}
                >
                  <Text style={styles.emptyButtonText}>Clear Search</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Icon name="star-outline" size={48} color={theme.COLORS.textLight} />
                <Text style={styles.emptyText}>No favorites added yet</Text>
                <TouchableOpacity 
                  style={styles.emptyButton}
                  onPress={() => setFavoriteModalVisible(true)}
                >
                  <Text style={styles.emptyButtonText}>Add Favorite</Text>
                </TouchableOpacity>
            </View>
            )}
          </View>
        )}

        {/* Recent Routes Section - Only show if not in favorites tab */}
        {activeCategory !== 'favourite' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeCategory === 'all' ? 'Your last trips' : 
                 activeCategory === 'bus' ? 'Your last bus trips' :
                 activeCategory === 'tram' ? 'Your last tram trips' :
                 'Your last trips'}
              </Text>
              <TouchableOpacity onPress={loadTrips} disabled={tripsLoading}>
                <Animated.View style={{
                  transform: [
                    {
                      rotate: refreshRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })
                    }
                  ]
                }}>
                  <Icon name="refresh-outline" size={24} color={tripsLoading ? theme.COLORS.primary : theme.COLORS.text} />
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* List of Recent Routes */}
            {tripsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.COLORS.primary} />
            </View>
            ) : (
              <View style={styles.tripsContainer}>
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map(route => renderRouteCard(route))
                ) : searchQuery ? (
                  <View style={styles.emptyContainer}>
                    <Icon name="search-outline" size={48} color={theme.COLORS.textLight} />
                    <Text style={styles.emptyText}>No trips match your search</Text>
                    <TouchableOpacity 
                      style={styles.emptyButton}
                      onPress={clearSearch}
                    >
                      <Text style={styles.emptyButtonText}>Clear Search</Text>
                    </TouchableOpacity>
          </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Icon name={
                      activeCategory === 'bus' ? 'bus' :
                      activeCategory === 'tram' ? 'tram' :
                      'time-outline'
                    } size={48} color={theme.COLORS.textLight} />
                    <Text style={styles.emptyText}>No {activeCategory !== 'all' ? activeCategory + ' ' : ''}trips found</Text>
                  </View>
                )}
              </View>
            )}
              
            {/* Available Bus Routes Section - conditionally rendered */}
            {(activeCategory === 'all' || activeCategory === 'bus') && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Available Bus Routes</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
                </View>
                
                <View style={styles.routesContainer}>
                  <FlatList
                    data={getFilteredRoutes().filter(route => route.type === 'bus')}
                    renderItem={({ item }) => renderBusRouteItem(item)}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.busRoutesList}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={160 + theme.SPACING.m} // card width + margin
                    ListEmptyComponent={() => (
                      <View style={styles.emptyRoutesContainer}>
                        <Text style={styles.emptyListText}>No bus routes match your search</Text>
                      </View>
                    )}
                  />
                </View>
              </>
            )}
            
            {/* Available Tram Routes Section - conditionally rendered */}
            {(activeCategory === 'all' || activeCategory === 'tram') && (
              <>
      <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    {activeCategory === 'tram' ? 'Available Tram Routes' : 'Available Tram Routes'}
                  </Text>
        <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

                <View style={styles.routesContainer}>
      <FlatList
                    data={getFilteredRoutes().filter(route => route.type === 'tram')}
                    renderItem={({ item }) => renderBusRouteItem(item)}
        keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.busRoutesList}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={160 + theme.SPACING.m} // card width + margin
                    ListEmptyComponent={() => (
                      <View style={styles.emptyRoutesContainer}>
                        <Text style={styles.emptyListText}>No tram routes match your search</Text>
          </View>
                    )}
                  />
                </View>
              </>
            )}
          </>
        )}

        {/* Add some bottom space for better scrolling experience */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setFavoriteModalVisible(true)}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  header: {
    paddingHorizontal: theme.SPACING.m,
    paddingTop: Platform.OS === 'ios' ? theme.SPACING.m : theme.SPACING.l,
    paddingBottom: theme.SPACING.s,
    backgroundColor: theme.COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    ...theme.SHADOWS.small,
  },
  headerTitle: {
    fontSize: width > 350 ? 24 : 20,
    fontWeight: 'bold',
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.s,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.card,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    ...theme.SHADOWS.small,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.COLORS.text,
  },
  filterButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: 50,
    padding: 8,
  },
  categoriesContainer: {
    marginTop: theme.SPACING.s,
    marginBottom: theme.SPACING.m,
  },
  categoriesList: {
    paddingRight: theme.SPACING.m,
  },
  categoryItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.COLORS.card,
    paddingVertical: theme.SPACING.s,
    paddingHorizontal: theme.SPACING.m,
    borderRadius: 6,
    marginRight: theme.SPACING.m,
    minWidth: 60,
    height: 60,
    ...theme.SHADOWS.small,
  },
  activeCategoryItem: {
    backgroundColor: theme.COLORS.primary,
  },
  categoryText: {
    marginTop: theme.SPACING.xs,
    fontSize: width > 350 ? 12 : 11,
    color: theme.COLORS.textSecondary,
  },
  activeCategoryText: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
  },
  rideCardWrapper: {
    marginBottom: theme.SPACING.l,
  },
  rideCard: {
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.SHADOWS.medium,
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.SHADOWS.medium,
  },
  rideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.SPACING.m,
  },
  rideTitle: {
    color: theme.COLORS.white,
    fontSize: width > 350 ? 16 : 14,
    fontWeight: 'bold',
  },
  rideDiscount: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: theme.COLORS.secondary,
    fontWeight: 'bold',
    fontSize: width > 350 ? 14 : 12,
  },
  rideCardContent: {
    padding: theme.SPACING.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  balanceLabel: {
    color: theme.COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  balance: {
    color: theme.COLORS.white,
    fontSize: width > 350 ? 24 : 20,
    fontWeight: 'bold',
  },
  cardValue: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  valueLabel: {
    color: theme.COLORS.white,
    fontWeight: 'bold',
    fontSize: width > 350 ? 14 : 12,
  },
  addPassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.m,
    backgroundColor: theme.COLORS.white,
  },
  addPassText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.xs,
    marginTop: theme.SPACING.s,
  },
  sectionTitle: {
    fontSize: width > 350 ? 18 : 16,
    fontWeight: 'bold',
    color: theme.COLORS.text,
  },
  routeList: {
    paddingBottom: theme.SPACING.m,
    paddingTop: theme.SPACING.xs,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.card,
    borderRadius: 12,
    marginTop: 6,
    height: 95,
    ...theme.SHADOWS.small,
    overflow: 'hidden',
  },
  routeIconContainer: {
    width: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#236561',
  },
  routeContent: {
    flex: 1,
    padding: theme.SPACING.m,
    paddingLeft: theme.SPACING.m,
    justifyContent: 'center',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.space_4,
  },
  routeNumber: {
    fontSize: width > 350 ? 16 : 14,
    fontWeight: 'bold',
    color: theme.COLORS.text,
  },
  routeDetails: {
    marginBottom: theme.SPACING.space_2,
  },
  routeFrom: {
    fontSize: width > 350 ? 14 : 13,
    color: theme.COLORS.text,
    marginBottom: theme.SPACING.space_2,
  },
  routeTo: {
    fontSize: width > 350 ? 14 : 13,
    color: theme.COLORS.textSecondary,
  },
  priceContainer: {
    backgroundColor: theme.COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  price: {
    fontSize: width > 350 ? 14 : 12,
    fontWeight: 'bold',
    color: theme.COLORS.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
    fontSize: width > 350 ? 12 : 10,
    color: theme.COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.COLORS.textLight,
    marginTop: theme.SPACING.m,
    textAlign: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.SPACING.l,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    ...theme.SHADOWS.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.COLORS.text,
  },
  modalLabel: {
    fontSize: 16,
    color: theme.COLORS.text,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.COLORS.primary,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.COLORS.primary,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    color: theme.COLORS.text,
  },
  busRouteItem: {
    padding: theme.SPACING.m,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 12,
    marginRight: theme.SPACING.m,
    width: Math.min(160, width * 0.4), // Responsive width based on screen size
    height: Math.min(140, width * 0.35), // Responsive height based on screen size
    marginBottom: theme.SPACING.s,
    backgroundColor: theme.COLORS.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  busRouteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.SPACING.s,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  busRouteLineId: {
    fontSize: width > 350 ? 14 : 12,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  busRouteName: {
    fontSize: width > 350 ? 14 : 13,
    fontWeight: 'bold',
    color: theme.COLORS.text,
    marginTop: 40,
    marginBottom: 4,
  },
  busRouteFrequency: {
    fontSize: width > 350 ? 12 : 11,
    color: theme.COLORS.textSecondary,
    marginBottom: 8,
  },
  busRouteFare: {
    backgroundColor: theme.COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 'auto',
  },
  busRouteFareText: {
    fontSize: width > 350 ? 12 : 11,
    fontWeight: 'bold',
    color: theme.COLORS.text,
  },
  busRouteStops: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  busRouteStopsText: {
    marginLeft: 4,
    fontSize: width > 350 ? 12 : 10,
    color: theme.COLORS.textSecondary,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busRoutesList: {
    paddingHorizontal: 0,
    paddingTop: theme.SPACING.s,
    paddingBottom: theme.SPACING.m,
    paddingLeft: 0,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: theme.SPACING.m,
    paddingTop: 0,
    paddingBottom: theme.SPACING.l,
  },
  tripsContainer: {
    marginBottom: theme.SPACING.m,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.SPACING.m,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
    borderRadius: 8,
    marginTop: theme.SPACING.s,
  },
  viewMoreText: {
    color: theme.COLORS.primary,
    fontWeight: 'bold',
    marginRight: 5,
  },
  seeAllText: {
    color: theme.COLORS.primary,
    fontSize: width > 350 ? 14 : 12,
    fontWeight: 'bold',
  },
  routesContainer: {
    marginBottom: theme.SPACING.l,
  },
  bottomSpace: {
    height: Platform.OS === 'ios' ? 20 : 80,
  },
  headerCardWrapper: {
    marginHorizontal: theme.SPACING.m,
    marginBottom: theme.SPACING.m,
    marginTop: theme.SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.SHADOWS.medium,
  },
  headerRideCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  // Add FAB styles
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: Platform.OS === 'ios' ? 30 : 40,
    backgroundColor: theme.COLORS.primary,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 999,
  },
  // Additional styles for favorite modal
  transportTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transportTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  transportTypeSelected: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  transportTypeText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.COLORS.text,
  },
  transportTypeTextSelected: {
    color: theme.COLORS.white,
  },
  lineSelector: {
    marginBottom: 20,
    maxHeight: 200,
  },
  lineList: {
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: 8,
    padding: 5,
    maxHeight: 150,
  },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginVertical: 2,
  },
  lineIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  lineIconText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  lineText: {
    flex: 1,
    fontSize: 16,
    color: theme.COLORS.text,
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: theme.COLORS.textSecondary,
  },
  errorText: {
    color: theme.COLORS.error,
    marginBottom: 15,
  },
  
  // Styles for favorites display
  favoritesContainer: {
    marginTop: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.COLORS.card,
    borderRadius: 12,
    marginTop: 10,
    padding: 15,
    ...theme.SHADOWS.small,
  },
  favoriteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.COLORS.text,
    marginBottom: 5,
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteLineText: {
    fontSize: 14,
    color: theme.COLORS.textSecondary,
  },
  favoriteAction: {
    padding: 10,
  },
  emptyButton: {
    marginTop: 15,
    backgroundColor: theme.COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyRoutesContainer: {
    width: 180,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.COLORS.card,
    borderRadius: 12,
    marginLeft: theme.SPACING.m,
    padding: 10,
  },
  // New styles for filter UI
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.SPACING.s,
    paddingHorizontal: 5,
  },
  activeFiltersText: {
    fontSize: 12,
    color: theme.COLORS.textSecondary,
    flex: 1,
  },
  clearFiltersText: {
    fontSize: 12,
    color: theme.COLORS.primary,
    fontWeight: 'bold',
  },
});

export default TransportScreen; 