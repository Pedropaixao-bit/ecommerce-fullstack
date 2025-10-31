import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCreate, AuthContextType } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ username, password });
      
      setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      
      // Buscar dados do usuário (simulado - em produção seria uma chamada separada)
      const userData: User = {
        id: 1,
        username,
        email: '',
        full_name: '',
        is_active: true
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserCreate) => {
    try {
      setIsLoading(true);
      const newUser = await authAPI.register(userData);
      
      toast.success('Conta criada com sucesso!');
      return newUser;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Erro ao criar conta');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout realizado com sucesso!');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
