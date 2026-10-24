import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUser as defaultUser } from '../services/mockData';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, org: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (localStorage.getItem('machinemind_logged_out') === 'true') {
      return null;
    }
    const saved = localStorage.getItem('machinemind_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Validate session against real backend on initialization
  useEffect(() => {
    if (localStorage.getItem('machinemind_logged_out') === 'true') {
      return;
    }
    const token = localStorage.getItem('machinemind_token');
    if (token) {
      apiClient.auth.getMe()
        .then((profile) => {
          if (profile) {
            setUser((prev) => ({
              ...prev,
              ...profile,
              plantLocation: profile.plant_location || profile.plantLocation || "Rotterdam Industrial Basin",
              accessTier: profile.access_tier || profile.accessTier || "Enterprise AI Full",
              notificationsCount: profile.notifications_count ?? 3
            }));
          }
        })
        .catch(() => {
          // Keep persisted local state if offline
        });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.removeItem('machinemind_logged_out');
      localStorage.setItem('machinemind_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('machinemind_user');
      localStorage.removeItem('machinemind_token');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    try {
      // Real backend API authentication
      const res = await apiClient.auth.login(cleanEmail, pass);
      const u = res.user;
      const authedUser: User = {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role as any || "Chief Reliability Engineer",
        organization: u.organization || "Apex Industrial Dynamics · Plant Delta-4",
        plantLocation: u.plant_location || "Rotterdam Industrial Basin",
        accessTier: u.access_tier as any || "Enterprise AI Full",
        notificationsCount: u.notifications_count ?? 3,
      };
      localStorage.removeItem('machinemind_logged_out');
      setUser(authedUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Authentication failed." };
    }
  };

  const register = async (name: string, email: string, pass: string, org: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanOrg = org ? org.trim() : "Apex Industrial Dynamics · Plant Delta-4";
    try {
      const res = await apiClient.auth.register(cleanName, cleanEmail, pass, cleanOrg);
      const u = res.user;
      const newUser: User = {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as any || "Chief Reliability Engineer",
        organization: u.organization || cleanOrg,
        plantLocation: u.plant_location || "Rotterdam Industrial Basin",
        accessTier: u.access_tier as any || "Enterprise AI Full",
        notificationsCount: 1,
      };
      localStorage.removeItem('machinemind_logged_out');
      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Registration failed." };
    }
  };

  const logout = () => {
    apiClient.auth.logout();
    localStorage.setItem('machinemind_logged_out', 'true');
    setUser(null);
  };

  const updateUser = async (fields: Partial<User>) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...fields } : null;
      if (updated) {
        localStorage.setItem('machinemind_user', JSON.stringify(updated));
      }
      return updated;
    });

    try {
      await apiClient.users.updateProfile({
        name: fields.name,
        role: fields.role,
        organization: fields.organization,
        plant_location: fields.plantLocation,
      });
    } catch {
      // Retain optimistic local state if backend is temporarily offline
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
