import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, ShieldCheck, History } from 'lucide-react';
import { HISTORICAL_COMMITTEES } from '../constants';

export const LegendsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-black text-white selection:bg-white selection:text-black">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">EXIT_ARCHIVE</span>
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-white/20 mb-8"
          >
            <Award size={32} className="text-white/40" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono tracking-[0.8em] text-white/30 uppercase block mb-6"
          >
            DIU_SEC_HALL_OF_FAME
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8]"
          >
            THE<br /><span className="text-white/10 outline-text">LEGENDS.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto mt-12 text-lg font-medium text-white/40 uppercase italic leading-relaxed"
          >
            CHRONICLING THE ARCHITECTS OF OUR TECHNICAL DYNASTY. EVERY MEMBER LISTED HERE CONTRIBUTED TO THE GENESIS AND GROWTH OF THE SOFTWARE ENGINEERING CLUB AT DIU.
          </motion.p>
        </div>
      </header>

      {/* Timeline Section */}
      <main className="max-w-7xl mx-auto px-6 pb-64 relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/5 to-transparent hidden lg:block" />

        <div className="space-y-48">
          {HISTORICAL_COMMITTEES.map((era, eraIndex) => (
            <motion.div 
              key={era.year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col gap-16">
                {/* Era Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                        <History size={20} className="text-white/40" />
                      </div>
                      <span className="text-3xl font-black tracking-tighter text-white/20">{era.year}</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">{era.title}</h2>
                    <p className="text-lg font-medium text-white/40 uppercase italic max-w-2xl leading-relaxed">
                      {era.description}
                    </p>
                  </div>
                </div>

                {/* Groups within the Era */}
                <div className="space-y-32">
                  {era.groups.map((group) => (
                    <div key={group.id} className="space-y-12">
                      <div className="flex items-center gap-8">
                        <h3 className="text-2xl font-black tracking-tighter uppercase text-white/60 flex-shrink-0">{group.title}</h3>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {group.members.map((member) => (
                          <div key={member.id} className="group relative">
                            <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/5 relative">
                              <img 
                                src={member.imageUrl} 
                                alt={member.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
                              />
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h4 className="text-xl font-black tracking-tighter uppercase leading-none mb-1">
                                  {member.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <ShieldCheck size={12} className="text-white/40" />
                                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none">
                                    {member.role}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer Artifact */}
      <footer className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <span className="text-xs font-bold text-white/20">SEC</span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-20">LEGACY_DATABASE_V.01</p>
          </div>
          <p className="text-[10px] font-bold opacity-10 uppercase tracking-[0.5em]">WE BECOME WHAT WE CELEBRATE</p>
        </div>
      </footer>
    </div>
  );
};
