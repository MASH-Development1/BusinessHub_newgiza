import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface User {
  email: string;
  name: string;
  role: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (userData: User, sessionId: string) => void;
  logout: () => void;
  isLoading: boolean;
  sessionId: string | null;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get session ID from localStorage on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('[AuthContext] Loaded sessionId from localStorage:', storedSessionId);
    }
    setIsLoading(false);
  }, []);

  // Query current user using session ID
  const authData = useQuery(api.auth.getCurrentUser, sessionId ? { sessionId } : "skip");

  // Update user state when auth data changes
  useEffect(() => {
    if (authData) {
      setUser({
        email: authData.user.email,
        name: authData.user.name,
        role: authData.user.role,
        id: authData.user._id,
      });
      console.log('[AuthContext] Updated user from Convex:', authData.user);
    } else {
      setUser(null);
      console.log('[AuthContext] No user from Convex, set user to null');
    }
  }, [authData]);

  const login = (userData: User, newSessionId: string) => {
    setUser(userData);
    setSessionId(newSessionId);
    setIsLoading(false);
    localStorage.setItem('sessionId', newSessionId);
    console.log('[AuthContext] Login called. User:', userData, 'SessionId:', newSessionId);
  };

  const logoutMutation = useMutation(api.auth.logout);

  const logout = async () => {
    if (sessionId) {
      try {
        await logoutMutation({ sessionId });
        console.log('[AuthContext] Logout mutation successful');
      } catch (error) {
        console.error('[AuthContext] Logout error:', error);
      }
    }
    setUser(null);
    setSessionId(null);
    setIsLoading(false);
    localStorage.removeItem('sessionId');
    console.log('[AuthContext] Logged out, cleared session and user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    isLoading,
    sessionId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 