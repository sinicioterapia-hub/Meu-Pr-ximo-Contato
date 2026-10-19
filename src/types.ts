export interface ProfessionalUser {
  id: string;
  name: string;
  email: string;
  profession?: string;
  password: string; // Stored locally for per-device autonomous workflow
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string; // Foreign key - strict user isolation
  name: string;
  phone: string;
  lastServiceDate: string; // YYYY-MM-DD or empty
  nextContactDate: string; // YYYY-MM-DD
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewFilter = 'priority' | 'overdue' | 'today' | 'upcoming' | 'all';

export interface ContactMetrics {
  total: number;
  overdue: number;
  today: number;
  upcoming: number;
}
