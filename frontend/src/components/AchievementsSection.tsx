import React from 'react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../constants';

export function AchievementsSection() {
  return (
    <section className="relative bg-brand-black text-brand-off-white py-24 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-end">
          
          {/* Header */}
          <div className="lg:col-span-12 mb-12 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase block mb-6 px-1 border-l-2 border-white/20">METRICS / IMPACT</span>
              <h2 className="text-6xl md:text-[8vw] font-black tracking-tighter uppercase leading-[0.8] mb-8">
                CORE<br />ACHIEVEMENTS
              </h2>
              <p className="text-sm md:text-xl opacity-60 max-w-xl font-medium leading-relaxed">
                A track record of student impact and recognition. We measure success by the communities we build and the innovation we spark.
              </p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {ACHIEVEMENTS.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 md:p-12 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden"
              >
                {/* Background Number Accent */}
                <span className="absolute -right-4 -bottom-8 text-[12vw] font-black text-white/[0.03] select-none pointer-events-none transition-transform group-hover:scale-110 duration-1000">
                  {index + 1}
                </span>

                <div className="relative z-10 space-y-2">
                  <motion.span 
                    className="text-5xl md:text-7xl font-black tracking-tighter block uppercase leading-none group-hover:text-white transition-colors"
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-[10px] md:text-xs font-mono tracking-[0.3em] opacity-40 uppercase block group-hover:opacity-100 transition-opacity">
                    {stat.label}
                  </span>
                </div>

                {/* Corner Decor */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/0 group-hover:border-white/20 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
