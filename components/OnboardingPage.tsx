
import React, { useState } from 'react';
import { UserBiometrics } from '../types';

interface OnboardingPageProps {
  onComplete: (data: UserBiometrics) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [data, setData] = useState<UserBiometrics>({
    age: '',
    height: '',
    weight: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(data);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-start p-6 relative overflow-y-auto no-scrollbar">
      {/* Background Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#A1F6E2] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10 py-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-[#A1F6E2] mx-auto mb-6 rounded-full opacity-50"></div>
          <p className="text-[#A1F6E2] text-[10px] font-black uppercase tracking-[0.4em] mb-2">Biometric Initialization</p>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-tight">Calibrate Your<br/>Performance Node</h1>
          <p className="text-slate-500 text-xs mt-6 leading-relaxed max-w-[280px] mx-auto font-medium">Synchronizing elite AI models with your unique physiological metrics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-[#111] border border-white/5 p-8 rounded-[3rem] space-y-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            {/* Age Field */}
            <div className="relative group">
              <p className="absolute -top-3 left-6 bg-[#111] px-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] z-20 transition-colors group-focus-within:text-[#A1F6E2]">Chronological Age</p>
              <input 
                type="number" 
                required
                value={data.age}
                onChange={(e) => setData({ ...data, age: e.target.value })}
                placeholder="Years"
                className="w-full h-18 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-[#A1F6E2]/50 transition-all text-white placeholder:text-slate-700 focus:bg-white/[0.06]"
              />
            </div>

            {/* Height Field */}
            <div className="relative group">
              <p className="absolute -top-3 left-6 bg-[#111] px-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] z-20 transition-colors group-focus-within:text-[#A1F6E2]">Stature (Height)</p>
              <input 
                type="text" 
                required
                value={data.height}
                onChange={(e) => setData({ ...data, height: e.target.value })}
                placeholder="e.g. 185 cm or 6'1''"
                className="w-full h-18 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-[#A1F6E2]/50 transition-all text-white placeholder:text-slate-700 focus:bg-white/[0.06]"
              />
            </div>

            {/* Weight Field */}
            <div className="relative group">
              <p className="absolute -top-3 left-6 bg-[#111] px-2 text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] z-20 transition-colors group-focus-within:text-[#A1F6E2]">Mass (Weight)</p>
              <input 
                type="text" 
                required
                value={data.weight}
                onChange={(e) => setData({ ...data, weight: e.target.value })}
                placeholder="e.g. 85 kg or 187 lbs"
                className="w-full h-18 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-[#A1F6E2]/50 transition-all text-white placeholder:text-slate-700 focus:bg-white/[0.06]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full h-22 bg-[#A1F6E2] text-black rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] italic flex items-center justify-center gap-4 active:scale-95 transition-all shadow-[0_25px_50px_-12px_rgba(161,246,226,0.3)] hover:brightness-110"
          >
            Finalize Profile
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </form>
        
        <div className="mt-12 text-center">
          <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            End-to-End Encryption Enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
