export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string[];
  location: {
    city: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  features: string[];
  rating: number;
  reviews: number;
  host: {
    name: string;
    image: string;
  };
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
  startDate: string;
  endDate: string;
  guests: number;
}