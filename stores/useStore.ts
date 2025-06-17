import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}

// For demo purposes, we'll use a mock user
const mockUser: User = {
  id: 1,
  name: "React Native",
  email: "react@example.com",
  avatar: "https://reactnative.dev/img/tiny_logo.png"
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: mockUser, // Pre-populated for demo
      isAuthenticated: true, // Pre-authenticated for demo
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);