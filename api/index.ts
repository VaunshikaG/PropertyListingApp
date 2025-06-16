// api/index.ts
// Centralized API service functions using Fetch API.
// React Query will then wrap these.

import { Property, Booking } from '../types';

const BASE_URL = 'http://localhost:3000'; // Ensure JSON-server is running on this port

// Function to fetch all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${BASE_URL}/properties`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Property[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Function to fetch a single property by ID
export const getPropertyById = async (id: string): Promise<Property> => {
  try {
    const response = await fetch(`${BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Property = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new booking
export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
  try {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Booking = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Function to fetch all bookings (for a specific user, if user authentication was implemented)
export const getBookings = async (): Promise<Booking[]> => {
  try {
    // In a real app, you'd filter by userId:
    // const response = await fetch(`${BASE_URL}/bookings?userId=${userId}`);
    const response = await fetch(`${BASE_URL}/bookings`); // Fetch all for simplicity with json-server
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Booking[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};