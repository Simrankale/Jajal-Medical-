import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/index.ts';
import { apiClient } from '../services/apiClient.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEngineer: boolean;
  isViewer: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; errors?: any }>;
  logout: () => Promise<void>;
  quickLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DUMMY_CREDENTIALS: Record<UserRole, { email: string; pass: string; label: string; name: string }> = {
  admin: {
    email: 'simran.kale@jajalmedical.com',
    pass: 'admin123',
    label: 'Simran Sanket Kale (Admin)',
    name: 'Dr. Simran Sanket Kale (Chief Medical Admin)',
  },
  engineer: {
    email: 'varun.rivanker@jajalmedical.com',
    pass: 'engineer123',
    label: 'Varun Rivanker (Engineer)',
    name: 'Varun Rivanker (Lead Biomedical Engineer)',
  },
  viewer: {
    email: 'anjali.rathord@jajalmedical.com',
    pass: 'viewer123',
    label: 'Anjali Rathord (Viewer)',
    name: 'Dr. Anjali Rathord (Clinical Reviewer)',
  },
};


const DEFAULT_DEMO_USER: User = {
  id: 1,
  name: 'Dr. Simran Sanket Kale (Chief Medical Admin)',
  email: 'simran.kale@jajalmedical.com',
  role: 'admin',
  createdAt: '2026-01-10T08:00:00Z',
};

const DEFAULT_DEMO_TOKEN = 'token_admin_demo_secret_2026';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const isExplicitLoggedOut = localStorage.getItem('jajal_explicit_logout');
    if (isExplicitLoggedOut) return null;
    const saved = apiClient.getSavedUser();
    if (!saved || saved.name?.includes('Marcus') || saved.name?.includes('Vance')) {
      localStorage.setItem('jajal_medical_auth_user', JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return saved;
  });

  const [token, setToken] = useState<string | null>(() => {
    const isExplicitLoggedOut = localStorage.getItem('jajal_explicit_logout');
    if (isExplicitLoggedOut) return null;
    const existing = apiClient.getToken();
    if (!existing) {
      apiClient.setToken(DEFAULT_DEMO_TOKEN);
      return DEFAULT_DEMO_TOKEN;
    }
    return existing;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // If not logged out, ensure active user is Dr. Simran Sanket Kale
    const isExplicitLoggedOut = localStorage.getItem('jajal_explicit_logout');
    if (!isExplicitLoggedOut) {
      if (!user || user.name?.includes('Marcus') || user.name?.includes('Vance')) {
        setUser(DEFAULT_DEMO_USER);
        setToken(DEFAULT_DEMO_TOKEN);
        apiClient.setToken(DEFAULT_DEMO_TOKEN);
        localStorage.setItem('jajal_medical_auth_user', JSON.stringify(DEFAULT_DEMO_USER));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    localStorage.removeItem('jajal_explicit_logout');
    try {
      const res = await apiClient.login(email, password);
      if (res.body.success && res.body.data) {
        setUser(res.body.data.user);
        setToken(res.body.data.token);
        return { success: true, message: res.body.message };
      }
      return {
        success: false,
        message: res.body.message || 'Login failed',
        errors: res.body.errors,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    localStorage.setItem('jajal_explicit_logout', 'true');
    try {
      await apiClient.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (role: UserRole) => {
    const creds = DUMMY_CREDENTIALS[role];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isEngineer = user?.role === 'engineer';
  const isViewer = user?.role === 'viewer';

  // Permission gates matching CasePolicy
  const canCreate = isAdmin || isEngineer;
  const canEdit = isAdmin || isEngineer;
  const canDelete = isAdmin; // Delete is strictly for Admin only

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isEngineer,
        isViewer,
        canCreate,
        canEdit,
        canDelete,
        login,
        logout,
        quickLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
