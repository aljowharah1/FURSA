import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import * as ds from '../services/storage/dataService';

interface UserContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<Pick<UserProfile, 'preferredLocations' | 'preferredIndustries' | 'preferredRoleTypes' | 'minimumSalary' | 'language'>>) => void;
  toggleSetting: (key: 'notificationsEnabled' | 'aiSuggestionsEnabled' | 'autoApplyEnabled' | 'darkMode') => void;
}

const defaultProfile: UserProfile = {
  id: 'default-user',
  name: '',
  email: '',
  university: '',
  major: '',
  graduationYear: new Date().getFullYear() + 1,
  preferredLocations: [],
  preferredIndustries: [],
  preferredRoleTypes: [],
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  swipeHistory: [],
  applicationHistory: [],
  successPatterns: { acceptedCompanies: [], successfulKeywords: [], winningCVFeatures: [] },
  totalApplications: 0,
  autoAppliedCount: 0,
  interviewsScheduled: 0,
  offersReceived: 0,
  notificationsEnabled: true,
  aiSuggestionsEnabled: true,
  autoApplyEnabled: false,
  language: 'en',
  darkMode: false,
  createdDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    ds.initializeData();
    const p = ds.getProfile();
    if (p) setProfile(p);
  }, []);

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...data };
      ds.updateProfile(data);
      return updated;
    });
  }, []);

  const updatePreferences = useCallback(
    (prefs: Partial<Pick<UserProfile, 'preferredLocations' | 'preferredIndustries' | 'preferredRoleTypes' | 'minimumSalary' | 'language'>>) => {
      updateProfile(prefs);
    },
    [updateProfile]
  );

  const toggleSetting = useCallback(
    (key: 'notificationsEnabled' | 'aiSuggestionsEnabled' | 'autoApplyEnabled' | 'darkMode') => {
      setProfile((prev) => {
        const updated = { ...prev, [key]: !prev[key] };
        ds.updateProfile({ [key]: updated[key] });
        return updated;
      });
    },
    []
  );

  return (
    <UserContext.Provider value={{ profile, updateProfile, updatePreferences, toggleSetting }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserContext must be used within a UserProvider');
  return context;
}
