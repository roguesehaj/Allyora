// src/lib/mockDb.ts
import sampleDataset from '@/data/sample_dataset.json';
import { seedDoctorArticles } from '@/data/doctorArticles';
import type {
  QuizResponse,
  Entry,
  Booking,
  AllyoraData,
  UserQuiz,
  ExportedUserData,
  DoctorArticle,
  Partner,
  PartnerConnection,
  PartnerType,
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
    return { users: [], entries: [], bookings: [], doctorArticles: [], partners: [], partnerConnections: [] };
  }

  try {
    const seeded = localStorage.getItem(SEEDED_KEY);
    if (!seeded) {
      // Seed from sample dataset
      const data: AllyoraData = { ...(sampleDataset as AllyoraData), doctorArticles: [], partners: [], partnerConnections: [] };
      saveDb(data);
      localStorage.setItem(SEEDED_KEY, 'true');
      return data;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AllyoraData;
        // Ensure all arrays exist for backward compatibility
        if (!parsed.doctorArticles) parsed.doctorArticles = [];
        if (!parsed.partners) parsed.partners = [];
        if (!parsed.partnerConnections) parsed.partnerConnections = [];
        
        // Seed doctor articles if not already seeded
        const doctorArticlesSeeded = localStorage.getItem(DOCTOR_ARTICLES_SEEDED_KEY);
        if (!doctorArticlesSeeded && parsed.doctorArticles.length === 0) {
          parsed.doctorArticles = [...seedDoctorArticles];
          saveDb(parsed);
          localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
        }
        
        return parsed;
      } catch (parseError) {
        console.error('Failed to parse stored data:', parseError);
        // Reset corrupted data
        const defaultData: AllyoraData = { users: [], entries: [], bookings: [], doctorArticles: [], partners: [], partnerConnections: [] };
        saveDb(defaultData);
        return defaultData;
      }
    }
    
    // First time initialization - seed doctor articles
    const data: AllyoraData = { users: [], entries: [], bookings: [], doctorArticles: [...seedDoctorArticles], partners: [], partnerConnections: [] };
    saveDb(data);
    localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    return data;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return { users: [], entries: [], bookings: [], doctorArticles: [], partners: [], partnerConnections: [] };
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
    join_url: `https://meet.jit.si/Allyora_${randomSuffix}`,
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

// Ensure doctor articles are seeded
export function ensureDoctorArticlesSeeded(): void {
  const data = getData();
  const doctorArticlesSeeded = localStorage.getItem(DOCTOR_ARTICLES_SEEDED_KEY);
  
  if (!doctorArticlesSeeded) {
    // Check if any seed articles already exist
    const hasSeedArticles = seedDoctorArticles.some(seed => 
      data.doctorArticles.some(existing => existing.id === seed.id)
    );
    
    if (!hasSeedArticles) {
      data.doctorArticles = [...data.doctorArticles, ...seedDoctorArticles];
      saveDb(data);
      localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    } else {
      localStorage.setItem(DOCTOR_ARTICLES_SEEDED_KEY, 'true');
    }
  }
}

// Partner Management Functions

// Generate a unique share code
function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a partner share (user shares their data)
export function createPartnerShare(
  userId: string,
  partnerName: string,
  partnerType: PartnerType,
  permissions: Partner['permissions']
): Partner {
  const data = getData();
  
  // Check if share code already exists
  let shareCode = generateShareCode();
  while (data.partners.some(p => p.share_code === shareCode)) {
    shareCode = generateShareCode();
  }
  
  const partner: Partner = {
    id: `partner_${Date.now()}`,
    user_id: userId,
    partner_name: partnerName,
    partner_type: partnerType,
    share_code: shareCode,
    permissions,
    connected_at: new Date().toISOString(),
    is_active: true,
  };
  
  data.partners.push(partner);
  saveDb(data);
  return partner;
}

// Get all partners for a user (people they've shared with)
export function getUserPartners(userId: string): Partner[] {
  const data = getData();
  return data.partners.filter(p => p.user_id === userId && p.is_active);
}

// Connect to a partner using share code (someone connects to view your data)
export function connectToPartner(
  shareCode: string,
  partnerName: string,
  partnerType: PartnerType,
  viewerUserId?: string
): PartnerConnection {
  const data = getData();
  
  // Find the partner share
  const partner = data.partners.find(p => p.share_code === shareCode && p.is_active);
  if (!partner) {
    throw new Error('Invalid share code');
  }
  
  // Check if already connected by this viewer
  const existing = data.partnerConnections.find(
    pc => pc.share_code === shareCode && 
          (viewerUserId ? pc.viewer_user_id === viewerUserId : pc.partner_name === partnerName)
  );
  if (existing) {
    return existing;
  }
  
  const connection: PartnerConnection = {
    id: `connection_${Date.now()}`,
    share_code: shareCode,
    partner_name: partnerName,
    partner_type: partnerType,
    connected_user_id: partner.user_id,
    viewer_user_id: viewerUserId,
    connected_at: new Date().toISOString(),
    permissions: partner.permissions,
  };
  
  data.partnerConnections.push(connection);
  saveDb(data);
  
  // Update partner last accessed
  partner.last_accessed = new Date().toISOString();
  saveDb(data);
  
  return connection;
}

// Get partner connections
// If userId provided: returns connections where this user shared their data (people viewing your data)
// If no userId: returns all connections
// Use getViewerConnections to get connections where current user is viewing someone else's data
export function getPartnerConnections(userId?: string): PartnerConnection[] {
  const data = getData();
  if (userId) {
    return data.partnerConnections.filter(pc => pc.connected_user_id === userId);
  }
  return data.partnerConnections;
}

// Get connections where current user is viewing someone else's data
export function getViewerConnections(viewerUserId: string): PartnerConnection[] {
  const data = getData();
  return data.partnerConnections.filter(pc => pc.viewer_user_id === viewerUserId);
}

// Get a specific partner connection by ID
export function getPartnerConnection(connectionId: string): PartnerConnection | null {
  const data = getData();
  return data.partnerConnections.find(pc => pc.id === connectionId) || null;
}

// Revoke a partner share
export function revokePartnerShare(userId: string, partnerId: string): void {
  const data = getData();
  const partner = data.partners.find(p => p.id === partnerId && p.user_id === userId);
  if (!partner) {
    throw new Error('Partner not found');
  }
  
  partner.is_active = false;
  
  // Remove all connections using this share code
  data.partnerConnections = data.partnerConnections.filter(
    pc => pc.share_code !== partner.share_code
  );
  
  saveDb(data);
}

// Remove a partner connection (disconnect from someone's data)
export function removePartnerConnection(connectionId: string): void {
  const data = getData();
  data.partnerConnections = data.partnerConnections.filter(pc => pc.id !== connectionId);
  saveDb(data);
}

// Get shared user data for a partner connection
export function getSharedUserData(connectionId: string): { data: ExportedUserData; connection: PartnerConnection } | null {
  const data = getData();
  const connection = data.partnerConnections.find(pc => pc.id === connectionId);
  if (!connection) {
    return null;
  }
  
  const user = data.users.find(u => u.user_id === connection.connected_user_id);
  if (!user) {
    return null;
  }
  
  const sharedData: ExportedUserData = {
    user: connection.permissions.view_quiz ? user : undefined,
    entries: connection.permissions.view_entries 
      ? data.entries.filter(e => e.user_id === connection.connected_user_id)
      : [],
    bookings: [], // Bookings are not shared
  };
  
  return { data: sharedData, connection };
}

// Update partner permissions
export function updatePartnerPermissions(
  userId: string,
  partnerId: string,
  permissions: Partner['permissions']
): Partner {
  const data = getData();
  const partner = data.partners.find(p => p.id === partnerId && p.user_id === userId);
  if (!partner) {
    throw new Error('Partner not found');
  }
  
  partner.permissions = permissions;
  
  // Update all connections with this share code
  data.partnerConnections.forEach(pc => {
    if (pc.share_code === partner.share_code) {
      pc.permissions = permissions;
    }
  });
  
  saveDb(data);
  return partner;
}
