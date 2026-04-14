import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { SocialLink } from '../../types';
import { LayoutDashboard, Music, Video, Calendar, Image, LogOut, Plus, Trash2, Settings, Lock, Upload, Link as LinkIcon, Users, CheckCircle, XCircle, Bell, FileAudio, Book, FileText, Phone, Send, MessageSquare, X, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    tracks, videos, events, gallery, socialLinks, heroSlides, bookings, adminSettings,
    contactInfo, storyContent, achievements, isLoading,
    logout, updatePassword, updateAdminSettings, updateBookingStatus, replyToBooking, updateContactInfo, updateStoryContent,
    deleteTrack, deleteVideo, deleteEvent, deleteGalleryImage, deleteSocialLink, deleteHeroSlide, deleteAchievement,
    addTrack, addVideo, addEvent, addGalleryImage, addSocialLink, addHeroSlide, addAchievement, resetAllData
  } = useData();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'music' | 'videos' | 'events' | 'gallery' | 'story' | 'contact' | 'settings'>('overview');

  // Reply System States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Form States
  const [newTrack, setNewTrack] = useState({ title: '', album: '', year: '', duration: '', coverUrl: '', audioUrl: '' });
  const [newVideo, setNewVideo] = useState({ title: '', thumbnailUrl: '', videoUrl: '', views: '0', date: 'Just now' });
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', venue: '', location: '', ticketLink: '', status: 'upcoming' as const });
  const [newGallery, setNewGallery] = useState({ imageUrl: '', title: '' });
  const [newSocial, setNewSocial] = useState<{ platform: SocialLink['platform'], url: string }>({ platform: 'Instagram', url: '' });
  const [newHero, setNewHero] = useState({ imageUrl: '', caption: '' });
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', year: new Date().getFullYear().toString(), icon: 'award' });
  
  // Edit Form States (Initialized with Context Data)
  const [contactForm, setContactForm] = useState(contactInfo);
  const [storyForm, setStoryForm] = useState(storyContent);
  const [settingsForm, setSettingsForm] = useState(adminSettings);
  
  // Sync state when context changes (e.g. initial load)
  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  useEffect(() => {
    setStoryForm(storyContent);
  }, [storyContent]);

  useEffect(() => {
    setSettingsForm(adminSettings);
  }, [adminSettings]);
  
  // Password Change State
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [passwordMsg, setPasswordMsg] = useState('');

  // File Input Refs
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const trackCoverFileRef = useRef<HTMLInputElement>(null);
  const trackAudioFileRef = useRef<HTMLInputElement>(null);
  const bioImageRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  // Helper to read file as base64 with Size Limit Check
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limit to 10MB (IndexedDB can handle this easily)
      if (file.size > 10 * 1024 * 1024) {
        alert("⚠️ File is too large!\n\nPlease select a file under 10MB.");
        e.target.value = ''; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          callback(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen bg-darkBg flex items-center justify-center">
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-neonCyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h2 className="text-xl text-white font-bold">Loading Admin Data...</h2>
                  <p className="text-gray-500 text-sm mt-2">Syncing with secure database</p>
              </div>
          </div>
      );
  }

  // Reply Handlers
  const openReplyModal = (id: string) => {
    setCurrentBookingId(id);
    const existingBooking = bookings.find(b => b.id === id);
    setReplyText(existingBooking?.reply || `Dear ${existingBooking?.name},\n\nThank you for your inquiry.\n\nBest regards,\nAnnySMusic Team`);
    setReplyModalOpen(true);
  };

  const handleSendReply = () => {
    if (currentBookingId && replyText) {
      replyToBooking(currentBookingId, replyText);
      setReplyModalOpen(false);
      setReplyText('');
      setCurrentBookingId(null);
      alert('Reply sent successfully!');
    }
  };

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault();
    addTrack({ ...newTrack, id: Date.now().toString() });
    setNewTrack({ title: '', album: '', year: '', duration: '', coverUrl: '', audioUrl: '' });
    if(trackCoverFileRef.current) trackCoverFileRef.current.value = '';
    if(trackAudioFileRef.current) trackAudioFileRef.current.value = '';
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate thumbnail from YouTube URL
    let thumb = 'https://picsum.photos/seed/video/640/360';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = newVideo.videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      thumb = `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }

    addVideo({ ...newVideo, thumbnailUrl: thumb, id: Date.now().toString() });
    setNewVideo({ title: '', thumbnailUrl: '', videoUrl: '', views: '0', date: 'Just now' });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({ ...newEvent, id: Date.now().toString() });
    setNewEvent({ title: '', date: '', time: '', venue: '', location: '', ticketLink: '', status: 'upcoming' });
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryImage({ ...newGallery, id: Date.now().toString() });
    setNewGallery({ imageUrl: '', title: '' });
    if(galleryFileRef.current) galleryFileRef.current.value = '';
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    addSocialLink({ ...newSocial, id: Date.now().toString() });
    setNewSocial({ platform: 'Instagram', url: '' });
  };

  const handleAddHero = (e: React.FormEvent) => {
    e.preventDefault();
    addHeroSlide({ ...newHero, id: Date.now().toString() });
    setNewHero({ imageUrl: '', caption: '' });
    if(heroFileRef.current) heroFileRef.current.value = '';
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    addAchievement({ ...newAchievement, id: Date.now().toString() });
    setNewAchievement({ title: '', description: '', year: new Date().getFullYear().toString(), icon: 'award' });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg('New passwords do not match');
      return;
    }
    const success = updatePassword(passwords.old, passwords.new);
    if (success) {
      setPasswordMsg('Password updated successfully');
      setPasswords({ old: '', new: '', confirm: '' });
    } else {
      setPasswordMsg('Incorrect old password');
    }
  };

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminSettings(settingsForm);
    alert('Admin settings updated!');
  };

  const handleContactUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    alert('Public contact info updated!');
  };

  const handleStoryUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoryContent(storyForm);
    alert('Story/Bio content updated!');
  };

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center w-full px-6 py-4 text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-neonCyan/10 text-neonCyan border-r-4 border-neonCyan' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} className="mr-3" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-darkBg flex pt-20">
      {/* Sidebar */}
      <div className="w-64 bg-cardBg border-r border-white/5 fixed h-full left-0 bottom-0 top-20 z-10">
        <div className="py-6 h-full overflow-y-auto">
          <TabButton id="overview" icon={LayoutDashboard} label="Overview" />
          <div className="relative">
            <TabButton id="bookings" icon={Users} label="Booking Requests" />
             {bookings.filter(b => b.status === 'Pending').length > 0 && <span className="absolute right-4 top-4 bg-neonPink text-white text-[10px] px-2 rounded-full">{bookings.filter(b => b.status === 'Pending').length}</span>}
          </div>
          <TabButton id="music" icon={Music} label="Music Tracks" />
          <TabButton id="videos" icon={Video} label="Videos" />
          <TabButton id="events" icon={Calendar} label="Events" />
          <TabButton id="gallery" icon={Image} label="Gallery" />
          <TabButton id="story" icon={FileText} label="Story & Bio" />
          <TabButton id="contact" icon={Phone} label="Contact Info" />
          <TabButton id="settings" icon={Settings} label="Settings" />
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-4 mt-8 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>

          <div className="px-6 mt-auto pt-8 pb-4">
             <div className="flex items-center text-xs text-green-500 bg-green-500/10 px-3 py-2 rounded border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Data Sync Active
             </div>
             <p className="text-[10px] text-gray-600 mt-2 text-center">
                Changes save automatically to secure local database.
             </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 overflow-y-auto pb-24 h-[calc(100vh-80px)]">
        <h2 className="text-3xl font-display font-bold text-white mb-8 capitalize">{activeTab}</h2>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Pending Bookings', count: bookings.filter(b => b.status === 'Pending').length, color: 'text-neonPink' },
              { label: 'Total Tracks', count: tracks.length, color: 'text-neonCyan' },
              { label: 'Total Videos', count: videos.length, color: 'text-purple-400' },
              { label: 'Events', count: events.length, color: 'text-yellow-400' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-cardBg border border-white/5 p-6 rounded-xl">
                <div className="text-gray-400 text-sm uppercase tracking-wider mb-2">{stat.label}</div>
                <div className={`text-4xl font-bold ${stat.color}`}>{stat.count}</div>
              </div>
            ))}
          </div>
        )}

        {/* ... (Existing Tabs: Bookings, Music, Videos, Events, Gallery) ... */}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
             {bookings.length === 0 ? (
               <div className="text-gray-500 bg-cardBg p-8 rounded-xl text-center">No booking requests found.</div>
             ) : (
               <div className="bg-cardBg rounded-xl border border-white/5 overflow-hidden">
                 <table className="w-full text-left text-sm text-gray-400">
                   <thead className="bg-white/5 uppercase font-bold text-gray-200">
                     <tr>
                       <th className="p-4">Name</th>
                       <th className="p-4">Contact</th>
                       <th className="p-4">Details</th>
                       <th className="p-4">Status</th>
                       <th className="p-4">Reply</th>
                       <th className="p-4">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {bookings.map(booking => (
                       <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                         <td className="p-4 font-bold text-white">{booking.name}<br/><span className="text-xs font-normal text-gray-500">{booking.date}</span></td>
                         <td className="p-4">
                           <div className="text-neonCyan">{booking.email}</div>
                           <div>{booking.phone}</div>
                         </td>
                         <td className="p-4 max-w-xs truncate" title={booking.details}>{booking.details}</td>
                         <td className="p-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                             booking.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                             booking.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                             'bg-red-500/20 text-red-500'
                           }`}>
                             {booking.status}
                           </span>
                         </td>
                         <td className="p-4">
                           {booking.reply ? (
                             <div className="flex items-center text-green-400 text-xs">
                               <CheckCircle size={14} className="mr-1"/> Replied
                               <span className="ml-1 text-gray-600">({booking.repliedAt?.split(',')[0]})</span>
                             </div>
                           ) : (
                             <button 
                                onClick={() => openReplyModal(booking.id)}
                                className="text-neonCyan hover:text-white flex items-center text-xs border border-neonCyan/30 px-2 py-1 rounded hover:bg-neonCyan/10 transition-colors"
                             >
                                <MessageSquare size={14} className="mr-1"/> Reply
                             </button>
                           )}
                         </td>
                         <td className="p-4">
                           {booking.status === 'Pending' && (
                             <div className="flex space-x-2">
                               <button 
                                 onClick={() => updateBookingStatus(booking.id, 'Approved')}
                                 className="p-2 bg-green-500/10 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors"
                                 title="Approve"
                               >
                                 <CheckCircle size={18} />
                               </button>
                               <button 
                                 onClick={() => updateBookingStatus(booking.id, 'Rejected')}
                                 className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                                 title="Reject"
                               >
                                 <XCircle size={18} />
                               </button>
                             </div>
                           )}
                           {booking.status !== 'Pending' && (
                             <div className="text-gray-600 text-xs italic">
                               {booking.status}
                             </div>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}
          </div>
        )}

        {activeTab === 'music' && (
          <div>
            <form onSubmit={handleAddTrack} className="bg-cardBg p-6 rounded-xl mb-8 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center"><Plus size={16} className="mr-2"/> Add New Track</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input placeholder="Title" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.title} onChange={e => setNewTrack({...newTrack, title: e.target.value})} />
                <input placeholder="Album" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.album} onChange={e => setNewTrack({...newTrack, album: e.target.value})} />
                <input placeholder="Year" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.year} onChange={e => setNewTrack({...newTrack, year: e.target.value})} />
                <input placeholder="Duration" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.duration} onChange={e => setNewTrack({...newTrack, duration: e.target.value})} />
                
                <div className="relative">
                   <input 
                     type="file" 
                     ref={trackCoverFileRef}
                     accept="image/*"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={(e) => handleFileUpload(e, (url) => setNewTrack({...newTrack, coverUrl: url}))}
                   />
                   <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white truncate flex items-center">
                     <Upload size={14} className="mr-2 text-neonCyan" />
                     {newTrack.coverUrl && newTrack.coverUrl.startsWith('data:') ? 'Image Selected' : 'Select Cover Image'}
                   </div>
                </div>

                <input placeholder="Cover Image URL (Backup)" className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.coverUrl} onChange={e => setNewTrack({...newTrack, coverUrl: e.target.value})} />
                
                <div className="relative">
                   <input 
                     type="file" 
                     ref={trackAudioFileRef}
                     accept="audio/*"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={(e) => handleFileUpload(e, (url) => setNewTrack({...newTrack, audioUrl: url}))}
                   />
                   <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white truncate flex items-center">
                     <FileAudio size={14} className="mr-2 text-neonCyan" />
                     {newTrack.audioUrl && newTrack.audioUrl.startsWith('data:') ? 'Audio File Selected' : 'Select Audio File (MP3)'}
                   </div>
                </div>
                
                <input placeholder="Or Enter Audio URL" className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newTrack.audioUrl} onChange={e => setNewTrack({...newTrack, audioUrl: e.target.value})} />
              </div>
              <button className="mt-4 bg-neonCyan text-black font-bold px-6 py-2 rounded hover:bg-white transition-colors">Add Track</button>
            </form>

            <div className="space-y-4">
              {tracks.map(track => (
                <div key={track.id} className="flex items-center justify-between bg-cardBg p-4 rounded-lg border border-white/5">
                  <div className="flex items-center space-x-4">
                    <img src={track.coverUrl} className="w-12 h-12 rounded object-cover" alt="" />
                    <div>
                      <div className="text-white font-bold">{track.title}</div>
                      <div className="text-gray-500 text-sm">{track.album} • {track.year}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteTrack(track.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <form onSubmit={handleAddVideo} className="bg-cardBg p-6 rounded-xl mb-8 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center"><Plus size={16} className="mr-2"/> Add New Video</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input placeholder="Video Title" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
                <input placeholder="Video URL (YouTube)" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newVideo.videoUrl} onChange={e => setNewVideo({...newVideo, videoUrl: e.target.value})} />
              </div>

              {/* Thumbnail Preview */}
              <div className="mb-4">
                 <label className="block text-sm text-gray-500 mb-2">Thumbnail Preview</label>
                 <div className="w-full md:w-64 aspect-video bg-black/50 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                    {(() => {
                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                        const match = newVideo.videoUrl.match(regExp);
                        const videoId = (match && match[2].length === 11) ? match[2] : null;
                        
                        if (videoId) {
                            return <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} className="w-full h-full object-cover" alt="Preview" />;
                        } else {
                            return (
                                <div className="flex flex-col items-center text-gray-600">
                                    <Video size={24} className="mb-2 opacity-50" />
                                    <span className="text-xs">Enter valid YouTube URL</span>
                                </div>
                            );
                        }
                    })()}
                 </div>
              </div>

              <button className="bg-neonPink text-white font-bold px-6 py-2 rounded hover:bg-neonPink/80 transition-colors">Add Video</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.map(video => (
                <div key={video.id} className="bg-cardBg p-4 rounded-lg border border-white/5">
                   <img src={video.thumbnailUrl} className="w-full h-32 object-cover rounded mb-2" alt=""/>
                   <div className="mb-2">
                     <div className="text-white font-bold text-sm truncate">{video.title}</div>
                     <a href={video.videoUrl} target="_blank" rel="noreferrer" className="text-neonCyan text-xs truncate block hover:underline">{video.videoUrl}</a>
                   </div>
                   <div className="flex justify-end">
                     <button onClick={() => deleteVideo(video.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
             <form onSubmit={handleAddEvent} className="bg-cardBg p-6 rounded-xl mb-8 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center"><Plus size={16} className="mr-2"/> Add New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input placeholder="Event Title" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                <input placeholder="Date (e.g. OCT 15, 2025)" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                <input placeholder="Time" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                <input placeholder="Venue" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} />
                <input placeholder="Location" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
              </div>
              <button className="bg-neonPurple text-white font-bold px-6 py-2 rounded hover:bg-neonPurple/80 transition-colors">Add Event</button>
            </form>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between bg-cardBg p-4 rounded-lg border border-white/5">
                  <div>
                    <div className="text-white font-bold">{event.title}</div>
                    <div className="text-gray-500 text-sm">{event.date} @ {event.venue}</div>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <form onSubmit={handleAddGallery} className="bg-cardBg p-6 rounded-xl mb-8 border border-white/5">
              <h3 className="text-white font-bold mb-4 flex items-center"><Plus size={16} className="mr-2"/> Add Gallery Image</h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex gap-2">
                    <input 
                        placeholder="Image URL" 
                        className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white" 
                        value={newGallery.imageUrl} 
                        onChange={e => setNewGallery({...newGallery, imageUrl: e.target.value})} 
                    />
                    <div className="relative">
                        <input 
                            type="file" 
                            ref={galleryFileRef}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => handleFileUpload(e, (url) => setNewGallery({...newGallery, imageUrl: url}))}
                        />
                        <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded border border-white/10 h-full flex items-center whitespace-nowrap transition-colors">
                            <Upload size={16} className="mr-2" /> Browse
                        </button>
                    </div>
                </div>
                <input placeholder="Caption / Title" required className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value})} />
              </div>
              <button className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition-colors">Add Image</button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map(img => (
                <div key={img.id} className="bg-cardBg p-3 rounded-lg border border-white/5 group relative">
                   <div className="aspect-square overflow-hidden rounded mb-2">
                      <img src={img.imageUrl} className="w-full h-full object-cover" alt={img.title}/>
                   </div>
                   <div className="text-white font-bold text-sm truncate">{img.title}</div>
                   <button onClick={() => deleteGalleryImage(img.id)} className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NEW STORY EDIT TAB --- */}
        {activeTab === 'story' && (
          <div className="space-y-8">
             <div className="bg-cardBg p-6 rounded-xl border border-white/5">
                <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                  <FileText size={20} className="mr-2 text-neonPink" /> Bio & Stats
                </h3>
                <form onSubmit={handleStoryUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Paragraph 1</label>
                        <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.bioParagraph1} onChange={e => setStoryForm({...storyForm, bioParagraph1: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Paragraph 2</label>
                        <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.bioParagraph2} onChange={e => setStoryForm({...storyForm, bioParagraph2: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Paragraph 3</label>
                        <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.bioParagraph3} onChange={e => setStoryForm({...storyForm, bioParagraph3: e.target.value})} />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Bio Image</label>
                        <div className="relative mb-2">
                           <input type="file" ref={bioImageRef} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setStoryForm({...storyForm, imageUrl: url}))} />
                           <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white flex items-center"><Upload size={14} className="mr-2 text-neonCyan" /> {storyForm.imageUrl.startsWith('data:') ? 'New Image Selected' : 'Change Image'}</div>
                        </div>
                        {storyForm.imageUrl && <img src={storyForm.imageUrl} className="w-20 h-20 object-cover rounded" alt="Preview"/>}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                         <div>
                            <label className="block text-sm text-gray-500 mb-1">Shows Count</label>
                            <input className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.statsShows} onChange={e => setStoryForm({...storyForm, statsShows: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-sm text-gray-500 mb-1">Awards Count</label>
                            <input className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.statsAwards} onChange={e => setStoryForm({...storyForm, statsAwards: e.target.value})} />
                         </div>
                         <div>
                            <label className="block text-sm text-gray-500 mb-1">Releases Count</label>
                            <input className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={storyForm.statsReleases} onChange={e => setStoryForm({...storyForm, statsReleases: e.target.value})} />
                         </div>
                      </div>
                    </div>
                  </div>
                  <button className="bg-neonPink text-white font-bold px-6 py-2 rounded hover:bg-neonPink/80 transition-colors">Update Story Content</button>
                </form>
             </div>

             {/* Achievements Section */}
             <div className="bg-cardBg p-6 rounded-xl border border-white/5">
                <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                  <Book size={20} className="mr-2 text-neonCyan" /> Achievements List
                </h3>
                
                <form onSubmit={handleAddAchievement} className="flex flex-col md:flex-row gap-4 mb-6">
                   <input placeholder="Title" required className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newAchievement.title} onChange={e => setNewAchievement({...newAchievement, title: e.target.value})} />
                   <input placeholder="Year" required className="w-24 bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newAchievement.year} onChange={e => setNewAchievement({...newAchievement, year: e.target.value})} />
                   <select className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={newAchievement.icon} onChange={e => setNewAchievement({...newAchievement, icon: e.target.value})}>
                     <option value="award">Award</option>
                     <option value="star">Star</option>
                     <option value="disc">Disc</option>
                     <option value="headphones">Headphones</option>
                   </select>
                   <button className="bg-neonCyan text-black font-bold px-4 py-2 rounded hover:bg-white transition-colors">Add</button>
                </form>
                
                <div className="space-y-2">
                   {achievements.map(a => (
                     <div key={a.id} className="flex justify-between items-center bg-black/30 p-3 rounded border border-white/5">
                        <span className="text-white font-medium flex items-center gap-2">
                           <span className="text-neonCyan font-bold">{a.year}</span>
                           <span>{a.title}</span>
                        </span>
                        <button onClick={() => deleteAchievement(a.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- NEW CONTACT EDIT TAB --- */}
        {activeTab === 'contact' && (
          <div className="bg-cardBg p-6 rounded-xl border border-white/5">
              <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                <Phone size={20} className="mr-2 text-neonPurple" /> Public Contact Information
              </h3>
              <p className="text-gray-500 mb-6 text-sm">Update the contact details displayed on the Contact page.</p>
              
              <form onSubmit={handleContactUpdate} className="space-y-4 max-w-md">
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Public Booking Email</label>
                   <input type="email" required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Management Phone</label>
                   <input type="text" required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={contactForm.managementPhone} onChange={e => setContactForm({...contactForm, managementPhone: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Location</label>
                   <input type="text" required className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white" value={contactForm.location} onChange={e => setContactForm({...contactForm, location: e.target.value})} />
                 </div>
                 <button className="bg-neonPurple text-white font-bold px-6 py-2 rounded hover:bg-neonPurple/80 transition-colors">Update Public Info</button>
              </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* Admin Profile Settings */}
            <div className="bg-cardBg p-6 rounded-xl border border-white/5">
              <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                <Bell size={20} className="mr-2 text-yellow-500" /> Admin Notification Settings
              </h3>
              <form onSubmit={handleSettingsUpdate} className="space-y-4 max-w-md">
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Notification Email</label>
                   <input 
                     type="email" 
                     className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                     value={settingsForm.notificationEmail}
                     onChange={e => setSettingsForm({...settingsForm, notificationEmail: e.target.value})}
                    />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Notification Phone</label>
                   <input 
                     type="tel" 
                     className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                     value={settingsForm.notificationPhone}
                     onChange={e => setSettingsForm({...settingsForm, notificationPhone: e.target.value})}
                    />
                 </div>
                 <button className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-400 transition-colors">Save Settings</button>
              </form>
            </div>

            {/* Social Media Manager */}
            <div className="bg-cardBg p-6 rounded-xl border border-white/5">
              <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                <LinkIcon size={20} className="mr-2 text-neonCyan" /> Social Media Links
              </h3>
              
              <form onSubmit={handleAddSocial} className="flex flex-col md:flex-row gap-4 mb-6">
                 <select 
                   value={newSocial.platform} 
                   onChange={(e) => setNewSocial({...newSocial, platform: e.target.value as SocialLink['platform']})}
                   className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                 >
                   <option value="Instagram">Instagram</option>
                   <option value="Twitter">Twitter</option>
                   <option value="Youtube">Youtube</option>
                   <option value="Facebook">Facebook</option>
                   <option value="Spotify">Spotify</option>
                   <option value="SoundCloud">SoundCloud</option>
                   <option value="AppleMusic">Apple Music</option>
                 </select>
                 <input 
                    placeholder="Profile URL" 
                    required 
                    className="flex-1 bg-black/50 border border-white/10 rounded px-3 py-2 text-white" 
                    value={newSocial.url} 
                    onChange={e => setNewSocial({...newSocial, url: e.target.value})} 
                  />
                 <button className="bg-neonCyan text-black font-bold px-4 py-2 rounded hover:bg-white transition-colors">Add Link</button>
              </form>

              <div className="space-y-2">
                {socialLinks.map(link => (
                  <div key={link.id} className="flex justify-between items-center bg-black/30 p-3 rounded border border-white/5">
                    <span className="text-white font-medium flex items-center">
                      <span className="w-24 text-gray-400">{link.platform}</span>
                      <span className="text-sm truncate max-w-xs">{link.url}</span>
                    </span>
                    <button onClick={() => deleteSocialLink(link.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Slider Manager */}
            <div className="bg-cardBg p-6 rounded-xl border border-white/5">
              <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                <Image size={20} className="mr-2 text-neonPink" /> Home Page Hero Slider (Floating Images)
              </h3>
              
              <form onSubmit={handleAddHero} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                   <input 
                     type="file" 
                     ref={heroFileRef}
                     accept="image/*"
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                     onChange={(e) => handleFileUpload(e, (url) => setNewHero({...newHero, imageUrl: url}))}
                   />
                   <div className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white flex items-center h-full">
                     <Upload size={14} className="mr-2 text-neonPink" />
                     {newHero.imageUrl ? 'Image Selected' : 'Select Hero Image'}
                   </div>
                </div>

                <input 
                   placeholder="Caption (Optional)" 
                   className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white" 
                   value={newHero.caption} 
                   onChange={e => setNewHero({...newHero, caption: e.target.value})} 
                 />
                 <button className="bg-neonPink text-white font-bold px-4 py-2 rounded hover:bg-neonPink/80 transition-colors">Add Slide</button>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {heroSlides.map(slide => (
                  <div key={slide.id} className="relative group aspect-video rounded overflow-hidden border border-white/10">
                    <img src={slide.imageUrl} alt={slide.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteHeroSlide(slide.id)} className="bg-red-500 p-2 rounded-full text-white"><Trash2 size={16} /></button>
                    </div>
                    {slide.caption && <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs p-1 text-center truncate">{slide.caption}</div>}
                  </div>
                ))}
              </div>
            </div>

             {/* Password Change */}
             <div className="bg-cardBg p-6 rounded-xl border border-white/5">
              <h3 className="text-xl text-white font-bold mb-6 flex items-center border-b border-white/10 pb-4">
                <Lock size={20} className="mr-2 text-gray-400" /> Admin Security
              </h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Old Password</label>
                   <input 
                     type="password" 
                     required 
                     className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                     value={passwords.old}
                     onChange={e => setPasswords({...passwords, old: e.target.value})}
                    />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">New Password</label>
                   <input 
                     type="password" 
                     required 
                     className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                     value={passwords.new}
                     onChange={e => setPasswords({...passwords, new: e.target.value})}
                    />
                 </div>
                 <div>
                   <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                   <input 
                     type="password" 
                     required 
                     className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-white"
                     value={passwords.confirm}
                     onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    />
                 </div>
                 
                 {passwordMsg && <p className={`text-sm ${passwordMsg.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>{passwordMsg}</p>}

                 <button className="bg-white/10 text-white font-bold px-6 py-2 rounded hover:bg-white/20 transition-colors">Update Password</button>
              </form>
            </div>
            
            {/* DANGER ZONE - Reset Data */}
            <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20">
              <h3 className="text-xl text-red-500 font-bold mb-6 flex items-center border-b border-red-500/10 pb-4">
                <AlertTriangle size={20} className="mr-2" /> Danger Zone
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                If your storage is full or corrupted, you can reset all data to default values. This cannot be undone.
              </p>
              <button 
                onClick={resetAllData}
                className="bg-red-600 text-white font-bold px-6 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 size={16} className="mr-2" /> Reset All Custom Data
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-cardBg border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-white flex items-center">
                   <Send size={18} className="mr-2 text-neonCyan" /> Send Reply
                 </h3>
                 <button onClick={() => setReplyModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">To</label>
                    <input 
                        type="text" 
                        disabled 
                        value={`${bookings.find(b => b.id === currentBookingId)?.name} <${bookings.find(b => b.id === currentBookingId)?.email}>`}
                        className="w-full bg-black/30 border border-white/5 rounded-lg px-4 py-2 text-gray-300 cursor-not-allowed"
                    />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea 
                    rows={10}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan resize-none"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-3">
                   <button 
                     onClick={() => setReplyModalOpen(false)}
                     className="px-4 py-2 rounded text-gray-300 hover:bg-white/10 transition-colors"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleSendReply}
                     className="px-6 py-2 bg-neonCyan text-black font-bold rounded hover:bg-white transition-colors flex items-center"
                   >
                     <Send size={16} className="mr-2" /> Send Reply
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};