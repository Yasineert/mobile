import { Card, Trip } from './api';

// Mock card data for Marrakech ALSA transport cards
export const mockCards: Record<string, Card> = {
  user1: {
    cardNumber: 'ALSA-358914',
    balance: 75.0,
    userId: 'user1',
    discount: 15.0,
  },
  user2: {
    cardNumber: 'ALSA-496238',
    balance: 120.0,
    userId: 'user2',
    discount: 10.0,
  },
  user3: {
    cardNumber: 'ALSA-237651',
    balance: 45.5,
    userId: 'user3',
    discount: 20.0,
  },
  user4: {
    cardNumber: 'ALSA-789124',
    balance: 200.0,
    userId: 'user4',
    discount: 5.0,
  },
  admin: {
    cardNumber: 'ALSA-123456',
    balance: 500.0,
    userId: 'admin',
    discount: 25.0,
  },
};

// Get current date minus days
const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Mock trip data
export const mockTrips: Record<string, Trip[]> = {
  user1: [
    {
      id: 1,
      fromLocation: 'Gueliz',
      toLocation: 'Jamaa el-Fna',
      line: 'L3',
      price: 5.0,
      time: daysAgo(1),
      userId: 'user1',
      type: 'bus',
    },
    {
      id: 2,
      fromLocation: 'Menara Mall',
      toLocation: 'Majorelle Garden',
      line: 'L8',
      price: 4.0,
      time: daysAgo(2),
      userId: 'user1',
      type: 'bus',
    },
    {
      id: 3,
      fromLocation: 'Marrakesh Train Station',
      toLocation: 'Medina',
      line: 'L16',
      price: 5.0,
      time: daysAgo(3),
      userId: 'user1',
      type: 'bus',
    },
    {
      id: 4,
      fromLocation: 'Marrakesh Station',
      toLocation: 'Casablanca',
      line: 'M1',
      price: 90.0,
      time: daysAgo(4),
      userId: 'user1',
      type: 'train',
    },
    {
      id: 5,
      fromLocation: 'Marrakesh Airport',
      toLocation: 'City Center',
      line: 'L19',
      price: 30.0,
      time: daysAgo(5),
      userId: 'user1',
      type: 'bus',
    },
  ],
  user2: [
    {
      id: 6,
      fromLocation: 'City Center',
      toLocation: 'Agdal',
      line: 'L5',
      price: 4.5,
      time: daysAgo(1),
      userId: 'user2',
      type: 'bus',
    },
    {
      id: 7,
      fromLocation: 'Marrakesh',
      toLocation: 'Rabat',
      line: 'T2',
      price: 120.0,
      time: daysAgo(3),
      userId: 'user2',
      type: 'train',
    },
  ],
  user3: [
    {
      id: 8,
      fromLocation: 'Marrakesh Airport',
      toLocation: 'Jamaa el-Fna',
      line: 'L19',
      price: 30.0,
      time: daysAgo(2),
      userId: 'user3',
      type: 'bus',
    },
  ],
  user4: [
    {
      id: 9,
      fromLocation: 'Gueliz',
      toLocation: 'City Center',
      line: 'L3',
      price: 5.0,
      time: daysAgo(1),
      userId: 'user4',
      type: 'bus',
    },
    {
      id: 10,
      fromLocation: 'Marrakesh',
      toLocation: 'Casablanca',
      line: 'T1',
      price: 90.0,
      time: daysAgo(10),
      userId: 'user4',
      type: 'train',
    },
  ],
  admin: [],
};

// Mock API functions
export const mockApi = {
  getCardInfo(userId: string): Promise<Card> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const card = mockCards[userId];
        if (card) {
          resolve(card);
        } else {
          reject(new Error(`No card found for user: ${userId}`));
        }
      }, 500); // Simulate network delay
    });
  },

  getTrips(userId: string): Promise<Trip[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trips = mockTrips[userId];
        if (trips) {
          resolve(trips);
        } else {
          resolve([]);
        }
      }, 500); // Simulate network delay
    });
  },

  addCredit(request: { userId: string; amount: number }): Promise<Card> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { userId, amount } = request;
        const card = mockCards[userId];
        
        if (card) {
          card.balance += amount;
          resolve({ ...card });
        } else {
          reject(new Error(`No card found for user: ${userId}`));
        }
      }, 800); // Simulate network delay
    });
  },
}; 