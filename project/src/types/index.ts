export interface Exhibit {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  year: number;
  category: string;
  technicalDetails?: string;
  historicalContext?: string;
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