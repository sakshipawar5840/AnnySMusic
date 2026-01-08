import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { StorageService } from '../services/storage';

const Contact: React.FC = () => {
  const profile = StorageService.getProfile();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventTime: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Simulate backend Nodemailer call
      await StorageService.sendBookingEmail(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', eventType: '', eventTime: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Get in <span className="text-cyan-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-400">
              For bookings, press inquiries, or collaborations, please fill out the form or reach out directly.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-900 rounded-full text-pink-500 border border-gray-700">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Email</p>
                <p className="text-lg font-medium break-all">{profile.email}</p>
              </div>
            </div>

            {profile.phone && (
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gray-900 rounded-full text-green-500 border border-gray-700">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Phone</p>
                  <p className="text-lg font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-900 rounded-full text-cyan-400 border border-gray-700">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-widest">Location</p>
                <p className="text-lg font-medium">{profile.location || "Pune, India"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-bold mb-6 text-pink-500">Booking Request</h2>
          
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-4 animate-fade-in text-center">
              <CheckCircle size={64} className="text-green-500" />
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-gray-400">Thanks for reaching out. We will get back to you shortly.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 text-cyan-400 hover:text-white underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
                />
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Event Type</label>
                    <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors appearance-none"
                    >
                        <option value="">Select Type...</option>
                        <option value="Club Show">Club Show</option>
                        <option value="Festival">Festival</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Private Party">Private Party</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Other">Other</option>
                    </select>
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm text-gray-400">Event Date & Time</label>
                    <input 
                        type="datetime-local" 
                        name="eventTime" 
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
                    />
                 </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-400">Message / Details</label>
                <textarea 
                  name="message" 
                  rows={4} 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-colors"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'sending'}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : (
                  <>Send Request <Send size={18} /></>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;