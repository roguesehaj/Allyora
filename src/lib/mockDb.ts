// src/lib/mockDb.ts
import sampleDataset from '@/data/sample_dataset.json';
import { demoDoctorArticles } from '@/data/doctorArticles';
import type {
  QuizResponse,
  Entry,
  Booking,
  AllyoraData,
  UserQuiz,
  ExportedUserData,
  DoctorArticle,
} from '@/types';

const STORAGE_KEY = 'allyora_data';
const SEEDED_KEY = 'allyora_seeded';
const DOCTOR_ARTICLES_SEEDED_KEY = 'allyora_doctor_articles_seeded';

// Check if localStorage is available
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

// Error class for storage errors
export class StorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'StorageError';
  }
}

function initializeDb(): AllyoraData {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available. Using in-memory storage.');
    return { users: [], entries: [], bookings: [], doctorArticles: [] };
  }

  try {
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      // Seed from sample dataset
      const data: AllyoraData = { ...(sampleDataset as AllyoraData), doctorArticles: [] };
      saveDb(data);
      localStorage.setItem(SEEDED_KEY, 'true');
      return data;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AllyoraData;
        // Ensure doctorArticles exists for backward compatibility
        if (!parsed.doctorArticles) {
          parsed.doctorArticles = [];
        }
        
        // Seed demo doctor articles if not already seeded
        const doctorArticlesSeeded = localStorage.getItem(DOCTOR_ARTICLES_SEEDED_KEY);
        if (!doctorArticlesSeeded && parsed.doctorArticles.length === 0) {
          parsed.doctorArticles = [...demoDoctorArticles];
          saveDb(parsed);
          localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
        }
        
        return parsed;
      } catch (parseError) {
        console.error('Failed to parse stored data:', parseError);
        // Reset corrupted data
        const defaultData: AllyoraData = { users: [], entries: [], bookings: [], doctorArticles: [] };
        saveDb(defaultData);
        return defaultData;
      }
    }
    
    // First time initialization - seed demo doctor articles
    const data: AllyoraData = { users: [], entries: [], bookings: [], doctorArticles: [...demoDoctorArticles] };
    saveDb(data);
    localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    return data;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return { users: [], entries: [], bookings: [], doctorArticles: [] };
  }
}

function saveDb(data: AllyoraData): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available. Data not persisted.');
    return;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new StorageError(
        'Storage quota exceeded. Please delete some data or clear your browser storage.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new StorageError(
      `Failed to save data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'SAVE_FAILED'
    );
  }
}

function getData(): AllyoraData {
  return initializeDb();
}

export function createUser(quiz: UserQuiz): QuizResponse {
  try {
    const data = getData();
    const user: QuizResponse = {
      user_id: `user_${Date.now()}`,
      quiz,
      created_at: new Date().toISOString(),
    };
    data.users.push(user);
    saveDb(data);
    return user;
  } catch (error) {
    if (error instanceof StorageError) {
      throw error;
    }
    throw new StorageError(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'CREATE_USER_FAILED'
    );
  }
}

export function getUser(user_id: string): QuizResponse | undefined {
  const data = getData();
  return data.users.find(u => u.user_id === user_id);
}

export function getAllUsers(): QuizResponse[] {
  const data = getData();
  return data.users;
}

export function getEntries(user_id: string): Entry[] {
  const data = getData();
  return data.entries.filter(e => e.user_id === user_id).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function addEntry(user_id: string, entry: Omit<Entry, 'id' | 'user_id' | 'created_at'>): Entry {
  const data = getData();
  const newEntry: Entry = {
    ...entry,
    id: `entry_${Date.now()}`,
    user_id,
    created_at: new Date().toISOString(),
  };
  data.entries.push(newEntry);
  saveDb(data);
  return newEntry;
}

export function editEntry(user_id: string, entry: Entry): Entry {
  const data = getData();
  const index = data.entries.findIndex(e => e.id === entry.id && e.user_id === user_id);
  if (index !== -1) {
    data.entries[index] = { ...entry, user_id };
    saveDb(data);
    return data.entries[index];
  }
  throw new Error('Entry not found');
}

export function deleteEntry(user_id: string, entryId: string): void {
  const data = getData();
  data.entries = data.entries.filter(e => !(e.id === entryId && e.user_id === user_id));
  saveDb(data);
}

export function createBooking(user_id: string, booking: Omit<Booking, 'booking_id' | 'user_id' | 'created_at' | 'join_url'>): Booking {
  const data = getData();
  const randomSuffix = Math.random().toString(36).substring(7);
  const newBooking: Booking = {
    ...booking,
    booking_id: `booking_${Date.now()}`,
    user_id,
    join_url: `https://meet.jit.si/AllyoraDemo_${randomSuffix}`,
    created_at: new Date().toISOString(),
  };
  data.bookings.push(newBooking);
  saveDb(data);
  return newBooking;
}

export function getBookings(user_id: string): Booking[] {
  const data = getData();
  return data.bookings.filter(b => b.user_id === user_id);
}

export function exportUserData(user_id: string): ExportedUserData {
  const data = getData();
  const user = data.users.find(u => u.user_id === user_id);
  const entries = data.entries.filter(e => e.user_id === user_id);
  const bookings = data.bookings.filter(b => b.user_id === user_id);
  return { user, entries, bookings };
}

export function deleteUserData(user_id: string): void {
  const data = getData();
  data.users = data.users.filter(u => u.user_id !== user_id);
  data.entries = data.entries.filter(e => e.user_id !== user_id);
  data.bookings = data.bookings.filter(b => b.user_id !== user_id);
  saveDb(data);
  localStorage.removeItem('allyora_current_user');
}

export function setCurrentUser(user_id: string): void {
  localStorage.setItem('allyora_current_user', user_id);
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('allyora_current_user');
}

export function clearCurrentUser(): void {
  localStorage.removeItem('allyora_current_user');
}

// Doctor Article Functions
export function submitDoctorArticle(doctorId: string, article: Omit<DoctorArticle, 'id' | 'submittedBy' | 'submittedAt' | 'status'>): DoctorArticle {
  const data = getData();
  const newArticle: DoctorArticle = {
    ...article,
    id: `doctor_article_${Date.now()}`,
    submittedBy: doctorId,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  data.doctorArticles.push(newArticle);
  saveDb(data);
  return newArticle;
}

export function getDoctorArticles(status?: 'pending' | 'approved' | 'rejected'): DoctorArticle[] {
  const data = getData();
  if (status) {
    return data.doctorArticles.filter(a => a.status === status);
  }
  return data.doctorArticles;
}

export function getApprovedDoctorArticles(): DoctorArticle[] {
  return getDoctorArticles('approved');
}

export function approveDoctorArticle(articleId: string): DoctorArticle {
  const data = getData();
  const article = data.doctorArticles.find(a => a.id === articleId);
  if (!article) {
    throw new Error('Article not found');
  }
  article.status = 'approved';
  article.approvedAt = new Date().toISOString();
  saveDb(data);
  return article;
}

export function rejectDoctorArticle(articleId: string): void {
  const data = getData();
  const article = data.doctorArticles.find(a => a.id === articleId);
  if (!article) {
    throw new Error('Article not found');
  }
  article.status = 'rejected';
  saveDb(data);
}

// Ensure demo doctor articles are seeded
export function ensureDoctorArticlesSeeded(): void {
  const data = getData();
  const doctorArticlesSeeded = localStorage.getItem(DOCTOR_ARTICLES_SEEDED_KEY);
  
  if (!doctorArticlesSeeded) {
    // Check if any demo articles already exist
    const hasDemoArticles = demoDoctorArticles.some(demo => 
      data.doctorArticles.some(existing => existing.id === demo.id)
    );
    
    if (!hasDemoArticles) {
      data.doctorArticles = [...data.doctorArticles, ...demoDoctorArticles];
      saveDb(data);
      localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    } else {
      localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    }
  }
}
