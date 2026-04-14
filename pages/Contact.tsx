import React, { useState } from 'react';
import { NeonButton } from '../components/NeonButton';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Contact: React.FC = () => {
  const { addBooking, contactInfo } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the addBooking function from context
    addBooking({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      details: formData.details
    });
    
    setStatus('success');
    setTimeout(() => setStatus('idle'), 5000);
    setFormData({ name: '', email: '', phone: '', details: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-darkBg flex items-center justify-center">
       <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
         
         {/* Info Side */}
         <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-display font-black text-white mb-6">
              BOOKING & <span className="text-neonCyan">CONTACT</span>
            </h1>
            <p className="text-gray-400 text-lg mb-10">
              Ready to bring the neon energy to your event? Submit a booking request below.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neonPink">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Email</div>
                  <div className="text-lg font-medium">{contactInfo.email}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neonCyan">
                  <Phone size={20} />
                </div>
                <div>
                   <div className="text-xs text-gray-500 uppercase tracking-wider">Management</div>
                   <div className="text-lg font-medium">{contactInfo.managementPhone}</div>
                </div>
              </div>

               <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-neonPurple">
                  <MapPin size={20} />
                </div>
                <div>
                   <div className="text-xs text-gray-500 uppercase tracking-wider">Location</div>
                   <div className="text-lg font-medium">{contactInfo.location}</div>
                </div>
              </div>
            </div>
         </div>

         {/* Form Side */}
         <div className="bg-cardBg border border-white/5 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonPink/10 blur-[50px] pointer-events-none"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Booking Request Form</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name / Organization</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Booking Details (Date, Venue, etc.)</label>
                <textarea 
                  name="details"
                  required
                  rows={4}
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neonCyan focus:outline-none focus:ring-1 focus:ring-neonCyan transition-colors resize-none"
                ></textarea>
              </div>

              <NeonButton type="submit" className="w-full">
                Submit Booking Request
              </NeonButton>

              {status === 'success' && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-center animate-pulse">
                  Booking request received! We will contact you shortly.
                </div>
              )}
            </form>
         </div>
       </div>
    </div>
  );
};