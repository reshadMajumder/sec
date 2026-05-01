import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Wing } from '../types';
import { X, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { WINGS } from '../constants';

export function WingDetail() {
  const { wingId } = useParams();
  const navigate = useNavigate();
  const wing = WINGS.find(w => w.id === wingId);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track vertical scroll progress of this container
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Prevent body scroll when detail view is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!wing) {
    return (
      <div className="fixed inset-0 z-[1000] bg-brand-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">WING NOT FOUND</h1>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Map vertical scroll (0 to 1) to horizontal translation (-200% because we have 3 main layout blocks)
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-200%"]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-brand-off-white overflow-y-auto overflow-x-hidden no-scrollbar"
      ref={containerRef}
    >
      <header className="fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-[1010] mix-blend-difference text-white">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:opacity-50 transition-opacity"
        >
          <ArrowLeft size={14} />
          BACK TO HOME
        </button>
        
        <div className="flex gap-10 text-[10px] font-black tracking-widest uppercase opacity-40">
           <span>SEC // WING_V.1.0</span>
           <span className="hidden md:block">REF: {wing.id.toUpperCase()}</span>
        </div>

        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <X size={20} />
        </button>
      </header>

      {/* Scrollable track */}
      <div className="relative h-[300vh] w-full">
        {/* Sticky viewport content */}
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex h-full w-[300vw]">
            
            {/* Slide 1: Hero & Identity */}
            <section className="w-[100vw] h-full flex flex-col lg:flex-row flex-shrink-0">
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative overflow-hidden bg-neutral-200">
                <motion.img 
                   initial={{ scale: 1.2, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                   src={wing.imageUrl} 
                   className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-black/10" />
                
                <div className="absolute bottom-12 left-12 flex flex-col gap-1">
                   <div className="w-12 h-0.5 bg-white" />
                   <span className="text-white text-[10px] font-mono tracking-widest uppercase opacity-60">SYSTEM_ENTITY_0{wing.id.length}</span>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col justify-center p-8 md:p-24 space-y-12 bg-brand-off-white">
                <motion.div
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.5, duration: 1 }}
                >
                  <span className="text-[10px] font-mono tracking-[0.5em] text-black/30 uppercase mb-4 block">IDENTITY_PROTOCOL</span>
                  <h2 className="text-[12vw] lg:text-[7vw] font-black leading-[0.8] tracking-tighter uppercase break-words">
                    {wing.name.split(' ')[0]}<br />
                    <span className="text-black/10 inline-block mt-2">
                       {wing.name.split(' ').slice(1).join(' ')}
                    </span>
                  </h2>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 0.6 }}
                   transition={{ delay: 0.8 }}
                   className="max-w-md"
                >
                  <p className="text-lg md:text-xl font-medium leading-relaxed italic border-l-2 border-black/10 pl-6">
                    {wing.description}
                  </p>
                </motion.div>
                
                <div className="flex gap-4 items-center">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">CHAPTER_INDEX</span>
                      <span className="text-[10px] font-bold tracking-widest uppercase underline underline-offset-4">01_IDENT_ENTRY</span>
                   </div>
                   <div className="w-px h-8 bg-black/10 mx-4" />
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">WING_HEAD</span>
                      <span className="text-[10px] font-black uppercase">{wing.details?.head}</span>
                   </div>
                </div>
              </div>
            </section>

            {/* Slide 2: Data Matrix */}
            <section className="w-[100vw] h-full bg-brand-off-white border-x border-black/5 flex flex-col flex-shrink-0">
               <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative">
                  {/* Decorative Background Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vh] font-black opacity-[0.02] pointer-events-none uppercase whitespace-nowrap">
                    {wing.id}
                  </div>

                  <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24 relative z-10">
                    <div className="space-y-16">
                       <div className="space-y-4">
                          <span className="text-[10px] font-mono tracking-[0.4em] text-brand-black/40 uppercase block">OPERATIONAL_START</span>
                          <p className="text-4xl md:text-6xl font-black uppercase tracking-tighter tabular-nums">{wing.details?.establishmentDate || '2024'}</p>
                       </div>
                       <div className="space-y-4">
                          <span className="text-[10px] font-mono tracking-[0.4em] text-brand-black/40 uppercase block">MISSION_DRIVELINE</span>
                          <div className="flex flex-col gap-4">
                            {wing.details?.focusAreas?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                                <p className="text-lg font-black uppercase tracking-tight">{item}</p>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-16 lg:pt-12">
                       <div className="space-y-8">
                          <span className="text-[10px] font-mono tracking-[0.4em] text-brand-black/40 uppercase block">KEY_MILESTONES</span>
                          <div className="space-y-8">
                            {wing.details?.achievements?.map((item, i) => (
                              <div key={i} className="flex gap-4 border-l-2 border-black/5 pl-6 py-1">
                                <p className="text-sm font-bold uppercase opacity-80 leading-snug tracking-tight">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-16">
                       <div className="flex items-start gap-8">
                          <div className="space-y-2">
                             <span className="text-[10px] font-mono tracking-[0.4em] text-brand-black/40 uppercase block">ACTIVE_NODES</span>
                             <p className="text-8xl lg:text-9xl font-black uppercase tracking-tighter tabular-nums leading-none">{wing.details?.membersCount || '0'}</p>
                             <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-30">CERTIFIED_MEMBERS_CORE</span>
                          </div>
                          
                          <div className="hidden lg:flex flex-col justify-between h-[200px] py-4">
                            <div className="w-px flex-1 bg-black/10 mx-auto" />
                            <p className="text-[8px] font-black uppercase tracking-widest opacity-20 py-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>DATA_STREAM_AUTH</p>
                            <div className="w-px flex-1 bg-black/10 mx-auto" />
                          </div>
                       </div>

                       <div className="p-8 border border-black/5 bg-black/[0.02]">
                          <span className="text-[10px] font-mono tracking-[0.4em] text-brand-black/40 uppercase block mb-4">ENTITY_SUMMARY</span>
                          <p className="text-xs font-bold leading-relaxed opacity-50 uppercase">
                            This structural unit focuses on scalability and decentralized collaboration within the DIU SEC ecosystem. Every milestone is a testament to the core values of engineering excellence.
                          </p>
                       </div>
                    </div>
                  </div>
               </div>
            </section>

            {/* Slide 3: Future Vision */}
            <section className="w-[100vw] h-full bg-brand-black text-white flex flex-col md:flex-row flex-shrink-0">
               <div className="flex-1 flex items-center justify-center p-12 md:p-24 lg:p-32 bg-brand-black">
                  <div className="space-y-12">
                    <h2 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.75]">
                       THE<br /><span className="text-white/10 outline-text">VISION.</span>
                    </h2>
                    <div className="w-24 h-1 bg-white/20" />
                    <p className="max-w-lg text-lg md:text-2xl font-medium opacity-60 uppercase italic leading-relaxed">
                      WE DON’T JUST LEARN; WE BUILD. THE {wing.name.toUpperCase()} UNIT IS COMMITTED TO EXCELLENCE IN EVERY SECTOR OF CAMPUS LIFE, ENSURING THE NEXT GEN OF ENGINEERS ARE READY.
                    </p>

                    {wing.details?.keyProjects && (
                      <div className="pt-8 space-y-6">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block">CORE_SYSTEM_PROJECTS</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {wing.details.keyProjects.map((project, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 border border-white/5 hover:border-white/20 transition-all group">
                              <span className="text-[10px] font-bold opacity-30">0{i+1}</span>
                              <span className="text-sm font-black uppercase tracking-tight group-hover:tracking-widest transition-all">{project}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button className="flex items-center gap-4 text-[10px] font-black tracking-[0.4em] uppercase py-4 px-8 border border-white/20 hover:bg-white hover:text-black transition-all mt-8">
                       JOIN_THE_VANGUARD <ArrowUpRight size={14} />
                    </button>
                  </div>
               </div>
               
               <div className="flex-1 grid grid-cols-1 border-l border-white/5">
                  <div className="bg-neutral-900 overflow-hidden relative h-[40vh] md:h-[50vh]">
                    <motion.img 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      src={wing.imageUrl} 
                      className="w-full h-full object-cover grayscale opacity-40" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
                    <div className="absolute bottom-12 left-12">
                       <span className="text-[60px] font-black opacity-10 italic leading-none">V-{wing.id.length}</span>
                       <p className="text-[10px] font-bold tracking-[0.5em] opacity-40 uppercase">VISUAL_ENGINE_INDEX</p>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800 flex flex-col justify-center p-12 space-y-12 h-[60vh] md:h-[50vh]">
                      <div className="space-y-6">
                        <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block">COMMITMENT_ARCHITECTURE</span>
                        <p className="text-sm font-bold leading-relaxed opacity-60 uppercase max-w-md">
                          Every project undertaken by the {wing.name} is peer-reviewed and maintained under the strict protocols of the DIU Software Engineering Club. Integrity, Clean Code, and Scalability are our non-negotiables.
                        </p>
                      </div>
                      <div className="h-px w-full bg-white/10" />
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black uppercase tracking-widest opacity-40">© 2026 DIU SEC // ALL RIGHTS RESERVED</span>
                         <div className="flex gap-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 bg-white/20 rounded-full" />)}
                         </div>
                      </div>
                  </div>
               </div>
            </section>

          </motion.div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="fixed bottom-12 left-12 right-12 flex justify-between items-center mix-blend-difference text-white z-[1010] pointer-events-none">
         <div className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">
           SHOWCASE_TRACK_CORE
         </div>

         <div className="h-0.5 w-[40vw] bg-white/10 relative overflow-hidden hidden md:block">
            <motion.div 
               style={{ scaleX: smoothProgress }} 
               className="absolute inset-0 bg-white origin-left" 
            />
         </div>

         <div className="text-[10px] font-black tracking-widest uppercase text-right">
            SCROLL_HORIZONTAL_REF →
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        .outline-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
          color: transparent;
        }
      `}} />
    </motion.div>
  );
}
