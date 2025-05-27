import React, { createContext, useState, useEffect, useContext } from 'react';
import authService, { User } from '../services/authService';

// Define the context type
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        await authService.init();
        const isValid = await authService.verifyToken();
        setIsAuthenticated(isValid);
        
        if (isValid) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
