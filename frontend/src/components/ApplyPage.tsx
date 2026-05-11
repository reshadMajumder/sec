import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ApplyForm } from './ApplyForm';

export function ApplyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-off-white text-brand-black selection:bg-black selection:text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-6 md:py-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm transition-all hover:bg-black hover:text-white"
        >
          <ArrowLeft size={16} />
          Back Home
        </button>
      </div>

      <main className="relative z-10 px-6 pb-16 md:px-12 lg:px-24 lg:pb-24">
        <div className="max-w-7xl mx-auto mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-mono tracking-[0.5em] opacity-40 uppercase">APPLICATION_PORTAL</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85] max-w-4xl">
              Submit Your
              <span className="block text-black/20">Application.</span>
            </h1>
            <p className="max-w-2xl text-sm md:text-base font-medium opacity-60 leading-relaxed uppercase tracking-wide">
              Fill the form and the page will send your payload to the registration endpoint using BASE_URL.
            </p>
          </motion.div>
        </div>

        <ApplyForm />
      </main>
    </div>
  );
}