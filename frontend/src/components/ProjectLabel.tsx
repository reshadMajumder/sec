import React from 'react';
import { motion } from 'motion/react';
import { ProjectLabelProps } from '../types';
import { PROJECTS } from '../constants';

export function ProjectLabel({ proj, idx, activeIndex, isMobile, setActiveIndex }: ProjectLabelProps) {
  const N = PROJECTS.length;
  // Circular distance calculation
  let diff = idx - activeIndex;
  if (diff > N / 2) diff -= N;
  if (diff < -N / 2) diff += N;
  
  const position = diff;
  const isCenter = Math.abs(position) < 0.1;

  return (
    <motion.button
      onClick={() => setActiveIndex(idx)}
      initial={false}
      animate={{
        x: position * (isMobile ? 180 : 450),
        opacity: isCenter ? 1 : Math.abs(position) < 1 ? 0.3 : 0.08,
        scale: 1 - Math.abs(position) * 0.15,
      }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 20
      }}
      className={`absolute group cursor-pointer transition-colors duration-500 whitespace-nowrap z-10`}
    >
      <span className="text-3xl md:text-7xl lg:text-9xl font-black tracking-tighter block uppercase">
        {proj.name}
      </span>
      {isCenter && (
        <motion.div 
          layoutId="active-nav-dot"
          className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full"
        />
      )}
    </motion.button>
  );
}
