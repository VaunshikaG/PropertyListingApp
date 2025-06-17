import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking } from '@/types';
import { fetchUserBookings, createBooking } from '@/utils/api';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  fetchBookings: (userId: number) => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id'>) => Promise<void>;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,
      error: null,

      fetchBookings: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
          const bookings = await fetchUserBookings(userId);
          set({ bookings, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addBooking: async (booking) => {
        set({ isLoading: true, error: null });
        try {
          const newBooking = await createBooking(booking);
          set({
            bookings: [...get().bookings, newBooking],
            isLoading: false
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
