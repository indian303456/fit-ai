
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate a high-tech authentication delay
    setTimeout(() => {
      setIsAuthenticating(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A1F6E2] opacity-10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C7D2FE] opacity-10 blur-[120px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-1000">
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#A1F6E2] to-[#C7D2FE] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-black rounded-full p-4 border border-white/10">
              <svg className="w-10 h-10 text-[#A1F6E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0014 20.222m10.003-9.222a10.003 10.003 0 00-4.543-8.116M12 11V3m0 8c0-3.517 1.009-6.799 2.753-9.571M12 11c3.517 0 6.799-1.009 9.571-2.753M12 11c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.04l.054-.09a10.003 10.003 0 00-4.543-8.116"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">FitFeast AI</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Elite Bio-Metric Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <p className="absolute -top-3 left-4 bg-black px-2 text-[8px] font-black text-slate-500 uppercase tracking-widest z-20">Identity ID</p>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@elite.com"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-[#A1F6E2]/50 transition-all text-white placeholder:text-slate-700"
              />
            </div>
            <div className="relative group">
              <p className="absolute -top-3 left-4 bg-black px-2 text-[8px] font-black text-slate-500 uppercase tracking-widest z-20">Security Key</p>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm outline-none focus:border-[#C7D2FE]/50 transition-all text-white placeholder:text-slate-700"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full h-20 bg-white text-black rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] italic flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden relative"
          >
            {isAuthenticating ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent animate-[shimmer_2s_infinite]"></div>
                <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Authorize Access'
            )}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Forgot your credentials? <span className="text-[#A1F6E2] cursor-pointer hover:underline">Reset Node</span></p>
          <div className="h-px bg-white/5 w-1/2 mx-auto"></div>
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">By accessing this system, you agree to bio-metric data processing protocols.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
