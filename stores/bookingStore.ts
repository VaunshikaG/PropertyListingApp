// stores/bookingStore.ts
// Zustand store for managing local booking state (e.g., booked properties for immediate display)
// Although bookings are fetched from API, we can use this for optimistic updates or client-side additions.

import { create } from 'zustand';
import { Booking, Property } from '../types';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  setBookings: (bookings: Booking[]) => void;
  // For simplicity, we won't handle deleting/updating bookings here, but you'd add methods for that.
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [], // Initial empty array of bookings
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  setBookings: (bookings) => set({ bookings }),
}));