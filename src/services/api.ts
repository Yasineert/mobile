import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { mockApi } from './mockData';

// Flag to force using mock API for testing
const USE_MOCK_API = true;

// Set base URL based on platform and environment
// For real device testing, use your computer's actual local IP address
let API_BASE_URL = 'http://localhost:8080/api';

// If running on Android emulator, use 10.0.2.2 to access host machine
if (Platform.OS === 'android' && __DEV__) {
  API_BASE_URL = 'http://10.0.2.2:8080/api';
}

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request/response logging
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('API Response Error:', {
        status: axiosError.response?.status,
        url: axiosError.config?.url,
        message: axiosError.message
      });
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface Card {
  cardNumber: string;
  balance: number;
  userId: string;
  discount: number;
}

export interface Trip {
  id: number;
  fromLocation: string;
  toLocation: string;
  line: string;
  price: number;
  time: string;
  userId: string;
  type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AddCreditRequest {
  userId: string;
  amount: number;
}

// API functions
export const transportApi = {
  // Get user's card info
  async getCardInfo(userId: string): Promise<Card> {
    if (USE_MOCK_API) {
      console.log('Using mock API for card info');
      return mockApi.getCardInfo(userId);
    }

    try {
      const response = await api.get<ApiResponse<Card>>(`/card/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching card info:', error);
      console.log('Falling back to mock data for card info');
      // Fallback to mock data on failure
      return mockApi.getCardInfo(userId);
    }
  },

  // Get user's trip history
  async getTrips(userId: string): Promise<Trip[]> {
    if (USE_MOCK_API) {
      console.log('Using mock API for trips');
      return mockApi.getTrips(userId);
    }

    try {
      const response = await api.get<ApiResponse<Trip[]>>(`/trips/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching trips:', error);
      console.log('Falling back to mock data for trips');
      // Fallback to mock data on failure
      return mockApi.getTrips(userId);
    }
  },

  // Add credit to user's card
  async addCredit(request: AddCreditRequest): Promise<Card> {
    if (USE_MOCK_API) {
      console.log('Using mock API for adding credit');
      return mockApi.addCredit(request);
    }

    try {
      const response = await api.post<ApiResponse<Card>>('/payment', request);
      return response.data.data;
    } catch (error) {
      console.error('Error adding credit:', error);
      console.log('Falling back to mock data for adding credit');
      // Fallback to mock data on failure
      return mockApi.addCredit(request);
    }
  }
};

// Error handling helper
const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    
    if (!axiosError.response) {
      return new Error('Network error. Please check your internet connection.');
    }
    
    const errorMessage = axiosError.response.data 
      ? (axiosError.response.data as ApiResponse<any>).message
      : axiosError.message;
      
    return new Error(errorMessage || 'An error occurred while processing your request.');
  }
  return new Error('An unexpected error occurred.');
};

export default transportApi; 