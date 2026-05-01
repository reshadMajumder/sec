import React from 'react';
import { motion } from 'motion/react';
import { COMMITTEE } from '../constants';

export function CommitteeSection() {
  return (
    <section className="relative bg-brand-black text-brand-off-white py-24 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden z-20">
      <div className="max-w-screen-2xl mx-auto">
        {/* Section Header */}
        <div className="mb-24 md:mb-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-[10px] font-mono tracking-[0.4em] opacity-40 uppercase block mb-6">GOVERNANCE / 2025</span>
            <h2 className="text-6xl md:text-[9vw] font-black tracking-tighter uppercase leading-[0.8]">
              AD HOC<br />
              <span className="text-white/20">COMMITTEE.</span>
            </h2>
            <div className="mt-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <p className="text-sm md:text-xl opacity-60 max-w-xl font-medium">
                The dedicated members driving every initiative, event, and publication of the Software Engineering Club forward.
              </p>
              <div className="h-px flex-1 bg-white/10 hidden md:block" />
            </div>
          </motion.div>
        </div>

        {/* Committee Hierarchy */}
        <div className="space-y-24 md:space-y-48">
          {COMMITTEE.map((group, groupIndex) => (
            <div key={group.id} className="relative">
              {/* Vertical Category Label */}
              <div className="absolute -left-12 top-0 hidden xl:block">
                <span className="vertical-text rotate-180 text-[10px] font-black tracking-[0.3em] uppercase opacity-20 whitespace-nowrap">
                  CATEGORY :: {group.title}
                </span>
              </div>

              <div className="mb-12 flex items-baseline gap-4">
                <span className="text-sm font-mono opacity-20">0{groupIndex + 1}</span>
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">
                  {group.title}
                </h3>
              </div>

              <div className={`grid gap-4 md:gap-8 ${
                group.id === 'advisors' ? 'grid-cols-1 md:grid-cols-3' : 
                group.id === 'mentors' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                group.id === 'leadership' ? 'grid-cols-2 md:grid-cols-4' :
                'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
              }`}>
                {group.members.map((member, memberIndex) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: memberIndex * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative"
                  >
                    <div className="aspect-[3/4] bg-white/[0.03] border border-white/5 flex flex-col relative overflow-hidden">
                      {/* Member Image or Initials */}
                      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
                        {member.imageUrl ? (
                          <motion.img 
                            src={member.imageUrl} 
                            alt={member.name}
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                          />
                        ) : (
                          <span className="text-[12vw] font-black text-white/[0.02] select-none uppercase">
                            {member.initials}
                          </span>
                        )}
                      </div>

                      <div className="flex-1" />
                      
                      <div className="p-4 md:p-6 relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="mb-2 w-8 h-px bg-white/20 group-hover:w-full transition-all duration-500" />
                        <h4 className="text-sm md:text-base font-black tracking-tight leading-tight uppercase group-hover:text-white transition-colors">
                          {member.name}
                        </h4>
                        <p className="text-[9px] md:text-[10px] font-mono tracking-widest uppercase opacity-40 mt-1">
                          {member.role}
                        </p>
                      </div>

                      {/* Accent corner */}
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/0 group-hover:border-white/40 transition-all duration-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
