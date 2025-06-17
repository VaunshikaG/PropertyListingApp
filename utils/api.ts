import { Property, Booking, User } from '@/types';

// Base URL for the JSON server
const API_URL = 'http://172.20.10.4:5000';

// Fetch all properties with optional search query
export const fetchProperties = async (search?: string): Promise<Property[]> => {
  let url = `${API_URL}/properties`;
  if (search) {
    url += `?q=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
};

// Fetch a single property by ID
export const fetchPropertyById = async (id: number): Promise<Property> => {
  const response = await fetch(`${API_URL}/properties/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch property with ID ${id}`);
  }
  return response.json();
};

// Fetch all bookings for a user
export const fetchUserBookings = async (userId: number): Promise<Booking[]> => {
  const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

// Create a new booking
export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  });
  if (!response.ok) {
    throw new Error('Failed to create booking');
  }
  return response.json();
};

// Fetch user profile
export const fetchUserProfile = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
};