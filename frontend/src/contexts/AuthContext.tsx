import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

type Citizen = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

type AuthContextType = {
  user: Citizen | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Citizen | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        setIsLoading(true);
        // Set auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user profile
        const { data } = await api.get('/api/citizen/profile');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data } = await api.post('/api/auth/login', { email, password });

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.citizen);

      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    } catch (error: any) {
      setError(error?.response?.data?.error || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);

      await api.post('/api/auth/register', userData);

      // Automatically login after registration
      await login(userData.email, userData.password);
    } catch (error: any) {
      setError(error?.response?.data?.error || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
