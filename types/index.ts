export interface Property {
  id: number;
  title: string;
  price: number;
  location: {
    city: string;
    state: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    }
  };
  features: string[];
  images: string[];
}

export interface Booking {
  id: number;
  propertyId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface BookingFormData {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
}