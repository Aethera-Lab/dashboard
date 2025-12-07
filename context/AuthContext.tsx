import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState, KYCStatus } from '../types';
import { db } from '../services/mockBackend';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load session from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('aethera_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, role: UserRole) => {
    // Mock login logic
    let foundUser = db.getUserByEmail(email);
    
    if (!foundUser) {
        // Auto-register for demo purposes if not found, except admin
        if (role === UserRole.ADMIN && email !== 'admin@aethera.com') {
            throw new Error('Invalid Admin Credentials');
        }
        foundUser = {
            id: `u${Date.now()}`,
            email,
            name: email.split('@')[0],
            role,
            kycStatus: role === UserRole.INSTALLER ? KYCStatus.NONE : undefined
        };
        db.registerUser(foundUser);
    }

    if (foundUser.role !== role) {
        throw new Error(`User exists but is not a ${role}`);
    }

    setUser(foundUser);
    localStorage.setItem('aethera_session', JSON.stringify(foundUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aethera_session');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
        const newUser = { ...user, ...updates };
        setUser(newUser);
        localStorage.setItem('aethera_session', JSON.stringify(newUser));
        // Sync with DB
        if (newUser.kycStatus) {
             db.updateUserKYC(newUser.id, newUser.kycStatus);
        }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};