import React, { createContext, useContext, useState, useEffect } from 'react';
import { Track, Video, Event, Message, GalleryImage, SocialLink, HeroImage, Booking, AdminSettings, ContactInfo, StoryContent, Achievement } from '../types';
import { MUSIC_DATA, VIDEO_DATA, EVENTS_DATA, GALLERY_DATA, SOCIAL_LINKS_DATA, HERO_SLIDES_DATA, ACHIEVEMENTS_DATA } from '../constants';

interface DataContextType {
  tracks: Track[];
  videos: Video[];
  events: Event[];
  messages: Message[];
  gallery: GalleryImage[];
  socialLinks: SocialLink[];
  heroSlides: HeroImage[];
  bookings: Booking[];
  adminSettings: AdminSettings;
  contactInfo: ContactInfo;
  storyContent: StoryContent;
  achievements: Achievement[];
  isAdmin: boolean;
  isLoading: boolean;
  login: (u: string, p: string) => boolean;
  updatePassword: (oldP: string, newP: string) => boolean;
  logout: () => void;
  addTrack: (t: Track) => void;
  deleteTrack: (id: string) => void;
  addVideo: (v: Video) => void;
  deleteVideo: (id: string) => void;
  addEvent: (e: Event) => void;
  deleteEvent: (id: string) => void;
  addGalleryImage: (g: GalleryImage) => void;
  deleteGalleryImage: (id: string) => void;
  addSocialLink: (s: SocialLink) => void;
  deleteSocialLink: (id: string) => void;
  addHeroSlide: (h: HeroImage) => void;
  deleteHeroSlide: (id: string) => void;
  addBooking: (b: Omit<Booking, 'id' | 'date' | 'status'>) => void;
  updateBookingStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  replyToBooking: (id: string, message: string) => void;
  updateAdminSettings: (settings: AdminSettings) => void;
  sendMessage: (m: Omit<Message, 'id' | 'date' | 'read'>) => void;
  deleteMessage: (id: string) => void;
  updateContactInfo: (info: ContactInfo) => void;
  updateStoryContent: (content: StoryContent) => void;
  addAchievement: (a: Achievement) => void;
  deleteAchievement: (id: string) => void;
  resetAllData: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[];
  playTrack: (t: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToPlaylist: (t: Track) => void;
  removeFromPlaylist: (id: string) => void;
  reorderPlaylist: (tracks: Track[]) => void;
  clearPlaylist: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// --- IndexedDB Helpers ---
const DB_NAME = 'AnnyMusicDB';
const STORE_NAME = 'appData';
const DB_VERSION = 2;

const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onblocked = () => {
        console.error("IndexedDB blocked. Please close other tabs.");
        reject(new Error("IndexedDB blocked"));
    };
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const getFromDB = async <T,>(key: string): Promise<T | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("IndexedDB Read Error:", e);
    throw e; // Propagate error to handle it in loadData
  }
};

const saveToDB = async (key: string, value: unknown) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => {
          console.log(`Saved ${key} to DB`);
          resolve(request.result);
      };
      request.onerror = () => {
          console.error(`Error saving ${key}:`, request.error);
          reject(request.error);
      };
    });
  } catch (e) {
    console.error("IndexedDB Write Error:", e);
  }
};

const clearDB = async () => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Initialize with Defaults
  const [tracks, setTracks] = useState<Track[]>(MUSIC_DATA);
  const [videos, setVideos] = useState<Video[]>(VIDEO_DATA);
  const [events, setEvents] = useState<Event[]>(EVENTS_DATA);
  const [gallery, setGallery] = useState<GalleryImage[]>(GALLERY_DATA);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(SOCIAL_LINKS_DATA);
  const [heroSlides, setHeroSlides] = useState<HeroImage[]>(HERO_SLIDES_DATA);
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({ 
    notificationEmail: 'admin@annysmusic.com', 
    notificationPhone: '+1234567890' 
  });

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: 'booking@annysmusic.com',
    managementPhone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA'
  });

  const [storyContent, setStoryContent] = useState<StoryContent>({
    bioParagraph1: "From the underground clubs of Berlin to the main stages of the world's biggest festivals, Anny has carved a unique path in the electronic music landscape.",
    bioParagraph2: "Blending cyberpunk aesthetics with hard-hitting techno rhythms and melodic trance elements, her sound is a journey into the future of sound.",
    bioParagraph3: "\"Music isn't just sound; it's a physical force,\" Anny says. This philosophy drives every beat, every drop, and every performance.",
    statsShows: "500+",
    statsAwards: "12",
    statsReleases: "50",
    imageUrl: "https://picsum.photos/seed/annybio/800/1000"
  });

  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_DATA);

  // Auth States (Keep in LocalStorage for sync access, it's small)
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('anny_admin_session') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('anny_admin_password') || 'Anny@5374';
  });

  // Load Data from IndexedDB on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data from IndexedDB...");
        const [
            dbTracks, dbVideos, dbEvents, dbGallery, dbSocials, dbHero, 
            dbMessages, dbBookings, dbSettings, dbContact, dbStory, dbAchievements
        ] = await Promise.all([
            getFromDB<Track[]>('anny_tracks'),
            getFromDB<Video[]>('anny_videos'),
            getFromDB<Event[]>('anny_events'),
            getFromDB<GalleryImage[]>('anny_gallery'),
            getFromDB<SocialLink[]>('anny_socials'),
            getFromDB<HeroImage[]>('anny_hero'),
            getFromDB<Message[]>('anny_messages'),
            getFromDB<Booking[]>('anny_bookings'),
            getFromDB<AdminSettings>('anny_admin_settings'),
            getFromDB<ContactInfo>('anny_contact_info'),
            getFromDB<StoryContent>('anny_story_content'),
            getFromDB<Achievement[]>('anny_achievements')
        ]);

        if (dbTracks) setTracks(dbTracks);
        if (dbVideos) setVideos(dbVideos);
        if (dbEvents) setEvents(dbEvents);
        if (dbGallery) setGallery(dbGallery);
        if (dbSocials) setSocialLinks(dbSocials);
        if (dbHero) setHeroSlides(dbHero);
        if (dbMessages) setMessages(dbMessages);
        if (dbBookings) setBookings(dbBookings);
        if (dbSettings) setAdminSettings(dbSettings);
        if (dbContact) setContactInfo(dbContact);
        if (dbStory) setStoryContent(dbStory);
        if (dbAchievements) setAchievements(dbAchievements);
        
        console.log("Data loaded successfully");
      } catch (err) {
        console.error("Failed to load data from DB", err);
        setLoadError(true);
        alert("Error loading data. Changes will NOT be saved to prevent overwriting. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save Data to IndexedDB on Change (Only after initial load and if no error)
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_tracks', tracks); }, [tracks, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_videos', videos); }, [videos, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_events', events); }, [events, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_gallery', gallery); }, [gallery, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_socials', socialLinks); }, [socialLinks, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_hero', heroSlides); }, [heroSlides, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_messages', messages); }, [messages, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_bookings', bookings); }, [bookings, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_admin_settings', adminSettings); }, [adminSettings, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_contact_info', contactInfo); }, [contactInfo, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_story_content', storyContent); }, [storyContent, isLoading, loadError]);
  useEffect(() => { if (!isLoading && !loadError) saveToDB('anny_achievements', achievements); }, [achievements, isLoading, loadError]);
  
  // Auth Persistence (LocalStorage)
  useEffect(() => localStorage.setItem('anny_admin_session', String(isAdmin)), [isAdmin]);
  useEffect(() => localStorage.setItem('anny_admin_password', adminPassword), [adminPassword]);

  // Auth Logic
  const login = (u: string, p: string) => {
    if (u === 'Anny' && p === adminPassword) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const updatePassword = (oldP: string, newP: string) => {
    if (oldP === adminPassword) {
      setAdminPassword(newP);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('anny_admin_session');
  };

  const resetAllData = async () => {
    if(window.confirm("Are you sure? This will delete ALL custom data and reset to defaults.")) {
      await clearDB();
      localStorage.clear();
      window.location.reload();
    }
  }

  // CRUD Operations with Functional Updates (prev => ...)
  const addTrack = (t: Track) => setTracks((prev) => [...prev, t]);
  const deleteTrack = (id: string) => setTracks((prev) => prev.filter(t => t.id !== id));

  const addVideo = (v: Video) => setVideos((prev) => [...prev, v]);
  const deleteVideo = (id: string) => setVideos((prev) => prev.filter(v => v.id !== id));

  const addEvent = (e: Event) => setEvents((prev) => [...prev, e]);
  const deleteEvent = (id: string) => setEvents((prev) => prev.filter(e => e.id !== id));

  const addGalleryImage = (g: GalleryImage) => setGallery((prev) => [...prev, g]);
  const deleteGalleryImage = (id: string) => setGallery((prev) => prev.filter(g => g.id !== id));

  const addSocialLink = (s: SocialLink) => setSocialLinks((prev) => [...prev, s]);
  const deleteSocialLink = (id: string) => setSocialLinks((prev) => prev.filter(s => s.id !== id));

  const addHeroSlide = (h: HeroImage) => setHeroSlides((prev) => [...prev, h]);
  const deleteHeroSlide = (id: string) => setHeroSlides((prev) => prev.filter(h => h.id !== id));

  const sendMessage = (m: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage: Message = {
      ...m,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      read: false
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const deleteMessage = (id: string) => setMessages((prev) => prev.filter(m => m.id !== id));

  // Booking Operations
  const addBooking = (b: Omit<Booking, 'id' | 'date' | 'status'>) => {
    const newBooking: Booking = {
      ...b,
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      status: 'Pending'
    };
    setBookings((prev) => [newBooking, ...prev]);
    
    // Simulate Backend Notification
    console.log(`[MOCK EMAIL SENT] To: ${adminSettings.notificationEmail}, Subject: New Booking from ${b.name}`);
  };

  const updateBookingStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setBookings((prev) => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const replyToBooking = (id: string, message: string) => {
    setBookings((prev) => prev.map(b => b.id === id ? { 
      ...b, 
      reply: message, 
      repliedAt: new Date().toLocaleString()
    } : b));

    const booking = bookings.find(b => b.id === id);
    console.log(`[MOCK REPLY SENT] To: ${booking?.email}, Message: ${message}`);
  };

  const updateAdminSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
  };

  const updateContactInfo = (info: ContactInfo) => setContactInfo(info);
  const updateStoryContent = (content: StoryContent) => setStoryContent(content);
  
  const addAchievement = (a: Achievement) => setAchievements((prev) => [...prev, a]);
  const deleteAchievement = (id: string) => setAchievements((prev) => prev.filter(a => a.id !== id));

  // Player State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // If not in playlist, add it? Or just play from library?
    // Let's assume if played directly, it might be separate.
    // But for simplicity, let's keep playlist separate.
  };

  const pauseTrack = () => setIsPlaying(false);
  const resumeTrack = () => setIsPlaying(true);

  const addToPlaylist = (track: Track) => {
    if (!playlist.find(t => t.id === track.id)) {
      setPlaylist(prev => [...prev, track]);
    }
  };

  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(prev => prev.filter(t => t.id !== trackId));
  };

  const reorderPlaylist = (newPlaylist: Track[]) => {
    setPlaylist(newPlaylist);
  };

  const clearPlaylist = () => setPlaylist([]);

  const nextTrack = () => {
    if (!currentTrack) return;
    
    const list = playlist.length > 0 && playlist.find(t => t.id === currentTrack.id) ? playlist : tracks;
    const currentIndex = list.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex < list.length - 1) {
      playTrack(list[currentIndex + 1]);
    } else {
      playTrack(list[0]); // Loop to start
    }
  };

  const prevTrack = () => {
    if (!currentTrack) return;

    const list = playlist.length > 0 && playlist.find(t => t.id === currentTrack.id) ? playlist : tracks;
    const currentIndex = list.findIndex(t => t.id === currentTrack.id);

    if (currentIndex > 0) {
      playTrack(list[currentIndex - 1]);
    } else {
      playTrack(list[list.length - 1]); // Loop to end
    }
  };

  return (
    <DataContext.Provider value={{
      tracks, videos, events, gallery, socialLinks, heroSlides, messages, bookings, adminSettings, 
      contactInfo, storyContent, achievements, isAdmin, isLoading,
      login, logout, updatePassword,
      addTrack, deleteTrack,
      addVideo, deleteVideo,
      addEvent, deleteEvent,
      addGalleryImage, deleteGalleryImage,
      addSocialLink, deleteSocialLink,
      addHeroSlide, deleteHeroSlide,
      addBooking, updateBookingStatus, replyToBooking, updateAdminSettings,
      sendMessage, deleteMessage,
      updateContactInfo, updateStoryContent, addAchievement, deleteAchievement, resetAllData,
      currentTrack, isPlaying, playlist, playTrack, pauseTrack, resumeTrack, nextTrack, prevTrack,
      addToPlaylist, removeFromPlaylist, reorderPlaylist, clearPlaylist
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};