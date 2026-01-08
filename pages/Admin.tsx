import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Music, Calendar, Image as ImageIcon, Video, User, 
  Settings, LogOut, Plus, Trash2, Save, Upload, RefreshCw, Share2, Lock, 
  MessageSquare, Mail, Phone as PhoneIcon, Clock, Reply, FileText, FileAudio
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { Track, Event, Video as VideoType, Photo, ArtistProfile, InboxMessage } from '../types';

// Helper for file uploads (Base64 for LocalStorage demo)
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 800000) { // Limit to ~800KB for localStorage safety
             alert("Image too large! Please upload images under 800KB for this demo.");
             return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                onSuccess(reader.result);
            }
        };
        reader.readAsDataURL(file);
    }
};

// Subcomponents for each tab
const DashboardTab = () => <div className="p-4 text-gray-400">Select a category from the sidebar to manage content.</div>;

// --- INBOX MANAGER ---
const InboxManager = () => {
    const [messages, setMessages] = useState<InboxMessage[]>(StorageService.getMessages());

    const deleteMessage = (id: string) => {
        if(confirm("Are you sure you want to delete this message?")) {
            const newMessages = messages.filter(m => m.id !== id);
            setMessages(newMessages);
            StorageService.saveMessages(newMessages);
        }
    }

    const handleReply = (msg: InboxMessage) => {
        const subject = `Re: Booking Request - ${msg.name}`;
        let body = `Hi ${msg.name},\n\nThank you for reaching out regarding your booking request:\n\n`;
        
        if (msg.eventType) body += `Event Type: ${msg.eventType}\n`;
        if (msg.eventTime) body += `Date/Time: ${new Date(msg.eventTime).toLocaleString()}\n`;
        
        body += `Message: "${msg.message}"\n\n[Write your response here]\n\nBest regards,\nAnnySMusic Team`;
        
        // Open default email client with pre-filled data
        window.open(`mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="text-pink-500" /> Inbox
                    <span className="text-sm bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{messages.length}</span>
                </h2>
                <button 
                    onClick={() => { if(confirm("Clear all messages?")) { setMessages([]); StorageService.saveMessages([]); } }} 
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                >
                    <Trash2 size={14}/> Clear All
                </button>
            </div>

            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800 text-gray-500">
                        No new messages.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-pink-500/30 transition-colors">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-gray-700 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{msg.name}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><Mail size={14} className="text-cyan-400"/> {msg.email}</span>
                                        {msg.phone && <span className="flex items-center gap-1"><PhoneIcon size={14} className="text-green-400"/> {msg.phone}</span>}
                                        {msg.eventType && <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded text-pink-300"><Music size={12}/> {msg.eventType}</span>}
                                        {msg.eventTime && <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded text-yellow-300"><Calendar size={12}/> {new Date(msg.eventTime).toLocaleString()}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1 hidden md:flex"><Clock size={14}/> {new Date(msg.date).toLocaleDateString()}</span>
                                    
                                    <button 
                                        onClick={() => handleReply(msg)} 
                                        className="text-cyan-400 hover:text-cyan-300 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-2 transition-colors"
                                        title="Reply via Email"
                                    >
                                        <Reply size={16}/> <span className="hidden sm:inline">Reply</span>
                                    </button>

                                    <button 
                                        onClick={() => deleteMessage(msg.id)} 
                                        className="text-red-500 hover:text-red-400 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                            <div className="text-gray-300 whitespace-pre-wrap bg-gray-900/50 p-4 rounded border border-gray-800">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- TRACKS MANAGER ---
const TracksManager = () => {
  const [tracks, setTracks] = useState<Track[]>(StorageService.getTracks());
  const [newTrack, setNewTrack] = useState<Partial<Track>>({});
  const [newTrackCover, setNewTrackCover] = useState<string>('');

  const save = () => {
    if (StorageService.saveTracks(tracks)) {
        alert('Tracks saved successfully!');
    } else {
        alert('Error saving tracks! You may have exceeded the storage limit. Try removing some items or using smaller images.');
    }
  };

  const addTrack = () => {
    const id = Date.now().toString();
    const trackToAdd = { 
      id, 
      title: newTrack.title || 'Unknown Track', 
      album: newTrack.album || 'Single', 
      year: newTrack.year || new Date().getFullYear().toString(), 
      coverUrl: newTrackCover || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop', 
      platformLinks: { spotify: '#', youtube: '#' }, 
      ...newTrack 
    } as Track;
    setTracks([...tracks, trackToAdd]);
    setNewTrack({});
    setNewTrackCover('');
  };

  const deleteTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const updateTrackCover = (idx: number, base64: string) => {
      const newTracks = [...tracks];
      newTracks[idx].coverUrl = base64;
      setTracks(newTracks);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Auto-set title from filename (remove extension)
          const name = file.name.replace(/\.[^/.]+$/, "");
          
          if (file.size > 2500000) { // 2.5MB check for localStorage safety
              alert("File is too large for this demo storage! We will use the filename as the title, but the audio won't be saved to prevent crashing.");
              setNewTrack({ ...newTrack, title: name });
          } else {
              const reader = new FileReader();
              reader.onloadend = () => {
                  setNewTrack({ 
                      ...newTrack, 
                      title: name,
                      audioUrl: reader.result as string 
                  });
              };
              reader.readAsDataURL(file);
          }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Music</h2>
        <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save Changes</button>
      </div>

      <div className="grid gap-4">
        {tracks.map((track, idx) => (
          <div key={track.id} className="bg-gray-800 p-4 rounded flex items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
                <div className="relative group w-12 h-12 flex-shrink-0">
                    <img src={track.coverUrl} className="w-12 h-12 rounded bg-gray-700 object-cover" alt="cover"/>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded cursor-pointer transition-opacity">
                         <Upload size={12} className="text-white"/>
                         <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => updateTrackCover(idx, url))}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                         />
                    </div>
                </div>
                <div className="flex-1">
                    <input 
                        value={track.title} 
                        autoComplete="off"
                        onChange={(e) => {
                            const newTracks = [...tracks];
                            newTracks[idx].title = e.target.value;
                            setTracks(newTracks);
                        }}
                        className="bg-transparent text-white font-bold border-b border-transparent focus:border-cyan-400 outline-none w-full"
                    />
                     <div className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                        <input 
                            value={track.album}
                            autoComplete="off"
                            onChange={(e) => {
                                const newTracks = [...tracks];
                                newTracks[idx].album = e.target.value;
                                setTracks(newTracks);
                            }}
                            className="bg-transparent border-b border-transparent focus:border-cyan-400 outline-none w-24"
                        />
                         • 
                         <input 
                            value={track.year}
                            autoComplete="off"
                            onChange={(e) => {
                                const newTracks = [...tracks];
                                newTracks[idx].year = e.target.value;
                                setTracks(newTracks);
                            }}
                            className="bg-transparent border-b border-transparent focus:border-cyan-400 outline-none w-12"
                        />
                     </div>
                </div>
            </div>
            <button onClick={() => deleteTrack(track.id)} className="text-red-500 hover:text-red-400 ml-4"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-700 p-4 rounded space-y-4">
        <h3 className="text-white font-bold flex items-center gap-2"><Plus size={18}/> Add New Track</h3>
        <div className="flex flex-col md:flex-row gap-4 items-start">
             {/* Cover Upload */}
             <div className="w-24 h-24 bg-gray-800 rounded flex-shrink-0 relative overflow-hidden border border-gray-700 group">
                 {newTrackCover ? (
                     <img src={newTrackCover} className="w-full h-full object-cover" alt="New Cover" />
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-gray-500 text-xs text-center p-1">
                        <Upload size={16} className="mb-1"/>
                        <span>Upload Cover</span>
                     </div>
                 )}
                 <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, setNewTrackCover)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                 />
            </div>
            
            {/* Inputs */}
            <div className="flex-1 w-full grid gap-2">
                 {/* REPLACED Title Input with Audio Browser */}
                 <div className="relative">
                    <input 
                        type="file" 
                        accept="audio/*"
                        id="audio-upload-input"
                        className="hidden"
                        onChange={handleAudioUpload}
                    />
                    <label 
                        htmlFor="audio-upload-input" 
                        className={`w-full flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${newTrack.title ? 'bg-gray-800 border-cyan-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
                    >
                        <FileAudio size={20} className={newTrack.title ? "text-cyan-400" : "text-gray-400"} />
                        <span className={`font-bold ${newTrack.title ? 'text-white' : 'text-gray-400'}`}>
                            {newTrack.title || "Browse Audio File (MP3/WAV)"}
                        </span>
                        {newTrack.title && <span className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Selected</span>}
                    </label>
                 </div>

                 <div className="flex gap-2">
                     <input 
                        placeholder="Album" 
                        value={newTrack.album || ''} 
                        autoComplete="off"
                        onChange={e => setNewTrack({...newTrack, album: e.target.value})}
                        className="flex-1 bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                    />
                    <input 
                        placeholder="Year" 
                        value={newTrack.year || ''} 
                        autoComplete="off"
                        onChange={e => setNewTrack({...newTrack, year: e.target.value})}
                        className="w-24 bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                    />
                 </div>
                 <button onClick={addTrack} className="bg-cyan-600 text-white py-2 rounded hover:bg-cyan-500 transition-colors w-full md:w-auto self-start px-6 font-bold mt-2">
                    Add Track
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- EVENTS MANAGER ---
const EventsManager = () => {
    const [events, setEvents] = useState<Event[]>(StorageService.getEvents());

    const save = () => {
        if (StorageService.saveEvents(events)) {
            alert('Events saved successfully!');
        } else {
            alert('Error saving events.');
        }
    };

    const addEvent = () => {
        const newEvent: Event = {
            id: Date.now().toString(),
            title: "New Event",
            date: new Date().toISOString().split('T')[0],
            venue: "TBA",
            location: "TBA",
            status: 'upcoming'
        };
        setEvents([...events, newEvent]);
    };

    const updateEvent = (idx: number, field: keyof Event, value: string) => {
        const newEvents = [...events];
        (newEvents[idx] as any)[field] = value;
        setEvents(newEvents);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Manage Events</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save Changes</button>
            </div>
            <div className="grid gap-4">
                {events.map((evt, idx) => (
                    <div key={evt.id} className="bg-gray-800 p-4 rounded space-y-2 relative">
                        <button onClick={() => setEvents(events.filter(e => e.id !== evt.id))} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input value={evt.title} onChange={e => updateEvent(idx, 'title', e.target.value)} className="bg-gray-700 p-2 rounded text-white w-full border border-transparent focus:border-cyan-400 outline-none" placeholder="Title" />
                            <input type="date" value={evt.date} onChange={e => updateEvent(idx, 'date', e.target.value)} className="bg-gray-700 p-2 rounded text-white w-full border border-transparent focus:border-cyan-400 outline-none" />
                            <input value={evt.venue} onChange={e => updateEvent(idx, 'venue', e.target.value)} className="bg-gray-700 p-2 rounded text-white w-full border border-transparent focus:border-cyan-400 outline-none" placeholder="Venue" />
                            <input value={evt.location} onChange={e => updateEvent(idx, 'location', e.target.value)} className="bg-gray-700 p-2 rounded text-white w-full border border-transparent focus:border-cyan-400 outline-none" placeholder="Location" />
                            <select value={evt.status} onChange={e => updateEvent(idx, 'status', e.target.value)} className="bg-gray-700 p-2 rounded text-white border border-transparent focus:border-cyan-400 outline-none">
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={addEvent} className="w-full py-3 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-cyan-400 rounded transition-colors">+ Add Event</button>
        </div>
    )
}

// --- GALLERY MANAGER ---
const GalleryManager = () => {
    const [photos, setPhotos] = useState<Photo[]>(StorageService.getPhotos());
    const [newPhoto, setNewPhoto] = useState<Partial<Photo>>({});

    const save = () => {
        if (StorageService.savePhotos(photos)) {
            alert('Gallery saved successfully!');
        } else {
            alert('Error saving gallery! Images might be too large.');
        }
    };

    const addPhoto = () => {
        if (!newPhoto.url) return;
        const photoToAdd: Photo = {
            id: Date.now().toString(),
            url: newPhoto.url,
            caption: newPhoto.caption || ''
        };
        setPhotos([...photos, photoToAdd]);
        setNewPhoto({});
    };

    const deletePhoto = (id: string) => {
        setPhotos(photos.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Manage Gallery</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save Changes</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <div key={photo.id} className="relative group bg-gray-800 rounded overflow-hidden">
                        <img src={photo.url} alt={photo.caption} className="w-full h-32 object-cover" />
                        <button onClick={() => deletePhoto(photo.id)} className="absolute top-2 right-2 bg-red-600 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                        <div className="p-2">
                             <input 
                                value={photo.caption || ''} 
                                onChange={(e) => {
                                    const newPhotos = photos.map(p => p.id === photo.id ? {...p, caption: e.target.value} : p);
                                    setPhotos(newPhotos);
                                }}
                                placeholder="Caption"
                                className="w-full bg-transparent text-sm text-gray-300 border-b border-transparent focus:border-cyan-400 outline-none"
                            />
                        </div>
                    </div>
                ))}
            </div>

             <div className="bg-gray-900 border border-gray-700 p-4 rounded space-y-4">
                <h3 className="text-white font-bold">Add New Photo</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    {/* File Browser Input */}
                    <div className="flex-1 w-full space-y-2">
                         <label className="text-sm text-gray-400">Select Image</label>
                         <div className="relative flex items-center gap-2">
                             <div className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-gray-400 truncate">
                                 {newPhoto.url ? "Image Selected" : "No file chosen"}
                             </div>
                             <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (url) => setNewPhoto({...newPhoto, url: url}))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                             />
                             <div className="px-4 py-2 bg-gray-700 text-white text-sm rounded pointer-events-none">Browse</div>
                         </div>
                    </div>
                    
                    {/* Preview Thumbnail */}
                    {newPhoto.url && (
                        <div className="h-16 w-16 bg-gray-800 rounded overflow-hidden border border-gray-600 flex-shrink-0">
                            <img src={newPhoto.url} className="w-full h-full object-cover" alt="Preview"/>
                        </div>
                    )}

                     <input 
                        value={newPhoto.caption || ''} 
                        onChange={e => setNewPhoto({...newPhoto, caption: e.target.value})}
                        placeholder="Caption (Optional)"
                        className="flex-1 bg-gray-800 p-2.5 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none h-[42px]"
                    />
                    <button onClick={addPhoto} className="bg-cyan-600 px-6 py-2 rounded text-white hover:bg-cyan-500 font-bold h-[42px]">Add</button>
                </div>
            </div>
        </div>
    );
};

// --- VIDEOS MANAGER ---
const VideosManager = () => {
    const [videos, setVideos] = useState<VideoType[]>(StorageService.getVideos());
    const [newVideo, setNewVideo] = useState<Partial<VideoType>>({});

    const save = () => {
        if (StorageService.saveVideos(videos)) {
            alert('Videos saved successfully!');
        } else {
            alert('Error saving videos.');
        }
    };

    // Auto extract ID from full URL
    const extractYoutubeId = (url: string) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const addVideo = () => {
        if (!newVideo.title || !newVideo.youtubeId) return;
        
        // Clean up URL to ID if needed
        const extractedId = extractYoutubeId(newVideo.youtubeId);

        const videoToAdd: VideoType = {
            id: Date.now().toString(),
            title: newVideo.title,
            youtubeId: extractedId
        };
        setVideos([...videos, videoToAdd]);
        setNewVideo({});
    };

     const deleteVideo = (id: string) => {
        setVideos(videos.filter(v => v.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Manage Videos</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save Changes</button>
            </div>

            <div className="space-y-4">
                {videos.map((video) => (
                    <div key={video.id} className="bg-gray-800 p-4 rounded flex flex-col md:flex-row items-center justify-between gap-4">
                         <div className="w-full md:w-32 h-20 bg-black flex-shrink-0 relative overflow-hidden rounded">
                            <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} className="w-full h-full object-cover opacity-70" alt="thumb"/>
                        </div>
                        <div className="flex-1 w-full">
                            <input 
                                value={video.title} 
                                onChange={(e) => {
                                     const newVideos = videos.map(v => v.id === video.id ? {...v, title: e.target.value} : v);
                                     setVideos(newVideos);
                                }}
                                className="w-full bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-cyan-400 outline-none mb-1"
                            />
                            <div className="flex items-center text-gray-400 text-sm gap-2">
                                <span className="whitespace-nowrap">ID:</span>
                                <input 
                                    value={video.youtubeId}
                                     onChange={(e) => {
                                         const newVideos = videos.map(v => v.id === video.id ? {...v, youtubeId: e.target.value} : v);
                                         setVideos(newVideos);
                                    }}
                                    className="bg-transparent border-b border-transparent focus:border-cyan-400 outline-none w-full md:w-32"
                                />
                            </div>
                        </div>
                        <button onClick={() => deleteVideo(video.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 size={20}/></button>
                    </div>
                ))}
            </div>

             <div className="bg-gray-900 border border-gray-700 p-4 rounded space-y-4">
                <h3 className="text-white font-bold">Add New Video</h3>
                <div className="flex flex-col md:flex-row gap-2">
                    <input 
                        value={newVideo.title || ''} 
                        onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                        placeholder="Video Title"
                        className="flex-1 bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                    />
                     <input 
                        value={newVideo.youtubeId || ''} 
                        onChange={e => setNewVideo({...newVideo, youtubeId: e.target.value})}
                        placeholder="YouTube ID or URL (e.g. dQw4w9WgXcQ)"
                        className="w-full md:w-48 bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                    />
                    <button onClick={addVideo} className="bg-cyan-600 px-4 py-2 rounded text-white hover:bg-cyan-500">Add</button>
                </div>
            </div>
        </div>
    );
}

// --- SOCIALS MANAGER ---
const SocialsManager = () => {
    const [profile, setProfile] = useState<ArtistProfile>(StorageService.getProfile());

    const save = () => {
        if (StorageService.saveProfile(profile)) {
            alert('Social Links Updated Successfully');
        } else {
            alert('Error saving social links.');
        }
    }

    const handleSocialChange = (platform: keyof typeof profile.socials, value: string) => {
        setProfile({
            ...profile,
            socials: {
                ...profile.socials,
                [platform]: value
            }
        });
    }

    return (
        <div className="space-y-6 max-w-2xl">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Manage Social Links (Follow Me)</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save</button>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg space-y-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-4">Update the links that appear in the Footer and Contact pages.</p>
                
                <div>
                    <label className="block text-gray-400 text-sm mb-1">Instagram URL</label>
                    <input 
                        value={profile.socials.instagram} 
                        onChange={e => handleSocialChange('instagram', e.target.value)} 
                        className="w-full bg-gray-900 p-2 rounded text-white border border-gray-700 focus:border-pink-500 outline-none"
                        placeholder="https://instagram.com/..."
                    />
                </div>
                
                <div>
                    <label className="block text-gray-400 text-sm mb-1">YouTube URL</label>
                    <input 
                        value={profile.socials.youtube} 
                        onChange={e => handleSocialChange('youtube', e.target.value)} 
                        className="w-full bg-gray-900 p-2 rounded text-white border border-gray-700 focus:border-pink-500 outline-none"
                         placeholder="https://youtube.com/..."
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Spotify URL</label>
                    <input 
                        value={profile.socials.spotify} 
                        onChange={e => handleSocialChange('spotify', e.target.value)} 
                        className="w-full bg-gray-900 p-2 rounded text-white border border-gray-700 focus:border-pink-500 outline-none"
                         placeholder="https://open.spotify.com/..."
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Apple Music URL</label>
                    <input 
                        value={profile.socials.apple} 
                        onChange={e => handleSocialChange('apple', e.target.value)} 
                        className="w-full bg-gray-900 p-2 rounded text-white border border-gray-700 focus:border-pink-500 outline-none"
                         placeholder="https://music.apple.com/..."
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-sm mb-1">Facebook URL</label>
                    <input 
                        value={profile.socials.facebook} 
                        onChange={e => handleSocialChange('facebook', e.target.value)} 
                        className="w-full bg-gray-900 p-2 rounded text-white border border-gray-700 focus:border-pink-500 outline-none"
                         placeholder="https://facebook.com/..."
                    />
                </div>
            </div>
        </div>
    )
}

// --- ABOUT PAGE MANAGER ---
const AboutManager = () => {
    const [profile, setProfile] = useState<ArtistProfile>(StorageService.getProfile());
    const [newAchievement, setNewAchievement] = useState("");

    const save = () => {
        if (StorageService.saveProfile(profile)) {
            alert('About Page Updated Successfully');
        } else {
            alert('Error saving profile.');
        }
    }

    const handleChange = (field: keyof ArtistProfile, value: any) => {
        setProfile({...profile, [field]: value});
    }

    const addAchievement = () => {
        if(newAchievement.trim()) {
            const updated = [...profile.achievements, newAchievement.trim()];
            handleChange('achievements', updated);
            setNewAchievement("");
        }
    }

    const removeAchievement = (index: number) => {
        const updated = profile.achievements.filter((_, i) => i !== index);
        handleChange('achievements', updated);
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Manage About Page</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save</button>
            </div>

            <div className="space-y-4">
                 {/* About Image File Browser */}
                 <div>
                    <label className="text-gray-400 text-sm mb-1 block">About Page Image</label>
                    <div className="relative group cursor-pointer overflow-hidden rounded bg-gray-800 border border-gray-700 w-full h-64">
                         <img src={profile.aboutImage} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" alt="About"/>
                         <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Upload className="text-white mb-2" size={24}/>
                             <span className="text-white font-bold">Upload New Image</span>
                         </div>
                         <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => handleChange('aboutImage', url))}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-gray-400 text-sm block mb-1">Biography</label>
                    <textarea 
                        value={profile.bio} 
                        onChange={e => handleChange('bio', e.target.value)} 
                        rows={8} 
                        className="w-full bg-gray-800 p-4 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                    />
                </div>

                <div>
                    <label className="text-gray-400 text-sm block mb-2">Achievements / Awards</label>
                    <div className="space-y-2 mb-2">
                        {profile.achievements.map((ach, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                                <span className="flex-1 text-gray-300">{ach}</span>
                                <button onClick={() => removeAchievement(idx)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            placeholder="Add new achievement..."
                            className="flex-1 bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"
                        />
                        <button onClick={addAchievement} className="bg-cyan-600 px-4 rounded text-white hover:bg-cyan-500"><Plus size={18}/></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- PROFILE MANAGER ---
const ProfileManager = () => {
    const [profile, setProfile] = useState<ArtistProfile>(StorageService.getProfile());
    const [adminCreds, setAdminCreds] = useState(StorageService.getCredentials());

    const save = () => {
        const profileSuccess = StorageService.saveProfile(profile);
        const credsSuccess = StorageService.saveCredentials(adminCreds);

        if (profileSuccess && credsSuccess) {
            alert('Profile & Admin Settings Updated Successfully');
        } else {
            alert('Error saving data! Image might be too large.');
        }
    }

    const handleChange = (field: keyof ArtistProfile, value: string) => {
        setProfile({...profile, [field]: value});
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">General Settings</h2>
                <button onClick={save} className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-500"><Save size={16}/> Save</button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-gray-400 text-sm">Artist Name</label>
                    <input value={profile.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"/>
                </div>
                <div>
                    <label className="text-gray-400 text-sm">Tagline (Homepage)</label>
                    <input value={profile.tagline} onChange={e => handleChange('tagline', e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"/>
                </div>
                 <div>
                    <label className="text-gray-400 text-sm">Booking Email (Notification Recipient)</label>
                    <input value={profile.email} onChange={e => handleChange('email', e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-pink-500/30"/>
                </div>
                 <div>
                    <label className="text-gray-400 text-sm">Contact Number</label>
                    <input value={profile.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-pink-500/30"/>
                </div>
                 <div>
                    <label className="text-gray-400 text-sm">Location</label>
                    <input value={profile.location || ''} onChange={e => handleChange('location', e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-700 focus:border-cyan-400 outline-none"/>
                </div>
                 
                {/* New Security Section */}
                <div className="bg-gray-900 border border-red-500/30 p-6 rounded-lg space-y-4 mt-8">
                     <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                        <Lock size={20} /> Admin Access Settings
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400 text-sm">Admin Username</label>
                            <input 
                                value={adminCreds.username} 
                                onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} 
                                className="w-full bg-black p-2 rounded text-white border border-gray-700 focus:border-red-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm">Admin Password</label>
                            <input 
                                type="text"
                                value={adminCreds.password} 
                                onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} 
                                className="w-full bg-black p-2 rounded text-white border border-gray-700 focus:border-red-500 outline-none"
                            />
                        </div>
                     </div>
                </div>
            </div>
        </div>
    )
}


const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tracks');

  useEffect(() => {
    if (!StorageService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    StorageService.logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox': return <InboxManager />;
      case 'tracks': return <TracksManager />;
      case 'events': return <EventsManager />;
      case 'gallery': return <GalleryManager />;
      case 'videos': return <VideosManager />;
      case 'socials': return <SocialsManager />;
      case 'about': return <AboutManager />;
      case 'profile': return <ProfileManager />;
      default: return <div className="text-white">Feature coming soon in this demo...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white tracking-wider">ADMIN <span className="text-pink-500">ANNY</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setActiveTab('inbox')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'inbox' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <MessageSquare size={18} /> Inbox
          </button>
          <button onClick={() => setActiveTab('tracks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'tracks' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Music size={18} /> Music Tracks
          </button>
          <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'events' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Calendar size={18} /> Events
          </button>
           <button onClick={() => setActiveTab('gallery')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'gallery' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <ImageIcon size={18} /> Gallery
          </button>
           <button onClick={() => setActiveTab('videos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'videos' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Video size={18} /> Videos
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'about' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <FileText size={18} /> About Page
          </button>
           <button onClick={() => setActiveTab('socials')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'socials' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <Share2 size={18} /> Socials / Follow Me
          </button>
           <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm ${activeTab === 'profile' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>
            <User size={18} /> General Settings
          </button>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
           <button onClick={() => { if(confirm('Reset all website content to defaults? This cannot be undone.')) StorageService.clearAll(); }} className="w-full flex items-center gap-2 text-yellow-500 hover:text-yellow-400 px-4 py-2 hover:bg-gray-800 rounded text-sm">
            <RefreshCw size={18} /> Reset Data
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 hover:bg-gray-800 rounded text-sm">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;