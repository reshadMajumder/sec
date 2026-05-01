import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EVENTS } from '../constants';

export const EventsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="events" className="py-32 bg-brand-black text-white overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase block mb-4"
            >
              MISSION_CALENDAR
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
            >
              ACTIVE<br /><span className="text-white/10 outline-text">EVENTS.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-md text-white/60 font-medium uppercase italic text-sm leading-relaxed"
          >
            JOIN THE FRONTLINE OF INNOVATION. SECURE YOUR SPOT IN OUR UPCOMING TECHNICAL SESSIONS AND HACKATHONS.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="aspect-[3/4] overflow-hidden bg-white/5 relative border border-white/10">
                <motion.img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-4 text-[10px] font-bold tracking-widest text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-white" /> {event.date}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-xs font-medium text-white/40 uppercase leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {event.description}
                    </p>
                    <button 
                      onClick={() => navigate(`/register/${event.id}`)}
                      className="w-full py-4 bg-white text-brand-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all delay-200"
                    >
                      SECURE_ACCESS <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="absolute top-8 right-8 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <span className="text-[10px] font-bold">0{index + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
