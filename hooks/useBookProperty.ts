// hooks/useBookProperty.ts
// Custom hook for booking a property using React Query mutation.

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../api';
import { Booking } from '../types';
import { useBookingStore } from '../stores/bookingStore'; // Zustand store for local updates
import Toast from 'react-native-root-toast';

export const useBookProperty = () => {
  const queryClient = useQueryClient();
  const addBookingToStore = useBookingStore((state) => state.addBooking);

  let toast = Toast.show('Booking in progress...', {
  duration: Toast.durations.SHORT,
  position: Toast.positions.BOTTOM,
  shadow: true,
  animation: true,
  hideOnPress: true,
  delay: 0,
});

  return useMutation<Booking, Error, Omit<Booking, 'id'>>({
    mutationFn: createBooking, // The API function to call
    onMutate: async (newBookingData) => {
      // Optional: Cancel any outgoing refetches for bookings to prevent race conditions
      await queryClient.cancelQueries({ queryKey: ['bookings'] });

      // Optional: Optimistically update the local state (Zustand)
      // This makes the UI feel faster by immediately showing the booking
      // You might generate a temporary ID here if the API doesn't return one immediately
      const temporaryBooking: Booking = {
        ...newBookingData,
        id: `temp-${Date.now()}`, // Generate a temporary ID
        bookingDate: new Date().toISOString().split('T')[0], // Current date
      };
      addBookingToStore(temporaryBooking);
      Toast.show('Booking in progress...', { duration: Toast.durations.SHORT });

      return { temporaryBooking }; // Context passed to onError/onSettled
    },
    onSuccess: (data, variables, context) => {
      // Invalidate the 'bookings' query to refetch the latest data from the API
      // This ensures our bookings screen is up-to-date with the server
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Update the temporary booking in Zustand with the actual one from the API
      // (This would require a `updateBooking` method in your Zustand store)
      // For simplicity, we'll just add the real one and rely on refetch for full sync.
      Toast.show('Property booked successfully!', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
    },
    onError: (error, variables, context) => {
      // Rollback optimistic update if the mutation fails
      // This would involve removing the temporaryBooking from the Zustand store
      // For now, we'll just show an error toast.
      console.error('Booking failed:', error);
      Toast.show(`Booking failed: ${error.message}`, { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      // If you had a sophisticated rollback:
      // useBookingStore.getState().removeBooking(context?.temporaryBooking?.id);
    },
    // You can also use onSettled which runs after either success or error
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ['bookings'] });
    // },
  });
};