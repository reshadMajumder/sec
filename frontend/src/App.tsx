/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// New specialized imports
import { PROJECTS, EVENTS, PUBLICATIONS } from './constants';
import { ProjectCard } from './components/ProjectCard';
import { ProjectLabel } from './components/ProjectLabel';
import { ActivitiesSection } from './components/ActivitiesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { WingsSection } from './components/WingsSection';
import { EventsSection } from './components/EventsSection';
import { PublicationsSection } from './components/PublicationsSection';
import { CommitteeSection } from './components/CommitteeSection';
import { WingDetail } from './components/WingDetail';
import { RegisterEvent } from './components/RegisterEvent';
import { LegendsPage } from './components/LegendsPage';

function LandingPage({ 
  activeIndex, 
  setActiveIndex, 
  time, 
  isMobile,
  isMenuOpen,
  setIsMenuOpen
}: { 
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  time: Date;
  isMobile: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const nextProject = () => setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  const prevProject = () => setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);

  // Auto-advance timer
  useEffect(() => {
    const timer = setInterval(nextProject, 4000); // Change every 4 seconds
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.1], ["0%", "-100%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <>
      {/* Hero Container */}
      <div id="hero" className="relative h-screen bg-brand-off-white">
        <motion.div 
          style={{ 
            opacity: heroOpacity, 
            scale: heroScale,
            y: heroY
          }}
          className="fixed inset-0 h-screen w-full flex flex-col z-20 overflow-hidden bg-brand-off-white"
        >
          {/* Header */}
          <header className="relative w-full p-4 md:p-8 text-[10px] md:text-[11px] tracking-[0.2em] font-bold z-50">
            <div className="max-w-full lg:max-w-[1600px] mx-auto grid grid-cols-3 items-center">
              {/* Left Nav (Desktop) */}
              <div className="hidden md:flex gap-8 items-baseline">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:opacity-50 transition-opacity">WORK<sup>({PROJECTS.length})</sup></button>
                <button 
                  onClick={() => {
                    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hover:opacity-50 transition-opacity"
                >
                  EVENTS<sup>({EVENTS.length})</sup>
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="hover:opacity-50 transition-opacity"
                >
                  PUBLICATIONS<sup>({PUBLICATIONS.length})</sup>
                </button>
              </div>

              {/* Center Logo */}
              <div 
                className="flex justify-center md:items-center cursor-pointer col-start-2 justify-self-center" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter leading-none italic uppercase whitespace-nowrap">
                  DIU SEC<span className="text-[10px] align-top not-italic font-normal">®</span>
                </h1>
              </div>

              {/* Right Nav & Mobile Menu */}
              <div className="flex gap-4 md:gap-8 items-center justify-end">
                <div className="hidden lg:flex gap-8 items-center">
                  <button 
                    onClick={() => navigate('/community')} 
                    className="hover:opacity-50 transition-opacity"
                  >
                    COMMUNITY
                  </button>
                  <button 
                    onClick={() => navigate('/legends')} 
                    className="hover:opacity-50 transition-opacity"
                  >
                    LEGENDS
                  </button>
                  <button onClick={() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }} className="hover:opacity-50 transition-opacity">ABOUT</button>
                  <button onClick={() => {
                    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                  }} className="hover:opacity-50 transition-opacity">CONTACT</button>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden flex items-center gap-3 bg-black/10 backdrop-blur-md rounded-full px-4 py-2 group hover:bg-black/20 transition-all"
                >
                  <span className="text-[10px] tracking-widest font-black uppercase">MENU</span>
                  <div className="w-5 h-2.5 flex flex-col justify-between py-0.5">
                    <div className="w-full h-0.5 bg-black" />
                    <div className="w-1/2 h-0.5 bg-black ml-auto" />
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 relative flex items-center justify-center p-4 md:p-12 overflow-hidden">
            {/* Background Text */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-[0.03]">
              <h2 className="text-[25vw] font-black text-black leading-none whitespace-nowrap select-none italic uppercase">
                DISCOVER / DISCOVER
              </h2>
            </div>

            {/* Desktop Side Header Text */}
            <div className="absolute left-12 top-1/3 hidden xl:block z-10 pointer-events-none">
              <h2 className="text-3xl font-black leading-[0.85] tracking-tighter uppercase whitespace-pre-line">
                {'SYSTEM\nARCHITECTS.'}
              </h2>
              <p className="text-[10px] mt-4 opacity-40 tracking-widest font-mono">
                EST. 2024 / CORE DEPT.
              </p>
            </div>

            <div className="absolute right-12 top-1/3 hidden xl:block text-right z-10 pointer-events-none">
              <h2 className="text-3xl font-black leading-[0.85] tracking-tighter uppercase whitespace-pre-line">
                {'ENGINEERING\nEXCELLENCE.'}
              </h2>
              <p className="text-[10px] mt-4 opacity-40 tracking-widest font-mono">
                V0.8.2 / RELEASE CANDIDATE
              </p>
            </div>

            {/* 3D Carousel Container */}
            <div className="relative w-full max-w-7xl h-full flex items-center justify-center perspective-[2000px]">
              <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                {PROJECTS.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index} 
                    activeIndex={activeIndex}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </main>

          {/* RULER / Ticker Section */}
          <section className="relative px-4 md:px-12 mb-8 md:mb-16 overflow-hidden">
            <div className="relative h-16 md:h-24 flex items-center justify-center">
               {/* Ruler Marks */}
               <div className="absolute inset-0 flex justify-between opacity-5 pointer-events-none">
                {Array.from({ length: isMobile ? 40 : 120 }).map((_, i) => (
                  <div key={i} className={`w-px bg-black ${i % 10 === 0 ? 'h-full' : i % 5 === 0 ? 'h-2/3' : 'h-1/3'}`} />
                ))}
              </div>

              <div className="relative w-full h-full flex items-center justify-center">
                {PROJECTS.map((proj, idx) => (
                  <ProjectLabel 
                    key={proj.id}
                    proj={proj}
                    idx={idx}
                    activeIndex={activeIndex}
                    isMobile={isMobile}
                    setActiveIndex={setActiveIndex}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="relative flex flex-wrap md:flex-nowrap justify-between items-center md:items-end p-4 md:px-10 md:pb-10 text-[10px] md:text-[11px] tracking-[0.2em] font-bold border-t border-black/5 bg-white md:bg-transparent">
            <div className="hidden md:flex gap-16 order-1">
              <span>©2026 // SAVAR</span>
              <span className="opacity-40">DIU_SEC_DSC_V0.8</span>
            </div>

            <div className="flex-1 md:flex-none flex justify-center gap-12 order-3 md:order-2">
               <div className="flex gap-8 items-center border border-black/10 rounded-full px-6 py-2 bg-white/50 backdrop-blur-sm">
                <button 
                  onClick={prevProject} 
                  className="transition-all hover:scale-125 opacity-100"
                >
                  <ChevronLeft size={16} strokeWidth={4} />
                </button>
                <div className="flex items-baseline gap-1 tabular-nums font-mono text-xs w-16 justify-center">
                  <span className="opacity-40">0</span>
                  <span>{activeIndex + 1}</span>
                  <span className="opacity-20 px-1">/</span>
                  <span className="opacity-40">0{PROJECTS.length}</span>
                </div>
                <button 
                  onClick={nextProject} 
                  className="transition-all hover:scale-125 opacity-100"
                >
                  <ChevronRight size={16} strokeWidth={4} />
                </button>
              </div>
            </div>

            <div className="flex gap-8 md:gap-16 text-right order-2 md:order-3 w-full md:w-auto mb-4 md:mb-0 justify-between md:justify-end">
              <span className="md:hidden opacity-40 tracking-normal">DIU_SEC_2026</span>
              <div className="flex gap-8">
                <a href="#" className="hover:opacity-50 transition-opacity">SEC</a>
                <a href="#" className="hover:opacity-50 transition-opacity">DIU®</a>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>

      {/* Activities Section */}
      <ActivitiesSection />

      {/* Events Section */}
      <EventsSection />
      
      {/* Publications Section */}
      <PublicationsSection />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Wings Section */}
      <WingsSection />

      {/* Committee Section */}
      <CommitteeSection />

      {/* About Section */}
      <section id="about" className="relative bg-brand-black text-brand-off-white py-24 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden scroll-mt-20 z-30">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-24 md:mb-40"
          >
            <h2 className="text-[14vw] md:text-[9vw] font-black leading-[0.8] tracking-tighter uppercase break-words">
              ENGINE FOR<br />
              <span className="text-white/20">INNOVATION.</span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-white/20" />
                    <span className="text-[10px] font-mono tracking-widest opacity-40 uppercase">01 / MISSION</span>
                  </div>
                  <p className="text-xl md:text-3xl font-bold leading-tight tracking-tight uppercase">
                    A student-led engine for engineering innovation at scale.
                  </p>
                  <p className="text-sm md:text-base opacity-60 leading-relaxed font-medium normal-case tracking-normal max-w-sm">
                    The Software Engineering Club empowers students to design, build, and publish technology for campus communities. We blend hands-on engineering, editorial excellence, and interdisciplinary collaboration.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-white/20" />
                    <span className="text-[10px] font-mono tracking-widest opacity-40 uppercase">02 / IMPACT</span>
                  </div>
                  <div className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 group">
                    <p className="text-sm md:text-lg font-bold uppercase tracking-tight mb-4 group-hover:translate-x-2 transition-transform">
                      MONTHLY E-MAGAZINE
                    </p>
                    <p className="text-xs md:text-sm opacity-60 leading-relaxed font-medium normal-case tracking-normal">
                      Our monthly E-Magazine is the flagship publication that amplifies student projects, research, and design thinking across the university.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="space-y-6"
              >
                {[
                  { label: "ESTABLISHED", value: "2024" },
                  { label: "DEPARTMENT", value: "Software Eng." },
                  { label: "LOCATION", value: "Savar, BD" }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-[9px] font-mono opacity-40 tracking-widest">{stat.label}</span>
                    <span className="text-lg md:text-xl font-bold uppercase">{stat.value}</span>
                  </div>
                ))}
              </motion.div>

              <div className="relative pt-12">
                <div className="aspect-[4/5] bg-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="text-[9px] tracking-[0.4em] font-black opacity-40 mb-6 uppercase">Join the Collective</p>
                      <button className="text-[10px] font-black px-10 py-4 bg-white text-black hover:bg-neutral-200 transition-colors uppercase tracking-widest active:scale-95 duration-200">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Technical Footer */}
      <footer id="footer" className="relative bg-brand-off-white pt-24 pb-12 px-6 md:px-12 lg:px-24 border-t border-black/5 overflow-hidden z-20">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0">
          <span className="text-[30vw] font-black italic select-none uppercase">DIU SEC</span>
        </div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-8">
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                DIU SEC<span className="text-sm align-top not-italic font-bold ml-1">®</span>
              </h1>
              <p className="text-sm md:text-base font-medium opacity-60 max-w-sm leading-relaxed">
                Software Engineering Club of Daffodil International University. 
                Architecting the next generation of engineers at Daffodil Smart City (DSC).
              </p>
              <div className="pt-4 space-y-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
                <p>Birulia, Savar, Dhaka-1216</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>HELP: 09617901212</p>
                  <p>TEL: +8809617901233</p>
                  <p>FAX: +8802224441835</p>
                  <p>Email: admission@daffodilvarsity.edu.bd</p>
                </div>
              </div>
              <div className="pt-2">
                <a 
                  href="https://maps.app.goo.gl/istRkPfCLxi9WqAn9" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-8 py-3 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-full flex items-center justify-center gap-3 w-fit"
                >
                  LOCATION MAP <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 uppercase font-black">NAVIGATE</span>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                  <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:translate-x-1 transition-transform inline-block">Work Archive</button></li>
                  <li><button onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })} className="hover:translate-x-1 transition-transform inline-block">Active Events</button></li>
                  <li><button onClick={() => document.getElementById('publications')?.scrollIntoView({ behavior: 'smooth' })} className="hover:translate-x-1 transition-transform inline-block">Digital Prints</button></li>
                  <li><button onClick={() => navigate('/legends')} className="hover:translate-x-1 transition-transform inline-block">Legends</button></li>
                </ul>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 uppercase font-black">LEGALS</span>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block opacity-60 hover:opacity-100">Privacy Policy</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block opacity-60 hover:opacity-100">Terms of Service</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block opacity-60 hover:opacity-100">Constitution</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block opacity-60 hover:opacity-100">Guidelines</a></li>
                </ul>
              </div>

              <div className="space-y-6 col-span-2 md:col-span-1">
                <span className="text-[10px] font-mono tracking-[0.3em] opacity-40 uppercase font-black">SOCIALS</span>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block underline decoration-black/10 underline-offset-4 decoration-2">Instagram</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block underline decoration-black/10 underline-offset-4 decoration-2">Facebook</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block underline decoration-black/10 underline-offset-4 decoration-2">LinkedIn</a></li>
                  <li><a href="#" className="hover:translate-x-1 transition-transform inline-block underline decoration-black/10 underline-offset-4 decoration-2">GitHub Hub</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5 flex flex-wrap justify-between items-end gap-12">
            <div className="space-y-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-1.5 h-8 bg-black/[0.03]" />)}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">DAFFODIL_SMART_CITY_SAVAR</span>
                <p className="text-[11px] font-black uppercase text-black">©2026 SOFTWARE ENGINEERING CLUB // DIU</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6">
              <div className="flex gap-8 text-[10px] font-black opacity-30 uppercase">
                <span>LAT: 23.8759° N</span>
                <span>LNG: 90.3202° E</span>
              </div>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-px h-12 bg-black/10 group-hover:h-16 transition-all relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-black" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 group-hover:opacity-100 transition-opacity translate-x-0.5">BACK_TO_ROOT</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

import { CommunityPage } from './components/CommunityPage';

export default function App() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative w-full bg-brand-off-white text-brand-black selection:bg-black selection:text-white overflow-x-hidden">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
 
      {/* Global Navigation Controls */}
      <AnimatePresence>
        {!isMenuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => setIsMenuOpen(true)}
            className="fixed bottom-8 right-8 z-[2500] w-14 h-14 sm:w-16 sm:h-16 bg-brand-black text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all group"
          >
            <div className="w-5 h-3 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-white group-hover:w-3/4 transition-all" />
              <div className="w-full h-0.5 bg-white" />
              <div className="w-3/4 h-0.5 bg-white group-hover:w-full transition-all" />
            </div>
            
            <div className="absolute right-full mr-4 px-4 py-2 bg-brand-black text-[10px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none">
              SYSTEM_NAV
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[3000] bg-brand-black flex flex-col p-6 md:p-12 lg:p-24 overflow-y-auto"
          >
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

            <div className="relative z-10 flex justify-between items-center mb-12 sm:mb-24 flex-shrink-0">
              <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.5em] text-white/40 uppercase">NAVIGATION_SYSTEM_V1.0</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="group w-10 h-10 sm:w-14 sm:h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <nav className="relative z-10 flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-12">
              {[
                { label: 'WORK ARCHIVE', ref: 'hero' },
                { label: 'ACTIVE EVENTS', ref: 'events' },
                { label: 'DIGITAL PRINTS', ref: 'publications' },
                { label: 'COMMUNITY HUB', type: 'link', path: '/community' },
                { label: 'ABOUT THE CLUB', ref: 'about' },
                { label: 'CONTACT CHANNEL', ref: 'footer' },
                { label: 'LEGENDS ARCHIVE', type: 'link', path: '/legends' }
              ].map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (item.type === 'link') {
                      navigate(item.path!);
                    } else {
                      if (location.pathname !== '/') {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById(item.ref!)?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      } else {
                        document.getElementById(item.ref!)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className="group flex items-end gap-3 sm:gap-6 text-left"
                >
                  <span className="text-white/20 font-black text-lg sm:text-2xl italic">0{i + 1}</span>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white uppercase group-hover:italic group-hover:translate-x-2 sm:group-hover:translate-x-4 transition-all duration-500">
                        {item.label}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </nav>

            <div className="relative z-10 pt-12 mt-auto border-t border-white/5 flex flex-wrap justify-between items-end gap-8 flex-shrink-0">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">SYSTEM_STATUS</span>
                  <p className="text-[10px] font-black uppercase text-white tracking-widest">OPERATIONAL // {time.toLocaleTimeString()}</p>
                </div>
                <p className="text-[9px] font-bold text-white/40 max-w-xs uppercase leading-relaxed">
                  SOFTWARE ENGINEERING CLUB. BUILDING THE NEXT WAVE OF SYSTEM ARCHITECTS AT DIU.
                </p>
              </div>
              
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-4 sm:w-1.5 sm:h-6 bg-white/10" />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <Routes location={location}>
          <Route 
            path="/" 
            element={
              <LandingPage 
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                time={time}
                isMobile={isMobile}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            } 
          />
          <Route path="/wing/:wingId" element={<WingDetail />} />
          <Route path="/register/:eventId" element={<RegisterEvent />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/legends" element={<LegendsPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
