
import React, { useState, useRef } from 'react';
import { connectToCoach } from '../services/geminiService';
import { LiveServerMessage, Blob } from '@google/genai';

const LiveCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('READY TO CONSULT');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startSession = async () => {
    try {
      setStatus('CONNECTING...');
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;
      
      const inCtx = new AudioContext({ sampleRate: 16000 });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = connectToCoach({
        onopen: () => {
          setStatus('ZEPHYR IS LIVE');
          setIsActive(true);
          const source = inCtx.createMediaStreamSource(stream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
          source.connect(processor);
          processor.connect(inCtx.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          
          if (base64EncodedAudioString && audioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64EncodedAudioString),
              audioContextRef.current,
              24000,
              1,
            );
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.addEventListener('ended', () => {
              sourcesRef.current.delete(source);
            });
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }

          if (message.serverContent?.interrupted) {
            for (const source of sourcesRef.current.values()) {
              source.stop();
            }
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e: any) => {
          console.error('Session Error:', e);
          setStatus('COMM LINK FAILED');
          setIsActive(false);
        },
        onclose: () => {
          setStatus('READY TO CONSULT');
          setIsActive(false);
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Start Session Failed:', err);
      setStatus('ACCESS DENIED');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    setIsActive(false);
    setStatus('READY TO CONSULT');
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-8 overflow-hidden relative group transition-all hover:bg-[#151515]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C7D2FE] to-transparent opacity-30"></div>
      
      <div className={`relative w-40 h-40 rounded-full border-[6px] flex items-center justify-center transition-all duration-700 ${isActive ? 'border-[#A1F6E2] shadow-[0_0_60px_rgba(161,246,226,0.2)] scale-110' : 'border-white/5 shadow-2xl'}`}>
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#A1F6E2] text-black rotate-0' : 'bg-white/5 text-slate-700 rotate-12'}`}>
           {isActive ? (
              <div className="flex gap-1.5 items-end h-10">
                <div className="w-1.5 bg-black rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-8"></div>
                <div className="w-1.5 bg-black rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-12"></div>
                <div className="w-1.5 bg-black rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-6"></div>
                <div className="w-1.5 bg-black rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-10"></div>
              </div>
           ) : (
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
           )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{isActive ? 'SYSTEM ACTIVE' : 'AI COACH'}</h3>
        <p className={`text-[10px] font-black tracking-[0.4em] uppercase ${isActive ? 'text-[#A1F6E2]' : 'text-slate-500'}`}>{status}</p>
      </div>

      <p className="text-slate-500 text-xs max-w-xs font-medium leading-relaxed">Initiate vocal biometrics for real-time form correction and nutritional strategy.</p>
      
      <button 
        onClick={isActive ? stopSession : startSession}
        className={`w-full h-20 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-4 ${isActive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-white/5 text-[#A1F6E2] border border-[#A1F6E2]/20 hover:bg-[#A1F6E2]/10'}`}
      >
        <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500 animate-ping' : 'bg-[#A1F6E2]'}`}></span>
        {isActive ? 'SHUTDOWN' : 'CONNECT ZEPHYR'}
      </button>

      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#A1F6E2]/5 to-transparent opacity-50"></div>
          <div className="absolute -left-10 top-0 h-full w-20 bg-[#A1F6E2]/10 blur-[50px] animate-[pulse_2s_ease-in-out_infinite]"></div>
          <div className="absolute -right-10 top-0 h-full w-20 bg-[#A1F6E2]/10 blur-[50px] animate-[pulse_2s_ease-in-out_infinite_delay-1000]"></div>
        </div>
      )}
    </div>
  );
};

export default LiveCoach;
