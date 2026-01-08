export interface Track {
  id: string;
  title: string;
  album: string;
  year: string;
  coverUrl: string;
  audioUrl?: string;
  platformLinks: {
    spotify?: string;
    youtube?: string;
    soundcloud?: string;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  location: string;
  status: 'upcoming' | 'past';
  ticketLink?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export interface ArtistProfile {
  name: string;
  tagline: string;
  bio: string;
  email: string; // Booking email
  phone: string; // Contact number
  location?: string; // Artist Location
  achievements: string[];
  socials: {
    instagram: string;
    youtube: string;
    spotify: string;
    apple: string;
    facebook: string;
  };
  heroText: string;
  heroImage: string;
  aboutImage: string; // Image for About Page
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  eventType?: string;
  eventTime?: string;
  message: string;
}

export interface InboxMessage extends ContactSubmission {
  id: string;
  date: string;
  read: boolean;
}

// Initial Data for the "DB"
export const INITIAL_PROFILE: ArtistProfile = {
  name: "AnnySMusic",
  tagline: "Beats That Glow in the Dark",
  bio: "AnnyS is an electronic music producer and DJ hailing from the neon-lit streets of Neo-Tokyo. With a fusion of synth-wave and deep house, she creates soundscapes that transport listeners to another dimension. Her debut album 'Cyber Heart' topped the charts in 2023.",
  email: "Annyshinde43@gmail.com",
  phone: "9518795374",
  location: "Pune, India",
  achievements: [
    "Best Electronic Artist 2023 - Neon Awards",
    "10M+ Streams on Spotify",
    "Headliner at CyberFest 2024"
  ],
  socials: {
    instagram: "https://www.instagram.com/annyremix_org/",
    youtube: "https://m.youtube.com/%40annyremixorgofficial?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid/",
    spotify: "https://spotify.com",
    apple: "https://music.apple.com",
    facebook: "https://facebook.com"
  },
  heroText: "Experience the Future of Sound",
  heroImage: "https://images.unsplash.com/photo-1571266028243-37160d7fbf92?q=80&w=1920&auto=format&fit=crop",
  aboutImage: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop"
};

export const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: "Neon Nights",
    album: "Cyber Heart",
    year: "2023",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
    platformLinks: { spotify: "#", youtube: "#" }
  },
  {
    id: '2',
    title: "Digital Love",
    album: "Cyber Heart",
    year: "2023",
    coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop",
    platformLinks: { spotify: "#", soundcloud: "#" }
  },
  {
    id: '3',
    title: "System Failure",
    album: "Single",
    year: "2024",
    coverUrl: "https://images.unsplash.com/photo-1621360841013-c768371e93cf?w=400&h=400&fit=crop",
    platformLinks: { youtube: "#" }
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: "Neon Garden Festival",
    date: "2024-11-15",
    venue: "The Grand Arena",
    location: "Los Angeles, CA",
    status: 'upcoming',
    ticketLink: "#"
  },
  {
    id: '2',
    title: "Underground Vibes",
    date: "2024-12-01",
    venue: "Club Void",
    location: "New York, NY",
    status: 'upcoming'
  },
  {
    id: '3',
    title: "Summer Bass Drop",
    date: "2023-07-20",
    venue: "Beachside Stage",
    location: "Miami, FL",
    status: 'past'
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // Rick Roll (Known working public video)
  { id: '1', title: "Never Gonna Give You Up", youtubeId: "dQw4w9WgXcQ" },
  // Alan Walker - Faded (Known working public video)
  { id: '2', title: "Alan Walker - Faded", youtubeId: "60ItHLz5WEA" } 
];

export const INITIAL_PHOTOS: Photo[] = [
  { id: '1', url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&fit=crop" },
  { id: '2', url: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&fit=crop" },
  { id: '3', url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&fit=crop" },
  { id: '4', url: "https://images.unsplash.com/photo-1501386761106-e84b72d23298?w=800&fit=crop" }
];

export const INITIAL_MESSAGES: InboxMessage[] = [
    {
        id: '1',
        name: 'Demo Promoter',
        email: 'promoter@example.com',
        phone: '123-456-7890',
        eventType: 'Club Show',
        eventTime: '2024-12-25T22:00',
        message: 'Hey! We would love to book you for a show in Pune next month. Please get back to us.',
        date: new Date().toISOString(),
        read: false
    }
];