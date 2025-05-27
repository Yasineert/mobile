import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL - Replace with your actual API endpoint
const API_URL = 'https://api.marrakeshgo.com/auth/';

// Token storage keys
const TOKEN_KEY = '@MarrakeshGo:token';
const USER_KEY = '@MarrakeshGo:user';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// For development/demo purposes
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

/**
 * Authentication service for handling JWT-based auth operations
 */
class AuthService {
  // Store the current token
  private token: string | null = null;
  
  /**
   * Initialize the auth service by loading the token from storage
   */
  async init(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        this.token = token;
        this.setAuthHeader(token);
      }
    } catch (error) {
      console.error('Failed to load auth token', error);
    }
  }
  
  /**
   * Set the Authorization header for all future API requests
   */
  private setAuthHeader(token: string | null): void {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
  
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.post(`${API_URL}login`, credentials);
      // const data = response.data;
      
      // For demo purposes, we'll use mock data
      await mockDelay();
      
      // Mock successful login
      const data: AuthResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlhdCI6MTYxNjQyMDgwMCwiZXhwIjoxNjE2NTA3MjAwfQ.example-signature',
        user: {
          id: 'user1',
          name: 'Demo User',
          email: credentials.email,
        }
      };
      
      // Store token and user data
      this.token = data.token;
      this.setAuthHeader(data.token);
      await this.saveAuthData(data);
      
      return data;
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Invalid credentials');
    }
  }
  
  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.post(`${API_URL}register`, userData);
      // const data = response.data;
      
      // For demo purposes, we'll use mock data
      await mockDelay();
      
      // Mock successful registration
      const data: AuthResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJuZXctdXNlciIsImlhdCI6MTYxNjQyMDgwMCwiZXhwIjoxNjE2NTA3MjAwfQ.example-signature',
        user: {
          id: 'new-user',
          name: userData.name,
          email: userData.email,
        }
      };
      
      // Store token and user data
      this.token = data.token;
      this.setAuthHeader(data.token);
      await this.saveAuthData(data);
      
      return data;
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed');
    }
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      this.token = null;
      this.setAuthHeader(null);
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
  
  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }
  
  /**
   * Get the current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Failed to get current user', error);
      return null;
    }
  }
  
  /**
   * Save authentication data to storage
   */
  private async saveAuthData(data: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch (error) {
      console.error('Failed to save auth data', error);
    }
  }
  
  /**
   * Verify if the token is still valid
   */
  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }
    
    try {
      // In a real app, this would verify with the server
      // await axios.get(`${API_URL}verify`);
      
      // For demo purposes, we'll assume the token is valid
      return true;
    } catch (error) {
      console.error('Token verification failed', error);
      await this.logout();
      return false;
    }
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
