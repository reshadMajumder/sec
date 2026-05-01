import React from 'react';
import { motion } from 'motion/react';
import { Download, BookOpen, ExternalLink } from 'lucide-react';
import { PUBLICATIONS } from '../constants';

export const PublicationsSection: React.FC = () => {
  return (
    <section id="publications" className="py-32 bg-brand-off-white text-brand-black overflow-hidden relative">
      {/* Background technical indicator */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[20vw] font-black leading-none uppercase">PUBLISH</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] font-mono tracking-[0.5em] text-black/40 uppercase block mb-4"
            >
              KNOWLEDGE_RESOURCES
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
            >
              DIGITAL<br /><span className="text-black/10 outline-text-dark">PRINTS.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-md text-black/60 font-medium uppercase italic text-sm leading-relaxed"
          >
            EXPLORE OUR PERIODICALS AND RESEARCH PAPERS. DIVING DEEP INTO THE PROJECTS AND THEORIES THAT DRIVE OUR INNOVATION HUB.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {PUBLICATIONS.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                {/* Magazine Cover */}
                <div className="w-full lg:w-1/2 aspect-[3/4] bg-neutral-200 relative overflow-hidden shadow-2xl group-hover:shadow-[0_0_50px_rgba(0,0,0,0.1)] transition-all duration-700">
                  <motion.img 
                    src={pub.imageUrl} 
                    alt={pub.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                  
                  {/* Spine effect */}
                  <div className="absolute top-0 left-0 bottom-0 w-[5px] bg-gradient-to-r from-black/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <BookOpen size={20} className="text-brand-black" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-black/30 uppercase">{pub.issue}</span>
                    <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">
                      {pub.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm font-medium text-black/50 uppercase leading-relaxed italic">
                    {pub.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href={pub.pdfUrl}
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all group/btn"
                    >
                      DOWNLOAD_PDF <Download size={14} className="group-hover/btn:translate-y-1 transition-transform" />
                    </a>
                    <button className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-black/10 text-brand-black text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all">
                      READ_ONLINE <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Footer Indicator */}
        <div className="mt-32 pt-12 border-t border-black/5 flex flex-wrap justify-between gap-8 items-center">
            <div className="flex gap-12 items-center">
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-black/30 uppercase tracking-[0.2em]">REPLICA_STAMP</p>
                    <p className="text-[10px] font-black uppercase">SEC_PRINT_ARCHIVE_2026</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] font-bold text-black/30 uppercase tracking-[0.2em]">ENCODING</p>
                    <p className="text-[10px] font-black uppercase">UTF-8 / LATEX</p>
                </div>
            </div>
            <div className="h-px flex-1 bg-black/5 hidden md:block" />
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest italic">
              ALL RIGHTS RESERVED TO DIU COMPUTER SOCIETY (SEC)
            </p>
        </div>
      </div>
    </section>
  );
};
