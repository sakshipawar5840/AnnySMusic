
export interface Track {
  id: string;
  title: string;
  album: string;
  year: string;
  duration: string;
  coverUrl: string;
  audioUrl?: string; // Optional for demo
}

export interface Video {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string; // YouTube or external link
  views: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  ticketLink: string;
  status: 'upcoming' | 'past';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  icon: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string;
}

export interface HeroImage {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface SocialLink {
  id: string;
  platform: 'Instagram' | 'Twitter' | 'Youtube' | 'Facebook' | 'Spotify' | 'SoundCloud' | 'AppleMusic';
  url: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string; // Message/Request
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reply?: string;
  repliedAt?: string;
}

export interface AdminSettings {
  notificationEmail: string;
  notificationPhone: string;
}

export interface NavLink {
  label: string;
  path: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ContactInfo {
  email: string;
  managementPhone: string;
  location: string;
}

export interface StoryContent {
  bioParagraph1: string;
  bioParagraph2: string;
  bioParagraph3: string;
  statsShows: string;
  statsAwards: string;
  statsReleases: string;
  imageUrl: string;
}
