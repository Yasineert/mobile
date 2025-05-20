import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import transportApi from '../services/api';

interface BusStop {
  id: string;
  name: string;
  time: string;
  isCurrent?: boolean;
  isPassed?: boolean;
  isDelayed?: boolean;
  delayMinutes?: number;
}

interface LineDetails {
  id: string;
  name: string;
  type: 'bus' | 'tram';
  from: string;
  to: string;
  price: number;
  lastTrip?: {
    date: string;
    time: string;
  };
}

interface CardInfo {
  cardNumber: string;
  balance: number;
  userId: string;
}

// Define navigation props type
type RouteDetailScreenNavigationProp = StackNavigationProp<any, 'RouteDetail'>;
type RouteDetailScreenRouteProp = RouteProp<any, 'RouteDetail'>;

interface RouteDetailScreenProps {
  navigation: RouteDetailScreenNavigationProp;
  route: RouteDetailScreenRouteProp;
}

// Demo user ID for testing
const DEMO_USER_ID = "user1";

const RouteDetailScreen = ({ navigation, route }: RouteDetailScreenProps) => {
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const [lineDetails, setLineDetails] = useState<LineDetails | null>(null);
  const [cardInfo, setCardInfo] = useState<CardInfo | null>(null);
  const [busStops, setBusStops] = useState<BusStop[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  
  // Extract route ID and stops from navigation params
  const routeId = route.params?.routeId || 'L3';
  const customStops = route.params?.stops;
  const currentStopId = route.params?.currentStopId;
  
  // Fetch line details, card info and stops data
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        // For demo, we're simulating with setTimeout
        
        // 1. Get line details
        const lineData = await getLineDetails(routeId);
        setLineDetails(lineData);
        
        // 2. Get card info
        const cardData = await getCardInfo(DEMO_USER_ID);
        setCardInfo(cardData);
        
        // 3. Get stops data
        const stopsData = await getStopsData(routeId);
        setBusStops(stopsData);
        
        // 4. Check if balance is sufficient
        if (cardData && lineData && cardData.balance < lineData.price) {
          Alert.alert(
            "Low Balance",
            `Your current balance (${cardData.balance} MAD) is insufficient for this trip (${lineData.price} MAD). Please add credit to your card.`,
            [
              { text: "Add Credit", onPress: () => navigation.navigate('Transport') },
              { text: "OK" }
            ]
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load route details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [routeId]);
  
  // Update time and bus stops every minute to simulate real-time tracking
  useEffect(() => {
    // Initial update with current time
    const initialTime = new Date();
    setCurrentTime(initialTime);
    
    // Initial update of bus stops
    if (busStops.length > 0) {
      const initialUpdatedStops = updateBusStopsStatus(busStops, initialTime);
      setBusStops(initialUpdatedStops);
    }
    
    // Set up interval to update every 10 seconds for demo purposes
    const intervalId = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      
      // Update bus stops to simulate movement
      if (busStops.length > 0) {
        const updatedStops = updateBusStopsStatus([...busStops], newTime);
        setBusStops(updatedStops);
      }
    }, 10000); // Update every 10 seconds for better demo experience
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount
  
  // Function to update bus stops status based on current time
  const updateBusStopsStatus = (stops: BusStop[], currentTime: Date): BusStop[] => {
    // Create a new array instead of mutating the original
    const updatedStops = stops.map(stop => ({ ...stop }));
    
    // Get current hour and minute
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Reset all stop statuses first
    updatedStops.forEach(stop => {
      stop.isPassed = false;
      stop.isCurrent = false;
      stop.isDelayed = false;
      stop.delayMinutes = undefined;
    });
    
    // Parse all stop times and calculate minutes
    const stopTimes = updatedStops.map(stop => {
      const timeMatch = stop.time.match(/Today\s\/\s(\d+):(\d+)/);
      if (!timeMatch) return { stop, timeInMinutes: 0, valid: false };
      
      const stopHour = parseInt(timeMatch[1], 10);
      const stopMinute = parseInt(timeMatch[2], 10);
      const timeInMinutes = stopHour * 60 + stopMinute;
      
      return { 
        stop, 
        timeInMinutes, 
        valid: true,
        minutesFromNow: timeInMinutes - currentTimeInMinutes
      };
    });
    
    // Filter valid times and sort by time
    const validStopTimes = stopTimes
      .filter(item => item.valid)
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
    
    // Find the first non-passed stop (closest to current time)
    let currentStopIndex = -1;
    
    for (let i = 0; i < validStopTimes.length; i++) {
      const { minutesFromNow = 0 } = validStopTimes[i];
      
      if (minutesFromNow >= -5) { // Consider stops up to 5 minutes in the past as current
        currentStopIndex = i;
        break;
      }
    }
    
    // Mark stops as passed, current, or future
    validStopTimes.forEach((item, index) => {
      const { stop, minutesFromNow = 0 } = item;
      
      if (index < currentStopIndex) {
        // Passed stops
        stop.isPassed = true;
      } else if (index === currentStopIndex) {
        // Current stop
        stop.isCurrent = true;
        
        // 40% chance of delay for current stop
        if (Math.random() < 0.4) {
          stop.isDelayed = true;
          stop.delayMinutes = Math.floor(Math.random() * 10) + 5; // 5-15 minutes delay
        }
      } else {
        // Future stops
        // Closer stops have higher chance of delay
        const delayChance = index === currentStopIndex + 1 ? 0.3 : 0.15;
        
        if (Math.random() < delayChance) {
          stop.isDelayed = true;
          stop.delayMinutes = Math.floor(Math.random() * 8) + 3; // 3-10 minutes delay
        }
      }
    });
    
    return updatedStops;
  };
  
  // Mock function to get line details
  const getLineDetails = async (lineId: string): Promise<LineDetails> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data based on line ID
    if (lineId === 'L3') {
      return {
        id: 'L3',
        name: 'Line 3',
        type: 'bus',
        from: 'Guéliz',
        to: 'Jamaa El-Fna',
        price: 5,
        lastTrip: {
          date: '18/05/2023',
          time: '19:52',
        },
      };
    } else if (lineId === 'L8') {
      return {
        id: 'L8',
        name: 'Line 8',
        type: 'bus',
        from: 'Majorelle Garden',
        to: 'Menara Mall',
        price: 6,
        lastTrip: {
          date: '20/05/2023',
          time: '14:30',
        },
      };
    } else if (lineId === 'M1') {
      return {
        id: 'M1',
        name: 'Metro 1',
        type: 'tram',
        from: 'Marrakesh Station',
        to: 'City Center',
        price: 12,
      };
    } else if (lineId === 'L16') {
      return {
        id: 'L16',
        name: 'Line 16',
        type: 'bus',
        from: 'Airport',
        to: 'Medina',
        price: 7,
        lastTrip: {
          date: '20/05/2023',
          time: '12:45',
        },
      };
    } else if (lineId === 'L19') {
      return {
        id: 'L19',
        name: 'Line 19',
        type: 'bus',
        from: 'Majorelle Garden',
        to: 'Medina',
        price: 6,
        lastTrip: {
          date: '20/05/2023',
          time: '13:30',
        },
      };
    } else if (lineId === 'T1') {
      return {
        id: 'T1',
        name: 'Tram 1',
        type: 'tram',
        from: 'Airport',
        to: 'Medina',
        price: 10,
        lastTrip: {
          date: '20/05/2023',
          time: '14:00',
        },
      };
    } else if (lineId === 'T2') {
      return {
        id: 'T2',
        name: 'Tram 2',
        type: 'tram',
        from: 'Aéroport',
        to: 'Médina',
        price: 10,
        lastTrip: {
          date: new Date().toLocaleDateString(),
          time: `${new Date().getHours()-1}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()}`,
        },
      };
    } else if (lineId === 'T3') {
      return {
        id: 'T3',
        name: 'Tram 3',
        type: 'tram',
        from: 'Airport',
        to: 'Medina',
        price: 10,
        lastTrip: {
          date: '20/05/2023',
          time: '15:00',
        },
      };
    } else {
      // Default for any other route
      return {
        id: routeId,
        name: routeId.includes('NM') ? 'Night Metro ' + routeId.split(' ')[1] : routeId,
        type: routeId.startsWith('M') || routeId.startsWith('NM') ? 'tram' : 'bus',
        from: 'Marrakech Menara Airport',
        to: 'Jamaa El-Fna Square',
        price: 15,
        lastTrip: {
          date: '20/05/2023',
          time: '22:15',
        },
      };
    }
  };
  
  // Mock function to get card info
  const getCardInfo = async (userId: string): Promise<CardInfo> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock card data for Marrakech transport card
    return {
      cardNumber: 'ALSA-358914',
      balance: 75,
      userId: userId,
    };
  };
  
  // Helper function to generate arrival times based on current time with 10 minute intervals
  const generateArrivalTimes = (count: number = 6, interval: number = 10): string[] => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const arrivalTimes = [];
    let nextHour = currentHour;
    let nextMinute = currentMinute;
    
    // Generate arrival times with 10-minute intervals
    for (let i = 0; i < count; i++) {
      nextMinute += interval; // 10 minutes between each station
      if (nextMinute >= 60) {
        nextHour += 1;
        nextMinute -= 60;
      }
      
      // Format as HH:MM
      const formattedTime = `${nextHour}:${nextMinute < 10 ? '0' + nextMinute : nextMinute}`;
      arrivalTimes.push(formattedTime);
    }
    
    return arrivalTimes;
  };
  
  // Mock function to get stops data
  const getStopsData = async (lineId: string): Promise<BusStop[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // If custom stops are provided via navigation params, use those
    if (customStops) {
      return customStops.map((stop: any) => ({
        ...stop,
        isCurrent: stop.id === currentStopId || stop.isCurrent
      }));
    }
    
    // Generate arrival times for all routes
    const arrivalTimes = generateArrivalTimes(6);
    
    // Define stops for each line with dynamic arrival times
    if (lineId === 'T2') {
      return [
        {
          id: '1',
          name: 'Aéroport',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Marrakesh Station',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Guéliz',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Jamaa El-Fna',
          time: `Today / ${arrivalTimes[3]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 10,
        },
        {
          id: '5',
          name: 'Médina',
          time: `Today / ${arrivalTimes[4]}`,
        },
      ];
    } else if (lineId === 'T1') {
      return [
        {
          id: '1',
          name: 'Tramway Central',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Tramway Medina',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Tramway Agdal',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Tramway Palmeraie',
          time: `Today / ${arrivalTimes[3]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 7,
        },
      ];
    } else if (lineId === 'L8') {
      return [
        {
          id: '1',
          name: 'Marrakech Train Station',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Avenue Mohammed VI',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Menara Mall',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Royal Theater',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Koutoubia Mosque',
          time: `Today / ${arrivalTimes[4]}`,
        },
        {
          id: '6',
          name: 'Jamaa El-Fna Square',
          time: `Today / ${arrivalTimes[5]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 8,
        },
      ];
    } else if (lineId === 'T3') {
      return [
        {
          id: '1',
          name: 'Gare Centrale',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Majorelle',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Avenue Hassan II',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Palais Royal',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Médina Nord',
          time: `Today / ${arrivalTimes[4]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 5,
        },
      ];
    } else if (lineId === 'L3') {
      return [
        {
          id: '1',
          name: 'Guéliz',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Marrakesh Station',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Hivernage',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Menara Mall',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Jamaa El-Fna',
          time: `Today / ${arrivalTimes[4]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 10,
        },
      ];
    } else if (lineId === 'L16') {
      return [
        {
          id: '1',
          name: 'Airport',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Marrakesh Station',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Guéliz',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Jamaa El-Fna',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Medina',
          time: `Today / ${arrivalTimes[4]}`,
        },
      ];
    } else if (lineId === 'L19') {
      return [
        {
          id: '1',
          name: 'Majorelle Garden',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Menara Mall',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Koutoubia Mosque',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Jamaa El-Fna',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Medina',
          time: `Today / ${arrivalTimes[4]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 12,
        },
      ];
    } else {
      // Default case - generic stops with dynamic times
      return [
        {
          id: '1',
          name: 'Guéliz',
          time: `Today / ${arrivalTimes[0]}`,
          isPassed: true,
        },
        {
          id: '2',
          name: 'Marrakesh Station',
          time: `Today / ${arrivalTimes[1]}`,
          isPassed: true,
        },
        {
          id: '3',
          name: 'Hivernage',
          time: `Today / ${arrivalTimes[2]}`,
          isCurrent: true,
        },
        {
          id: '4',
          name: 'Menara Mall',
          time: `Today / ${arrivalTimes[3]}`,
        },
        {
          id: '5',
          name: 'Jamaa El-Fna',
          time: `Today / ${arrivalTimes[4]}`,
          isDelayed: Math.random() < 0.3,
          delayMinutes: 8,
        },
      ];
    }
  };

  // Filter stops based on active tab
  const getFilteredStops = () => {
    if (activeTab === 'delayed') {
      return busStops.filter(stop => stop.isDelayed);
    }
    return busStops;
  };
  
  // Function to manually refresh and update bus status
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Update current time
    const newTime = new Date();
    setCurrentTime(newTime);
    
    // Update bus stops status
    if (busStops.length > 0) {
      const updatedStops = updateBusStopsStatus(busStops, newTime);
      setBusStops(updatedStops);
    }
    
    // Simulate network delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderBusStop = (item: BusStop) => {
    return (
      <View style={styles.busStopContainer}>
        {/* Timeline connector */}
        <View style={styles.timelineContainer}>
          <View style={[
            styles.timelineDot,
            item.isPassed && styles.passedDot,
            item.isCurrent && styles.currentDot,
            item.isDelayed && styles.delayedDot
          ]} />
          {item.id !== busStops[busStops.length - 1].id && (
            <View style={[
              styles.timelineLine,
              item.isPassed && styles.passedLine
            ]} />
          )}
        </View>
        
        {/* Stop information */}
        <View style={[
          styles.stopInfo,
          item.isCurrent && styles.currentStop,
          item.isDelayed && styles.delayedStop
        ]}>
          <View style={styles.stopHeader}>
            <Text style={styles.stopName}>{item.name}</Text>
            {item.isCurrent && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentText}>Current</Text>
              </View>
            )}
            {item.isPassed && (
              <Icon name="checkmark-circle" size={18} color="#2ecc71" />
            )}
            {item.isDelayed && (
              <View style={styles.delayedBadge}>
                <Text style={styles.delayedText}>+{item.delayMinutes} min</Text>
              </View>
            )}
          </View>
          <View style={styles.timeContainer}>
            <Icon name="time-outline" size={14} color="#666" style={styles.timeIcon} />
            <Text style={[
              styles.stopTime,
              item.isDelayed && styles.delayedTimeText
            ]}>
              {item.isDelayed ? `Delayed: ${item.time}` : `Next arrival: ${item.time}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Handle view in real-time button press
  const handleViewRealTime = () => {
    // Ensure we have the most up-to-date stops data
    const updatedStops = updateBusStopsStatus(busStops, new Date());
    
    // Navigate to the Map screen with the updated data
    navigation.navigate('Map', {
      routeId: lineDetails?.id || routeId,
      stops: updatedStops,
      currentStopId: updatedStops.find(stop => stop.isCurrent)?.id,
      // Pass additional data for real-time tracking
      realTimeTracking: true,
      from: lineDetails?.from || 'Aéroport',
      to: lineDetails?.to || 'Médina',
      price: lineDetails?.price || 10
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading route details...</Text>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>
          {lineDetails?.type === 'bus' ? (
            <Icon name="bus" size={20} color="#333" />
          ) : (
            <MaterialIcons name="tram" size={20} color="#333" />
          )}
          {" "}{lineDetails?.id || routeId}
        </Text>
      </View>

      {/* Line Summary Card */}
      <View style={styles.busInfoCard}>
        <View style={styles.busInfoHeader}>
          <View style={[
            styles.busLogoContainer,
            { backgroundColor: lineDetails?.type === 'bus' ? '#3498db' : '#e67e22' }
          ]}>
            {lineDetails?.type === 'bus' ? (
              <Icon name="bus" size={24} color="#fff" />
            ) : (
              <MaterialIcons name="tram" size={24} color="#fff" />
            )}
          </View>
          <View style={styles.busDetails}>
            <Text style={styles.busTitle}>From: {lineDetails?.from || 'N/A'}</Text>
            <Text style={styles.busSubtitle}>To: {lineDetails?.to || 'N/A'}</Text>
            
            {lineDetails?.lastTrip && (
              <View style={styles.lastTripContainer}>
                <Icon name="calendar-outline" size={14} color="#666" style={styles.lastTripIcon} />
                <Text style={styles.lastTripText}>
                  Last trip: {lineDetails.lastTrip.date} {lineDetails.lastTrip.time}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.cardInfoContainer}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Card Balance</Text>
            <Text style={[
              styles.balanceAmount,
              cardInfo && lineDetails && cardInfo.balance < lineDetails.price && styles.insufficientBalance
            ]}>
              {cardInfo ? `${cardInfo.balance} MAD` : 'N/A'}
            </Text>
            {cardInfo && lineDetails && cardInfo.balance < lineDetails.price && (
              <Text style={styles.insufficientBalanceText}>Insufficient balance</Text>
            )}
          </View>
          
        <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              Price: {lineDetails?.price || 'N/A'} MAD
            </Text>
          </View>
        </View>
        
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumberText}>
            Card: {cardInfo?.cardNumber || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Tab Selection */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>Current</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'delayed' && styles.activeTab]}
          onPress={() => setActiveTab('delayed')}
        >
          <Text style={[styles.tabText, activeTab === 'delayed' && styles.activeTabText]}>Delayed</Text>
          {busStops.filter(stop => stop.isDelayed).length > 0 && (
            <View style={styles.delayCountBadge}>
              <Text style={styles.delayCountText}>
                {busStops.filter(stop => stop.isDelayed).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Bus Stops List */}
      {getFilteredStops().length > 0 ? (
      <FlatList
          data={getFilteredStops()}
        renderItem={({ item }) => renderBusStop(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.stopsList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <View style={styles.timeUpdateContainer}>
              <Icon name="time-outline" size={16} color="#666" />
              <Text style={styles.timeUpdateText}>
                Last updated: {currentTime.getHours()}:{currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()}
              </Text>
            </View>
            <View style={styles.routeInfoBanner}>
              <Icon name="information-circle-outline" size={18} color="#3498db" />
              <Text style={styles.routeInfoText}>
                {lineDetails?.type === 'tram' ? 'Tram' : 'Bus'} {lineDetails?.id}: {lineDetails?.from} → {lineDetails?.to} | Updates every minute
              </Text>
            </View>
            <View style={styles.updateInstructions}>
              <Icon name="refresh-outline" size={16} color="#666" />
              <Text style={styles.updateInstructionsText}>
                Pull down to refresh data
              </Text>
            </View>
          </View>
        )}
      />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="information-circle-outline" size={48} color="#95a5a6" />
          <Text style={styles.emptyText}>No {activeTab === 'delayed' ? 'delayed stops' : 'stops'} found</Text>
        </View>
      )}
      
      {/* View Real Time Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.realTimeButton}
          onPress={handleViewRealTime}
        >
          <Icon name="map-outline" size={18} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View in real time</Text>
        </TouchableOpacity>
        
        {routeId === 'T2' && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live tracking enabled</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Nouveaux styles pour l'interface de suivi de bus
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  timeUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeUpdateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  routeInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f4fc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  routeInfoText: {
    fontSize: 14,
    color: '#3498db',
    marginLeft: 8,
    flex: 1,
  },
  updateInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  updateInstructionsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginRight: 6,
  },
  liveText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
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
  busInfoCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  busInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  busLogoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#3498db',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  busLogo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  busDetails: {
    flex: 1,
  },
  busTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  busSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  lastTripContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  lastTripIcon: {
    marginRight: 4,
  },
  lastTripText: {
    fontSize: 12,
    color: '#666',
  },
  cardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  balanceContainer: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  insufficientBalance: {
    color: '#e74c3c',
  },
  insufficientBalanceText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  priceBadge: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardNumberContainer: {
    marginTop: 12,
  },
  cardNumberText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  delayCountBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  delayCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stopsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  busStopContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#aaa',
    borderWidth: 3,
    borderColor: '#fff',
    marginVertical: 2,
    zIndex: 1,
  },
  currentDot: {
    backgroundColor: '#3498db',
    borderColor: '#e1f0fa',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  passedDot: {
    backgroundColor: '#2ecc71',
  },
  delayedDot: {
    backgroundColor: '#e74c3c',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#ddd',
    position: 'absolute',
    top: 20,
    bottom: 0,
    left: '50%',
    marginLeft: -1,
  },
  passedLine: {
    backgroundColor: '#2ecc71',
  },
  stopInfo: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentStop: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  delayedStop: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  stopTime: {
    color: '#666',
    fontSize: 14,
  },
  delayedTimeText: {
    color: '#e74c3c',
  },
  currentBadge: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  currentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  delayedBadge: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  delayedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 20,
  },
  realTimeButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteDetailScreen;