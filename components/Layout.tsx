
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Home' },
    { id: 'nutrition', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Fuel' },
    { id: 'doubt', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', label: 'Expert' },
    { id: 'fitness', icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: 'Gains' },
    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Bio' }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#A1F6E2]/30">
      {/* Dynamic Header */}
      <header className="px-8 py-10 flex items-center justify-between sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#A1F6E2] to-[#C7D2FE] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-0.5">Performance Tier</p>
            <h2 className="text-xl font-black italic tracking-tight">JANE DOE</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              Logout
            </button>
          )}
          <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors">
            <div className="flex flex-col gap-1.5 items-end">
              <div className="w-6 h-0.5 bg-white/40 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40 rounded-full"></div>
            </div>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pb-40 pt-6 px-8 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <nav className="h-20 glass-card rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-14 h-14 group"
            >
              <div className={`flex items-center justify-center w-full h-full rounded-2xl transition-all duration-500 ${activeTab === item.id ? 'text-black' : 'text-slate-500 group-hover:text-white'}`}>
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-[#A1F6E2] rounded-2xl scale-110 shadow-[0_10px_30px_rgba(161,246,226,0.3)] animate-in zoom-in duration-300"></div>
                )}
                <svg className="relative w-6 h-6 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon}></path>
                </svg>
              </div>
              <span className={`absolute -bottom-1 text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${activeTab === item.id ? 'opacity-100 text-[#A1F6E2]' : 'opacity-0'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
