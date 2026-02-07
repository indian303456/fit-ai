
import React, { useState, useRef, useEffect } from 'react';
import { solveDoubt } from '../services/geminiService';
import { database } from '../services/databaseService';
import { ChatMessage } from '../types';

const DoubtSolver: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChats = database.getChats();
    setMessages(savedChats);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    database.saveChats(newMessages);
    setInput('');
    setLoading(true);

    try {
      const responseText = await solveDoubt(messages, userMsg.text);
      const aiMsg: ChatMessage = { role: 'model', text: responseText };
      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);
      database.saveChats(updatedMessages);
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = { role: 'model', text: "Systems offline. Please recalibrate your request." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    database.saveChats([]);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-[#111] border border-white/5 rounded-[3.5rem] overflow-hidden relative shadow-2xl animate-in slide-in-from-bottom-12 duration-1000">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[#A1F6E2]">Expert Node</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">High-Fidelity doubt resolution</p>
        </div>
        <button 
          onClick={clearHistory}
          className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
          title="Clear History"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar"
      >
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.3em]">Awaiting Query</p>
            <p className="text-[10px] max-w-[200px] leading-relaxed">Ask anything about biomechanics, macronutrients, or peak performance.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] ${m.role === 'user' ? 'bg-[#A1F6E2] text-black rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'}`}>
              <p className="text-sm font-bold leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] rounded-tl-none flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#A1F6E2] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[#A1F6E2] rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-[#A1F6E2] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-white/5 bg-black/20 shrink-0">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input your doubt..."
            className="w-full h-16 bg-white/5 border border-white/10 rounded-[1.5rem] pl-6 pr-20 text-sm focus:ring-1 focus:ring-[#A1F6E2]/40 transition-all outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className={`absolute right-3 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${!input.trim() || loading ? 'bg-slate-800 text-slate-600' : 'bg-[#A1F6E2] text-black shadow-lg shadow-[#A1F6E2]/20 hover:scale-105'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoubtSolver;
