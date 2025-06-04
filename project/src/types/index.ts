export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Exhibit {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  year: number;
  category: string;
  technicalDetails?: string;
  historicalContext?: string;
  videoUrl?: string;
  model3dUrl?: string;
}

export interface HistoricalEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface FilterOptions {
  category: string;
  yearFrom: number;
  yearTo: number;
  searchQuery: string;
}

export interface GalleryImage {
  caption: any;
  id: number;
  category: 'factory' | 'museum' | 'archive' | 'history';
  imageUrl: string;
}

export interface Person {
  id: number;
  name: string;
  role: string;
  years: string;
  biography: string;
  achievements: string;
  imageUrl: string;
}