import React from 'react';
import { Wing } from '../types';
import { motion, useScroll, useTransform } from 'motion/react';
import { WINGS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WingsSection() {
  const navigate = useNavigate();
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Progress for the entire section entering/leaving view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Progress specifically for when the section is active and scrolling its internal content
  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Subtle header animations
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const titleY = useTransform(sectionProgress, [0, 1], [0, -30]);

  return (
    <section ref={containerRef} className="relative bg-brand-off-white text-brand-black py-24 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
          
          {/* Sticky Header Section - Pinned for all devices */}
          <div className="lg:col-span-4 sticky top-12 md:top-24 lg:top-32 h-fit z-30 pt-4 bg-brand-off-white/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
            <motion.div
              style={{ opacity: headerOpacity }}
              className="relative pb-8 lg:pb-0"
            >
              <div className="space-y-4 md:space-y-6">
                <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase block">STRUCTURE / SPECIALIZATION</span>
                
                <motion.div style={{ y: titleY }}>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.8]">
                    CLUB<br />WINGS
                  </h2>
                </motion.div>

                <div className="space-y-4 max-w-sm">
                  <p className="text-base md:text-lg lg:text-xl font-bold uppercase tracking-tight leading-tight">
                    13 wings empowering every software discipline.
                  </p>
                  <p className="hidden md:block text-sm opacity-60 font-medium leading-relaxed">
                    Each wing delivers specialized learning pathways, projects, and publications for student members.
                  </p>
                </div>
              </div>

              {/* Progress Indicator - Creative visual cue */}
              <div className="mt-8 lg:mt-12 space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono opacity-30 tracking-widest uppercase">Exploration Coverage</span>
                  <motion.span className="text-[10px] font-bold tabular-nums opacity-60">
                    {useTransform(sectionProgress, (v) => `${Math.min(100, Math.round(v * 100))}%`)}
                  </motion.span>
                </div>
                <div className="h-0.5 w-full bg-black/5 overflow-hidden">
                  <motion.div 
                    style={{ scaleX: sectionProgress }} 
                    className="h-full bg-black origin-left" 
                  />
                </div>
              </div>
              
              {/* Decorative line - Hidden on mobile for space */}
              <div className="mt-12 w-24 h-px bg-black/10 hidden lg:block" />
            </motion.div>
          </div>

          {/* Wings Content Grid - This part scrolls */}
          <div className="lg:col-span-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
              {WINGS.map((wing, index) => (
                <motion.div
                  key={wing.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
                  onClick={() => navigate(`/wing/${wing.id}`)}
                  className="bg-brand-off-white relative flex flex-col group overflow-hidden cursor-pointer h-[350px] md:h-[400px]"
                >
                  {/* Background Image reveals on hover */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={wing.imageUrl} 
                      alt={wing.name}
                      className="w-full h-full object-cover grayscale opacity-0 group-hover:opacity-30 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-brand-off-white group-hover:bg-black/40 transition-colors duration-700" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-8 md:p-12 flex flex-col h-full group-hover:text-white transition-colors duration-500">
                    <div className="mb-6 md:mb-8 flex justify-between items-start">
                      <div className="p-3 border border-black/10 group-hover:border-white/40 transition-colors">
                        {wing.icon}
                      </div>
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500" size={20} />
                    </div>

                    <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase mb-4 leading-none">
                      {wing.name}
                    </h3>
                    
                    <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium mb-6 line-clamp-3 group-hover:opacity-90">
                      {wing.description}
                    </p>

                    <div className="mt-auto flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-black tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-all translate-y-8 group-hover:translate-y-0 duration-500">Explore Wing</span>
                      <div className="w-0 group-hover:w-10 h-px bg-white/40 transition-all duration-700 delay-100" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
