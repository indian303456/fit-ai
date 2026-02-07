
import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { analyzeFood, generateDietPlan, generateWorkoutPlan } from '../services/geminiService';
import { database } from '../services/databaseService';
import { AnalysisResult, DietPlan, WorkoutPlan, HistoryItem, UserBiometrics } from '../types';
import LiveCoach from './LiveCoach';
import DoubtSolver from './DoubtSolver';

const MACRO_COLORS = {
  protein: '#C7D2FE',
  carbs: '#A1F6E2',
  fats: '#FDE68A'
};

interface DashboardProps {
  activeTab: string;
  userBiometrics?: UserBiometrics;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTab, userBiometrics }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = database.getHistory();
    setHistory(saved);
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history].slice(0, 10);
    setHistory(newHistory);
    database.saveHistory(newHistory);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await analyzeFood(image);
      setResult(res);
      if (res.isFood) {
        saveToHistory({
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageData: image,
          result: res
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateDiet = async () => {
    setLoading(true);
    try {
      const res = await generateDietPlan(`High Performance & Shredding for a ${userBiometrics?.age} year old athlete.`);
      setDietPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateWorkout = async () => {
    setLoading(true);
    try {
      const res = await generateWorkoutPlan("Advanced", `Explosive Power. Current Weight: ${userBiometrics?.weight}`);
      setWorkoutPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (activeTab === 'home') {
    const bodyCompData = [
      { name: 'Active', value: 82 },
      { name: 'Remaining', value: 18 },
    ];

    const weeklyProgress = [
      { day: 'MON', cal: 2100 },
      { day: 'TUE', cal: 2400 },
      { day: 'WED', cal: 1800 },
      { day: 'THU', cal: 2200 },
      { day: 'FRI', cal: 2600 },
      { day: 'SAT', cal: 2300 },
      { day: 'SUN', cal: 2500 },
    ];

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Elite Banner */}
        <div className="relative h-60 rounded-[3rem] overflow-hidden group glow-green">
          <img 
            src="https://images.unsplash.com/photo-1548690312-e3b507d17a4d?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-10 flex flex-col justify-end">
            <p className="text-[#A1F6E2] text-xs font-black uppercase tracking-[0.3em] mb-2">Phase 02 Training</p>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Limitless<br/>Potential</h1>
          </div>
        </div>

        {/* Live Coach Feature */}
        <LiveCoach />

        {/* Weekly Activity Chart Refined */}
        <div className="bg-[#111] rounded-[3rem] p-10 border border-white/5 group transition-all hover:bg-[#151515]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black tracking-tight italic">Burn History</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Daily Caloric Output</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyProgress}>
                <Tooltip 
                  cursor={{ fill: 'rgba(161,246,226,0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black border border-white/10 p-3 rounded-2xl shadow-2xl">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{payload[0].payload.day}</p>
                          <p className="text-sm font-black text-[#A1F6E2] italic">{payload[0].value} KCAL</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="cal" 
                  fill="url(#barGradient)" 
                  radius={[10, 10, 10, 10]} 
                  barSize={24}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A1F6E2" />
                    <stop offset="100%" stopColor="#A1F6E2" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Composition Refined */}
        <div className="bg-[#111] rounded-[3rem] p-10 border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#A1F6E2]/5 blur-[100px] rounded-full"></div>
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-xl font-black tracking-tight italic">Biometric Stats</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Sensor Sync</p>
            </div>
            <div className="bg-[#A1F6E2]/10 text-[#A1F6E2] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 animate-float">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bodyCompData}
                    cx="50%"
                    cy="50%"
                    innerRadius={95}
                    outerRadius={115}
                    startAngle={90}
                    endAngle={450}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#A1F6E2" className="drop-shadow-[0_0_15px_rgba(161,246,226,0.5)]" />
                    <Cell fill="#1e293b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black italic tracking-tighter">82%</span>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Goal Depth</span>
              </div>
            </div>
            
            <div className="mt-16 w-full grid grid-cols-3 gap-6">
                 <div className="text-center group/item">
                   <p className="text-2xl font-black italic mb-1 group-hover/item:text-[#A1F6E2] transition-colors">{userBiometrics?.weight?.split(' ')[0] || '85'}</p>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Weight</p>
                 </div>
                 <div className="text-center group/item">
                   <p className="text-2xl font-black italic mb-1 group-hover/item:text-[#C7D2FE] transition-colors">14.5%</p>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Body Fat</p>
                 </div>
                 <div className="text-center group/item">
                   <p className="text-2xl font-black italic mb-1 group-hover/item:text-white transition-colors">{userBiometrics?.height?.split(' ')[0] || '185'}</p>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Height</p>
                 </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'nutrition') {
    const macroData = result ? [
      { name: 'Protein', value: result.total.protein, fill: MACRO_COLORS.protein },
      { name: 'Carbs', value: result.total.carbs, fill: MACRO_COLORS.carbs },
      { name: 'Fats', value: result.total.fats, fill: MACRO_COLORS.fats },
    ] : [];

    return (
      <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000">
        <div className="bg-[#111] border border-white/5 rounded-[3.5rem] p-12 relative overflow-hidden group glow-green">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A1F6E2] to-transparent opacity-40"></div>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-black tracking-tighter italic">NUTRITION AI</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Visual Macro Extraction</p>
            </div>
          </div>
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative aspect-square rounded-[3rem] border-2 border-dashed border-white/5 bg-black flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[#A1F6E2]/40"
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className="text-center p-12 flex flex-col items-center">
                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/10">
                  <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <p className="text-sm text-slate-400 font-black uppercase tracking-[0.4em] mb-2">Upload Meal</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>

          <div className="mt-12 space-y-6">
            <button 
              disabled={!image || loading}
              onClick={onAnalyze}
              className={`w-full h-24 rounded-[2rem] text-black font-black text-xl italic tracking-tighter transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 ${!image || loading ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' : 'bg-[#A1F6E2] shadow-[#A1F6E2]/20 hover:scale-[1.02]'}`}
            >
              {loading ? 'EXTRACTING...' : 'IDENTIFY DATA'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-[#A1F6E2] rounded-[3.5rem] p-12 text-black space-y-12 shadow-[0_30px_100px_rgba(161,246,226,0.2)] animate-in fade-in zoom-in duration-700">
            <div className="flex justify-between items-end border-b-4 border-black/5 pb-10">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.3em] opacity-40 mb-3">Total Intake</p>
                <h3 className="text-7xl font-black italic tracking-tighter">{result.total.calories}<span className="text-xl ml-2 not-italic">KCAL</span></h3>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6 w-full">
              {[
                { label: 'Prot', val: result.total.protein, icon: '🥩', color: MACRO_COLORS.protein },
                { label: 'Carb', val: result.total.carbs, icon: '🥑', color: MACRO_COLORS.carbs },
                { label: 'Fats', val: result.total.fats, icon: '🥜', color: MACRO_COLORS.fats }
              ].map((m, i) => (
                <div key={i} className="bg-black p-6 rounded-[2.2rem] text-center border border-white/10 flex flex-col items-center">
                  <span className="text-2xl mb-3">{m.icon}</span>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">{m.label}</p>
                  <p className="text-2xl font-black italic" style={{ color: m.color }}>{m.val}g</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'doubt') {
    return <DoubtSolver />;
  }

  if (activeTab === 'fitness') {
    return (
      <div className="space-y-12 animate-in fade-in duration-1000">
        <div className="relative aspect-[3/4] rounded-[3.5rem] bg-black border border-white/5 overflow-hidden group glow-purple">
          <img 
            src="https://images.unsplash.com/photo-1599058917233-57c0e88cfc2b?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-12 flex flex-col justify-end">
            <h1 className="text-8xl font-black italic tracking-tighter leading-[0.8] mb-12 text-white">PRIME<br/>STRENGTH</h1>
            <button 
              onClick={onGenerateWorkout}
              disabled={loading}
              className="w-full h-24 rounded-full bg-white text-black font-black text-xl italic tracking-tighter active:scale-95 transition-all shadow-2xl flex items-center justify-center"
            >
              {loading ? 'CALIBRATING...' : 'INJECT PROGRAM'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Bio-Profile</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Verified Athlete Identity</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#A1F6E2]/5 blur-3xl rounded-full"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Physical Metrics</p>
            
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">Chronological Age</span>
                <span className="text-2xl font-black italic text-[#A1F6E2]">{userBiometrics?.age} <span className="text-[10px] not-italic opacity-50">YRS</span></span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">Total Stature (Height)</span>
                <span className="text-2xl font-black italic text-[#C7D2FE]">{userBiometrics?.height}</span>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-sm font-bold text-slate-400">Current Mass (Weight)</span>
                <span className="text-2xl font-black italic text-white">{userBiometrics?.weight}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#A1F6E2]/10 flex items-center justify-center text-[#A1F6E2]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-wider">Bio-Data Encrypted</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Metrics synced with training AI</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
