import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectCardProps } from '../types';
import { PROJECTS } from '../constants';

export function ProjectCard({ project, index, activeIndex, isMobile }: ProjectCardProps) {
  const N = PROJECTS.length;
  // Circular distance calculation
  let diff = index - activeIndex;
  if (diff > N / 2) diff -= N;
  if (diff < -N / 2) diff += N;
  
  const position = diff;
  const isCenter = Math.abs(position) < 0.1;

  
  return (
    <motion.div
      initial={false}
      animate={{
        x: position * (isMobile ? 140 : 350),
        z: Math.abs(position) * -600,
        rotateY: position * -45,
        opacity: 1 - Math.abs(position) * 0.5,
        scale: 1 - Math.abs(position) * 0.2,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 25,
        mass: 1
      }}
      className={`absolute w-[200px] md:w-[320px] lg:w-[400px] aspect-[3/4.5] shadow-[0_50px_100px_rgba(0,0,0,0.15)] overflow-hidden bg-neutral-100 origin-bottom z-10 ${isCenter ? 'z-20 cursor-default' : 'cursor-pointer hover:opacity-80'}`}
    >
      <img
        src={project.imageUrl}
        alt={project.name}
        className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
        referrerPolicy="no-referrer"
      />
      <AnimatePresence>
        {isCenter && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent"
          >
             <div className="absolute bottom-8 w-full px-8 text-white text-center">
                <span className="text-[10px] font-mono mb-2 tracking-widest block opacity-60">PROJECT {project.number}</span>
                <h3 className="text-xl md:text-3xl font-black tracking-tighter leading-none uppercase leading-none">{project.name}</h3>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
