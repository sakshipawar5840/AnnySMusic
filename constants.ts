import { Track, Video, Event, Achievement, GalleryImage, SocialLink, HeroImage } from './types';

export const MUSIC_DATA: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    album: 'Cyber Heart',
    year: '2024',
    duration: '3:45',
    coverUrl: 'https://picsum.photos/seed/music1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Digital Dreams',
    album: 'Cyber Heart',
    year: '2024',
    duration: '4:12',
    coverUrl: 'https://picsum.photos/seed/music2/400/400',
  },
  {
    id: '3',
    title: 'Bass Drop Protocol',
    album: 'System Failure',
    year: '2023',
    duration: '3:30',
    coverUrl: 'https://picsum.photos/seed/music3/400/400',
  },
  {
    id: '4',
    title: 'Electric Soul',
    album: 'System Failure',
    year: '2023',
    duration: '3:55',
    coverUrl: 'https://picsum.photos/seed/music4/400/400',
  },
];

export const VIDEO_DATA: Video[] = [
  {
    id: '1',
    title: 'Live at Tokyo Dome 2024',
    thumbnailUrl: 'https://picsum.photos/seed/video1/640/360',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: '1.2M',
    date: '2 weeks ago',
  },
  {
    id: '2',
    title: 'Neon Nights (Official Music Video)',
    thumbnailUrl: 'https://picsum.photos/seed/video2/640/360',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: '850K',
    date: '1 month ago',
  },
  {
    id: '3',
    title: 'Behind The Scenes: Cyber Heart',
    thumbnailUrl: 'https://picsum.photos/seed/video3/640/360',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: '300K',
    date: '2 months ago',
  },
];

export const EVENTS_DATA: Event[] = [
  {
    id: '1',
    title: 'Electric Daisy Carnival',
    date: 'OCT 15, 2024',
    time: '20:00',
    venue: 'Las Vegas Motor Speedway',
    location: 'Las Vegas, NV',
    ticketLink: '#',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Ultra Music Festival',
    date: 'NOV 05, 2024',
    time: '21:00',
    venue: 'Bayfront Park',
    location: 'Miami, FL',
    ticketLink: '#',
    status: 'upcoming',
  },
  {
    id: '3',
    title: 'Tomorrowland Winter',
    date: 'DEC 12, 2024',
    time: '18:00',
    venue: 'Alpe d\'Huez',
    location: 'France',
    ticketLink: '#',
    status: 'upcoming',
  },
  {
    id: '4',
    title: 'Coachella Main Stage',
    date: 'APR 15, 2024',
    time: '22:00',
    venue: 'Empire Polo Club',
    location: 'Indio, CA',
    ticketLink: '#',
    status: 'past',
  },
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: '1',
    title: 'Best Electronic Artist',
    description: 'Global Music Awards 2023',
    year: '2023',
    icon: 'award',
  },
  {
    id: '2',
    title: 'Platinum Album',
    description: '1M+ Sales for "System Failure"',
    year: '2023',
    icon: 'disc',
  },
  {
    id: '3',
    title: 'Top 100 DJ List',
    description: 'Ranked #15 Worldwide',
    year: '2024',
    icon: 'star',
  },
];

export const GALLERY_DATA: GalleryImage[] = [
  {
    id: '1',
    imageUrl: 'https://picsum.photos/seed/gallery1/600/600',
    title: 'Studio Session',
  },
  {
    id: '2',
    imageUrl: 'https://picsum.photos/seed/gallery2/600/600',
    title: 'Live in Berlin',
  },
  {
    id: '3',
    imageUrl: 'https://picsum.photos/seed/gallery3/600/600',
    title: 'Crowd Energy',
  },
  {
    id: '4',
    imageUrl: 'https://picsum.photos/seed/gallery4/600/600',
    title: 'Backstage',
  },
];

export const SOCIAL_LINKS_DATA: SocialLink[] = [
  { id: '1', platform: 'Instagram', url: 'https://instagram.com' },
  { id: '2', platform: 'Twitter', url: 'https://twitter.com' },
  { id: '3', platform: 'Youtube', url: 'https://youtube.com' },
  { id: '4', platform: 'Spotify', url: 'https://spotify.com' },
];

export const HERO_SLIDES_DATA: HeroImage[] = [
  { id: '1', imageUrl: 'https://picsum.photos/seed/djhero1/1920/1080', caption: 'Live The Moment' },
  { id: '2', imageUrl: 'https://picsum.photos/seed/djhero2/1920/1080', caption: 'Feel The Bass' },
  { id: '3', imageUrl: 'https://picsum.photos/seed/djhero3/1920/1080', caption: 'Cyberpunk Reality' },
];