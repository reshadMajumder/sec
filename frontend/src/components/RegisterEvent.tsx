import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { EVENTS } from '../constants';

export const RegisterEvent: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = EVENTS.find(e => e.id === eventId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-brand-off-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-brand-black">EVENT_NOT_FOUND</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-brand-black text-white font-bold uppercase tracking-widest hover:opacity-80- transition-opacity"
          >
            RETURN_HOME
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-off-white text-brand-black selection:bg-black selection:text-white relative flex flex-col md:flex-row">
      {/* Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      {/* Left Column: Event Visual & Info (Sticky on Desktop) */}
      <div className="w-full md:w-1/2 lg:w-2/5 bg-brand-black text-white relative flex flex-col p-8 md:p-12 lg:p-24 overflow-hidden">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="absolute inset-0 z-0">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover grayscale opacity-30 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-brand-black/80" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-end space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block mb-4">EVENT_CONTEXT</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
              {event.title.split(' ')[0]}<br />
              <span className="text-white/20">{event.title.split(' ').slice(1).join(' ')}</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-lg font-medium opacity-60 uppercase italic leading-relaxed">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-8 text-[10px] font-black tracking-widest">
               <div className="flex items-center gap-2">
                 <Calendar size={14} className="opacity-40" /> {event.date}
               </div>
               <div className="flex items-center gap-2">
                 <MapPin size={14} className="opacity-40" /> {event.location}
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-8 md:p-12 lg:p-32 bg-brand-off-white">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xl"
        >
          {isSuccess ? (
            <div className="py-12 flex flex-col items-center text-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20"
              >
                <CheckCircle2 size={48} />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black uppercase tracking-tighter">SUCCESS_AUTH</h3>
                <p className="text-sm font-bold opacity-50 uppercase tracking-widest italic">REGISTRATION_COMPLETE. REDIRECTING_HOME...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">REGISTRATION_PORTAL</h2>
                <div className="w-12 h-1 bg-brand-black" />
              </div>

              <form onSubmit={handleRegister} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">FULL_NAME_LEGAL</label>
                    <input 
                      required
                      type="text" 
                      placeholder="ENTER_NAME"
                      className="w-full bg-black/[0.04] border-b-2 border-transparent p-4 font-bold uppercase text-sm focus:outline-none focus:border-brand-black transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">STUDENT_IDENT_ID</label>
                    <input 
                      required
                      type="text" 
                      placeholder="XX-XXXXX-X"
                      className="w-full bg-black/[0.04] border-b-2 border-transparent p-4 font-bold uppercase text-sm focus:outline-none focus:border-brand-black transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">INSTITUTIONAL_SECURE_EMAIL</label>
                  <input 
                    required
                    type="email" 
                    placeholder="NAME.STUDENT@DAFFODILVARSITY.EDU.BD"
                    className="w-full bg-black/[0.04] border-b-2 border-transparent p-4 font-bold uppercase text-sm focus:outline-none focus:border-brand-black transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">PHONE_CONTACT_REF</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+8801XXXXXXXXX"
                    className="w-full bg-black/[0.04] border-b-2 border-transparent p-4 font-bold uppercase text-sm focus:outline-none focus:border-brand-black transition-all"
                  />
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="group w-full py-6 bg-brand-black text-white font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-neutral-900 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'ENROLLING_IN_DB...' : 'CONFIRM_ENROLLMENT'} 
                    {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                  </button>
                </div>
                
                <div className="flex gap-4 p-6 bg-black/[0.02] border border-black/5 items-start">
                   <div className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0 mt-1" />
                   <p className="text-[9px] font-bold opacity-40 uppercase leading-loose">
                     BY REGISTERING, YOU ACKNOWLEDGE THE SEC DIU CODE OF CONDUCT. DATA IS HANDLED PER CLUB PRIVACY PROTOCOLS.
                   </p>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
