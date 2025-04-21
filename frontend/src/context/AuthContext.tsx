// Auth Context  - bus atsakingas uz žmogaus autentifikaciją, laikys funkcijas ir state

import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/global';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  access_token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  access_token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token') || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setIsLoading(true);

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const res = await axios.get(`${API_URL}/auth/user`, config);

          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.log(error);
          localStorage.removeItem('access_token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Authentication failed. Please log in again.');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem('access_token', res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('access_token', res.data.access_token);
      setToken(res.data.access_token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
