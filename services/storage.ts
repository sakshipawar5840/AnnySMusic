import { 
  ArtistProfile, Track, Event, Video, Photo, InboxMessage, ContactSubmission,
  INITIAL_PROFILE, INITIAL_TRACKS, INITIAL_EVENTS, INITIAL_VIDEOS, INITIAL_PHOTOS, INITIAL_MESSAGES 
} from '../types';

// Keys for LocalStorage
const KEYS = {
  PROFILE: 'anny_profile',
  TRACKS: 'anny_tracks',
  EVENTS: 'anny_events',
  VIDEOS: 'anny_videos',
  PHOTOS: 'anny_photos',
  MESSAGES: 'anny_messages',
  AUTH: 'anny_auth',
  ADMIN_CREDS: 'anny_admin_creds'
};

const DEFAULT_CREDS = {
  username: 'AnnySMusic',
  password: 'AnnySMusic@5374'
};

// Helper to simulate delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const StorageService = {
  // Generic safe save
  save: (key: string, data: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("LocalStorage Save Error (Quota Exceeded?):", error);
      return false;
    }
  },

  // Generic safe get
  get: (key: string, initial: any): any => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : initial;
    } catch (e) {
        console.warn(`Error parsing data for ${key}, resetting to default.`);
        return initial;
    }
  },

  // Profile
  getProfile: (): ArtistProfile => {
    // Get stored profile or null. We don't pass INITIAL_PROFILE as default here 
    // because we want to distinguish between "no data" and "partial data".
    const stored = StorageService.get(KEYS.PROFILE, null);
    
    if (!stored) {
        return INITIAL_PROFILE;
    }
    
    // Merge stored data with INITIAL_PROFILE to ensure all fields (like heroImage) exist
    // if the stored object is incomplete.
    return { ...INITIAL_PROFILE, ...stored };
  },
  saveProfile: (profile: ArtistProfile) => {
    return StorageService.save(KEYS.PROFILE, profile);
  },

  // Tracks
  getTracks: (): Track[] => {
    return StorageService.get(KEYS.TRACKS, INITIAL_TRACKS);
  },
  saveTracks: (tracks: Track[]) => {
    return StorageService.save(KEYS.TRACKS, tracks);
  },

  // Events
  getEvents: (): Event[] => {
    return StorageService.get(KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvents: (events: Event[]) => {
    return StorageService.save(KEYS.EVENTS, events);
  },

  // Videos
  getVideos: (): Video[] => {
    return StorageService.get(KEYS.VIDEOS, INITIAL_VIDEOS);
  },
  saveVideos: (videos: Video[]) => {
    return StorageService.save(KEYS.VIDEOS, videos);
  },

  // Photos
  getPhotos: (): Photo[] => {
    return StorageService.get(KEYS.PHOTOS, INITIAL_PHOTOS);
  },
  savePhotos: (photos: Photo[]) => {
    return StorageService.save(KEYS.PHOTOS, photos);
  },

  // Messages (Inbox)
  getMessages: (): InboxMessage[] => {
    return StorageService.get(KEYS.MESSAGES, INITIAL_MESSAGES);
  },
  saveMessages: (messages: InboxMessage[]) => {
    return StorageService.save(KEYS.MESSAGES, messages);
  },

  // Credentials
  getCredentials: () => {
    return StorageService.get(KEYS.ADMIN_CREDS, DEFAULT_CREDS);
  },
  saveCredentials: (creds: any) => {
    return StorageService.save(KEYS.ADMIN_CREDS, creds);
  },

  // Simulated Auth
  login: async (username: string, password: string): Promise<boolean> => {
    await delay(800); // Fake network delay
    const creds = StorageService.get(KEYS.ADMIN_CREDS, DEFAULT_CREDS);
    
    if (username === creds.username && password === creds.password) {
      localStorage.setItem(KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem(KEYS.AUTH);
  },
  isAuthenticated: (): boolean => {
    return localStorage.getItem(KEYS.AUTH) === 'true';
  },

  // Reset Data
  clearAll: () => {
    localStorage.removeItem(KEYS.PROFILE);
    localStorage.removeItem(KEYS.TRACKS);
    localStorage.removeItem(KEYS.EVENTS);
    localStorage.removeItem(KEYS.VIDEOS);
    localStorage.removeItem(KEYS.PHOTOS);
    localStorage.removeItem(KEYS.MESSAGES);
    // Note: We intentionally don't clear ADMIN_CREDS on general reset to prevent lockout
    window.location.reload();
  },

  // Store Booking Message to Inbox
  sendBookingEmail: async (data: ContactSubmission): Promise<boolean> => {
    await delay(1000); // Simulate network
    
    // Retrieve existing messages
    const currentMessages = StorageService.getMessages();
    
    // Create new message object
    const newMessage: InboxMessage = {
        ...data,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        read: false
    };
    
    // Save to storage (prepend to list)
    StorageService.saveMessages([newMessage, ...currentMessages]);
    
    console.log("Booking Request Saved to Admin Inbox:", newMessage);
    return true; 
  }
};