// src/lib/mockDb.ts
import sampleDataset from '@/data/sample_dataset.json';
import type {
  QuizResponse,
  Entry,
  Booking,
  AllyoraData,
  UserQuiz,
  ExportedUserData,
} from '@/types';

const STORAGE_KEY = 'allyora_data';
const SEEDED_KEY = 'allyora_seeded';

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
    return { users: [], entries: [], bookings: [] };
  }

  try {
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      // Seed from sample dataset
      const data: AllyoraData = sampleDataset as AllyoraData;
      saveDb(data);
      localStorage.setItem(SEEDED_KEY, 'true');
      return data;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AllyoraData;
      } catch (parseError) {
        console.error('Failed to parse stored data:', parseError);
        // Reset corrupted data
        const defaultData: AllyoraData = { users: [], entries: [], bookings: [] };
        saveDb(defaultData);
        return defaultData;
      }
    }
    
    return { users: [], entries: [], bookings: [] };
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return { users: [], entries: [], bookings: [] };
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
