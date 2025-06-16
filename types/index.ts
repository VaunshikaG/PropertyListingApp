// types/index.ts
// Define TypeScript interfaces for your data models

export interface Property {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  description: string;
  imageUrl: string;
  features: string[]; // List of strings for features
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  bookingDate: string; // ISO date string, e.g., "2025-07-01"
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user profile fields as needed
}

// API Response Types (optional, but good practice)
export interface APIPropertiesResponse {
  properties: Property[];
}

export interface APIBookingResponse {
  booking: Booking;
}