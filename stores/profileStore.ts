// stores/profileStore.ts
// Zustand store for managing user profile information (placeholder)

import { create } from 'zustand';
import { User } from '../types';

interface ProfileState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: { id: 'user-123', name: 'Guest User', email: 'guest@example.com' }, // Default guest user
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));