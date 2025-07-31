import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, fetchWithAuth } from '../utils/api';
import { apiEndpoints } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'officer' | 'admin';
  phoneNumber?: string;
  location?: string;
  prefLang?: string
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (userData: any) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("julishatoken")
      const user = localStorage.getItem("julishatokenuser")
      if(token)
      setLoading(false)
    if(user){
      setUser(JSON.parse(user))
    }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear any invalid auth state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post(apiEndpoints.common.auth.login, {
        email,
        password,
      });
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("julishatoken",response.token)
        localStorage.setItem("julishatokenuser",JSON.stringify(response.user))
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.post(apiEndpoints.common.auth.register, {
        fullName: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber.replace(/^0/, ''), // Remove leading 0
        password: userData.password,
        role: userData.role,
        location: userData.region,
        prefferedLang: userData.preferredLanguage
      });
      
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("julishatoken",response.token)
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('julishatoken')
      localStorage.removeItem('julishatokenuser')
      window.location.replace('/login');

    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    if (userData.role == 'farmer') {
      try {
        const response = await api.put(apiEndpoints.user.updateProfile, userData);
        if (response.user) {
          setUser(response.user);
          return { success: true };
        }
        return { success: false, error: 'Profile update failed' };
      } catch (error) {
        console.error('Profile update failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Profile update failed'
        };
      }
    } else if(userData.role == 'officer'){
      try {
        const response = await fetchWithAuth('/officer/me', {
          method: 'PUT',
          body: JSON.stringify(userData)
        });
        // You may want to check the response here and update user if needed
        if (response && response.user) {
          setUser(response.user);
          return { success: true };
        }
        return { success: false, error: 'Profile update failed' };
      } catch (error) {
        console.error('Profile update failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Profile update failed'
        };
      }
    }
    // Default return if role is not 'farmer' or 'officer'
    return { success: false, error: 'Invalid user role' };
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await api.put(apiEndpoints.user.changePassword, {
        currentPassword,
        newPassword
      });
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password change failed' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};