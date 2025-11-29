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

// Doctor Article Types
export interface DoctorArticle {
  id: string;
  title: string;
  category: "Menstrual Health" | "Sleep" | "Fitness" | "Nutrition";
  readTime: number;
  image: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    credentials: string;
    specialization?: string;
  };
  submittedBy: string; // doctor_id
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  approvedAt?: string;
}

// Database Types
export interface AllyoraData {
  users: QuizResponse[];
  entries: Entry[];
  bookings: Booking[];
  doctorArticles: DoctorArticle[];
  partners: Partner[];
  partnerConnections: PartnerConnection[];
}

// LocalStorage Error Types
export class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// Partner Types
export type PartnerType = 'spouse' | 'family' | 'healthcare' | 'other';

export interface Partner {
  id: string;
  user_id: string; // Owner of the data
  partner_name: string;
  partner_type: PartnerType;
  share_code: string; // Unique code for connection
  permissions: {
    view_entries: boolean;
    view_predictions: boolean;
    view_analytics: boolean;
    view_quiz: boolean;
  };
  connected_at: string;
  last_accessed?: string;
  is_active: boolean;
}

export interface PartnerConnection {
  id: string;
  share_code: string;
  partner_name: string;
  partner_type: PartnerType;
  connected_user_id: string; // User who shared the data (owner)
  viewer_user_id?: string; // User who is viewing the data (optional, for tracking)
  connected_at: string;
  permissions: Partner['permissions'];
}

// Export User Data Type
export interface ExportedUserData {
  user?: QuizResponse;
  entries: Entry[];
  bookings: Booking[];
}
