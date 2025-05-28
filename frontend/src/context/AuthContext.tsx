import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/global';
import { User } from '../types/types';

export interface AuthContextType {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  access_token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  register: async () => false,
  login: async () => false,
  logout: () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Paskaityti vartotoją, jei jau yra token
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Išvalo klaidą
  const clearError = () => setError(null);

  // Registracija: grąžina true/false
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    clearError();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { access_token, user } = res.data;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Registration failed. Please try again.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Prisijungimas: grąžina true/false
  const login = async (email: string, password: string): Promise<boolean> => {
    clearError();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = res.data;
      localStorage.setItem('access_token', access_token);
      setToken(access_token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : 'Login failed. Please check your credentials.';
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Atsijungimas
  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/'); // arba navigate('/login') jei turi tokį route
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        access_token: token,
        isAuthenticated,
        isLoading,
        error,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
