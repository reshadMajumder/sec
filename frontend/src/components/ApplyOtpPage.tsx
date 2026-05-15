import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

type ApplyOtpLocationState = {
  email?: string;
  message?: string;
};

function getApiMessage(responseData: unknown, fallback: string) {
  if (!responseData || typeof responseData !== 'object') {
    return fallback;
  }

  const data = responseData as Record<string, unknown>;

  if (typeof data.detail === 'string' && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  const firstValue = Object.values(data).find((value) => typeof value === 'string' && value.trim().length > 0);
  return typeof firstValue === 'string' ? firstValue : fallback;
}

export function ApplyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as ApplyOtpLocationState | null) || {};

  const [email, setEmail] = useState(locationState.email || '');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState(locationState.message || 'Enter the OTP sent to your email.');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('verifying');
    setMessage('');

    try {
      const response = await fetch(`${BASE_URL}/api/v1/accounts/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getApiMessage(responseData, 'OTP verification failed.'));
      }

      setStatus('success');
      setMessage(getApiMessage(responseData, 'OTP verified successfully.'));
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'OTP verification failed.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-off-white text-brand-black selection:bg-black selection:text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-6 md:py-10 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/apply')}
          className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 backdrop-blur-sm px-5 py-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm transition-all hover:bg-black hover:text-white"
        >
          <ArrowLeft size={16} />
          Back To Apply
        </button>

        <div className="text-right max-w-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">OTP VERIFICATION</p>
          <p className="text-xs md:text-sm font-medium opacity-60 break-all">{locationState.message || 'Verify your email with the code sent to you.'}</p>
        </div>
      </div>

      <main className="relative z-10 px-6 pb-16 md:px-12 lg:px-24 lg:pb-24">
        <div className="max-w-3xl mx-auto mb-10 md:mb-14 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.5em] opacity-40 uppercase">VERIFY_EMAIL</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] max-w-3xl">
              Confirm
              <span className="block text-black/20">Your OTP.</span>
            </h1>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white border border-black/10 shadow-[0_24px_80px_rgba(0,0,0,0.08)] rounded-[2rem] p-6 md:p-8 space-y-8"
        >
          <label className="space-y-3 block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ENTER_EMAIL"
              className="w-full bg-black/[0.04] border border-black/10 rounded-2xl px-4 py-4 text-sm font-medium tracking-normal uppercase focus:outline-none focus:border-black transition-colors"
            />
          </label>

          <label className="space-y-3 block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">OTP</span>
            <input
              required
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="ENTER_OTP"
              className="w-full bg-black/[0.04] border border-black/10 rounded-2xl px-4 py-4 text-sm font-medium tracking-[0.35em] uppercase focus:outline-none focus:border-black transition-colors"
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 max-w-xl leading-relaxed">
              The response message below comes directly from the backend `detail` field.
            </p>
            <button
              type="submit"
              disabled={status === 'verifying'}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.35em] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'verifying' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  VERIFYING
                </>
              ) : (
                <>
                  Verify OTP
                  <CheckCircle2 size={16} className="group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
              status === 'success'
                ? 'border border-green-500/20 bg-green-500/10 text-green-700'
                : status === 'error'
                  ? 'border border-red-500/20 bg-red-500/10 text-red-700'
                  : 'border border-black/10 bg-black/[0.02] text-black/70'
            }`}
          >
            <CheckCircle2 size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">{message}</span>
          </div>
        </motion.form>
      </main>
    </div>
  );
}