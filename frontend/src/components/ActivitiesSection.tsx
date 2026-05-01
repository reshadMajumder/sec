import React from 'react';
import { motion } from 'motion/react';
import { ACTIVITIES } from '../constants';

export function ActivitiesSection() {
  return (
    <section className="relative bg-brand-off-white text-brand-black py-24 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          {/* Header */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase block mb-4">TIMELINE / 2025-26</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                RECENT<br />ACTIVITIES
              </h2>
              <p className="mt-8 text-sm md:text-base opacity-60 max-w-xs font-medium">
                What the club delivered this semester. A record of collective effort and shared moments.
              </p>
            </motion.div>
          </div>

          {/* Activities List */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-black/10">
              {ACTIVITIES.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="py-12 md:py-16 first:pt-0 last:pb-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-1 hidden md:block">
                      <span className="text-[10px] font-mono font-black tracking-[0.2em] uppercase opacity-20 vertical-text rotate-180">
                        {activity.date}
                      </span>
                    </div>
                    
                    <div className="md:col-span-5">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="aspect-[4/3] overflow-hidden bg-neutral-100 relative group cursor-pointer"
                      >
                        <img 
                          src={activity.imageUrl} 
                          alt={activity.title}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                      </motion.div>
                    </div>

                    <div className="md:col-span-6 space-y-4 md:pl-8">
                      <div className="md:hidden">
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-40">
                          {activity.date}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-tight">
                        {activity.title}
                      </h3>
                      <p className="text-sm md:text-lg opacity-60 leading-relaxed font-medium max-w-xl">
                        {activity.description}
                      </p>
                      <div className="pt-4 flex items-center gap-2 group cursor-pointer w-fit">
                        <div className="w-8 h-px bg-black/20 group-hover:w-16 transition-all duration-500" />
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">Full Case Study</span>
                      </div>
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
