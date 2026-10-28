'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { StaffRole } from '@/lib/types';

export interface UserSession {
  id: string;
  email: string;
  display_name: string;
  role: StaffRole | 'reader';
  is_member: boolean;
  member_until?: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (email: string, role?: StaffRole | 'reader') => void;
  logout: () => void;
  setRole: (role: StaffRole | 'reader') => void;
  saves: string[];
  toggleSave: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  interests: string[];
  toggleInterest: (slug: string) => void;
  readingHistory: string[];
  addHistory: (slug: string) => void;
  isMember: boolean;
  activateMembership: () => void;
}

const defaultAdminUser: UserSession = {
  id: 'usr-admin-1',
  email: 'admin@theprofit.in',
  display_name: 'അഡ്മിൻ എഡിറ്റർ',
  role: 'admin',
  is_member: true,
  member_until: '2027-12-31'
};

const AuthContext = createContext<AuthContextType>({
  user: defaultAdminUser,
  login: () => {},
  logout: () => {},
  setRole: () => {},
  saves: [],
  toggleSave: () => {},
  isSaved: () => false,
  interests: [],
  toggleInterest: () => {},
  readingHistory: [],
  addHistory: () => {},
  isMember: true,
  activateMembership: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(defaultAdminUser);
  const [saves, setSaves] = useState<string[]>(['kerala-gold-rate-today-surges-new-record']);
  const [interests, setInterests] = useState<string[]>(['business', 'kerala', 'technology', 'markets']);
  const [readingHistory, setReadingHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedSaves = localStorage.getItem('news_saves');
      if (storedSaves) setSaves(JSON.parse(storedSaves));

      const storedInterests = localStorage.getItem('news_interests');
      if (storedInterests) setInterests(JSON.parse(storedInterests));

      const storedHistory = localStorage.getItem('news_history');
      if (storedHistory) setReadingHistory(JSON.parse(storedHistory));

      const storedUser = localStorage.getItem('news_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      // Ignore JSON parse errors in localStorage
    }
  }, []);

  const login = (email: string, role: StaffRole | 'reader' = 'reader') => {
    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      display_name: email.split('@')[0],
      role,
      is_member: role === 'admin'
    };
    setUser(newUser);
    localStorage.setItem('news_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('news_user');
  };

  const setRole = (role: StaffRole | 'reader') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('news_user', JSON.stringify(updated));
  };

  const toggleSave = (slug: string) => {
    setSaves(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem('news_saves', JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (slug: string) => saves.includes(slug);

  const toggleInterest = (slug: string) => {
    setInterests(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem('news_interests', JSON.stringify(next));
      return next;
    });
  };

  const addHistory = (slug: string) => {
    setReadingHistory(prev => {
      const next = [slug, ...prev.filter(s => s !== slug)].slice(0, 30);
      localStorage.setItem('news_history', JSON.stringify(next));
      return next;
    });
  };

  const activateMembership = () => {
    if (!user) return;
    const updated = { ...user, is_member: true, member_until: '2027-12-31' };
    setUser(updated);
    localStorage.setItem('news_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setRole,
        saves,
        toggleSave,
        isSaved,
        interests,
        toggleInterest,
        readingHistory,
        addHistory,
        isMember: Boolean(user?.is_member),
        activateMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
