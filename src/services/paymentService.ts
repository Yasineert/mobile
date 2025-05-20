import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

// Choose the appropriate URL based on platform and environment
let API_URL = 'http://192.168.1.100:8080/api';

// If running on Android emulator, use 10.0.2.2 instead of localhost
if (Platform.OS === 'android' && !__DEV__) {
  // For production builds
  API_URL = 'http://192.168.1.100:8080/api'; 
} else if (Platform.OS === 'android' && __DEV__) {
  // For local development on Android emulator
  API_URL = 'http://10.0.2.2:8080/api';
}

console.log('API URL:', API_URL);

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 second timeout

export interface PaymentData {
  firstName: string;
  lastName: string;
  cardNumber: string;
  cvc: string;
  expiryDate: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: any;
}

export const paymentService = {
  async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      console.log('Sending payment request to:', `${API_URL}/payment`);
      console.log('Payment data:', JSON.stringify(paymentData));
      
      const response = await axios.post(`${API_URL}/payment`, paymentData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('Payment response:', JSON.stringify(response.data));
      return response.data as PaymentResponse;
    } catch (error: unknown) {
      console.error('Payment error details:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Request details:', {
          url: axiosError.config?.url,
          method: axiosError.config?.method,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText
        });
        
        if (axiosError.code === 'ECONNABORTED') {
          return {
            success: false,
            message: 'Request timed out. Please try again later.',
            data: null
          };
        }
        
        if (!axiosError.response) {
          return {
            success: false,
            message: 'Network error. Please check your internet connection and make sure the server is running.',
            data: null
          };
        }
        
        return (axiosError.response?.data as PaymentResponse) || {
          success: false,
          message: `Error: ${axiosError.message}`,
          data: null
        };
      }
      
      return {
        success: false,
        message: 'An unexpected error occurred',
        data: null
      };
    }
  },

  async getAllPayments(): Promise<PaymentResponse> {
    try {
      const response = await axios.get(`${API_URL}/payments`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data as PaymentResponse;
    } catch (error: unknown) {
      console.error('Get payments error:', error);
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          return {
            success: false,
            message: 'Network error. Please check your internet connection.',
            data: null
          };
        }
        return (error.response?.data as PaymentResponse) || {
          success: false,
          message: `Error: ${error.message}`,
          data: null
        };
      }
      return {
        success: false,
        message: 'Network error or server unavailable',
        data: null
      };
    }
  }
}; 