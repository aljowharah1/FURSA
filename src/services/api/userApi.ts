import { api } from './client';
import type { UserProfile } from '../../types';

interface ProfileResponse {
  profile: UserProfile;
}

interface SwipeResponse {
  swipe: {
    internshipId: string;
    direction: string;
    timestamp: string;
    matchScore: number;
  };
}

export const userApi = {
  // Get the current user's profile
  getProfile() {
    return api.get<ProfileResponse>('/user/profile');
  },

  // Update profile fields
  updateProfile(data: Partial<UserProfile>) {
    return api.put<ProfileResponse>('/user/profile', data);
  },

  // Record a swipe action on an internship
  recordSwipe(data: { internshipId: string; direction: string; matchScore: number }) {
    return api.post<SwipeResponse>('/user/swipe', data);
  },
};
