// User and Quiz Types
export interface UserQuiz {
  name?: string;
  age?: number;
  birth_year?: number;
  goal?: string[];
  confirmation?: 'yes' | 'no';
  why_not?: string;
  used_apps_before?: 'yes' | 'no';
  track_periods?: 'yes' | 'no';
  period_regular?: 'yes' | 'no';
  caught_by_surprise?: 'yes' | 'no';
  last_period_start?: string;
  cycle_length?: number;
  period_length?: number;
  flow_description?: 'light' | 'medium' | 'heavy';
  pain?: number;
  cramps_before?: 'yes' | 'no';
  mood_swings?: 'yes' | 'no';
  reproductive_conditions?: string[];
  weight_changed?: 'yes' | 'no';
  [key: string]: any; // Allow for additional quiz fields
}

export interface QuizResponse {
  user_id: string;
  quiz: UserQuiz;
  created_at: string;
}

// Entry Types
export type FlowType = 'light' | 'medium' | 'heavy';

export interface Entry {
  id: string;
  user_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  flow: FlowType;
  pain: number; // 0-10
  mood: string[];
  symptoms: string[];
  product: string;
  notes: string;
  created_at: string;
}

// Booking Types
export interface Booking {
  booking_id: string;
  user_id: string;
  reason: string;
  slot: string;
  join_url: string;
  created_at: string;
}

// Prediction Types
export interface Prediction {
  earliest: string; // ISO date string (YYYY-MM-DD)
  latest: string; // ISO date string (YYYY-MM-DD)
  mean: number; // Mean cycle length in days
  sd: number; // Standard deviation in days
  confidence: number; // 0-100
  irregularity: number; // 0-100
  explanation: string;
}

// Database Types
export interface AllyoraData {
  users: QuizResponse[];
  entries: Entry[];
  bookings: Booking[];
}

// LocalStorage Error Types
export class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// Export User Data Type
export interface ExportedUserData {
  user?: QuizResponse;
  entries: Entry[];
  bookings: Booking[];
}
