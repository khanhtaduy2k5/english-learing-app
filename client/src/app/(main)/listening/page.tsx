"use client";

import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api";
import RadioStationCard from "@/components/RadioStationCard";

interface RadioStation {
  name: string;
  url: string;
  favicon: string;
  country: string;
  tags: string;
}

export default function ListeningPage() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [activeStationIdx, setActiveStationIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function loadRadio() {
      try {
        const data = await apiClient.getEnglishRadioStations();
        setStations(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load radio stations:", err);
        setErrorMsg("Failed to connect to the radio database. Please check your connection.");
        setLoading(false);
      }
    }
    loadRadio();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && stations[activeStationIdx]) {
      const targetUrl = stations[activeStationIdx].url;
      if (audio.src !== targetUrl) {
        audio.src = targetUrl;
      }
      audio.volume = volume;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Playback interrupted or blocked by browser:", err);
          setIsPlaying(false);
          setErrorMsg("Autoplay blocked or stream is offline. Please click Play to try again.");
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, activeStationIdx, stations, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (stations.length === 0) return;
    setErrorMsg(null);
    setIsPlaying(!isPlaying);
  };

  const handleStationChange = (idx: number) => {
    setErrorMsg(null);
    setActiveStationIdx(idx);
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 200);
    } else {
      setIsPlaying(true);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Connecting to World Radio Channels...</p>
      </div>
    );
  }

  const currentStation = stations[activeStationIdx];

  return (
    <div className="p-4 md:p-8 min-h-screen max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-900/20 to-background border border-indigo-500/20 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 animate-bounce">
          🎧 Live Audio Learning
        </span>
        
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          English <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Radio Station Hub</span> 📻
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base leading-relaxed">
          Improve your English listening skills, vocabulary, and pronunciation by listening to real-time English radio channels worldwide. Select a station and dive into native conversations!
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium flex items-center gap-3">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Premium Interactive Audio Player Control (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            {/* Spinning Album/Radio CD */}
            <div className="relative mb-8 group select-none">
              <div 
                className={`w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-1 shadow-2xl relative flex items-center justify-center transition-transform duration-500 ${
                  isPlaying ? "animate-spin" : "scale-[0.98]"
                }`}
                style={{ animationDuration: "12s" }}
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden border border-white/10">
                  <div className="absolute inset-2 rounded-full border border-white/5"></div>
                  <div className="absolute inset-6 rounded-full border border-white/5"></div>
                  <div className="absolute inset-12 rounded-full border border-white/5"></div>
                  
                  {/* Station Logo / Favicon */}
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl shadow-inner border border-white/10 z-10 animate-pulse">
                    {currentStation?.favicon ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={currentStation.favicon} 
                        alt="" 
                        className="w-full h-full object-cover rounded-full" 
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} 
                      />
                    ) : (
                      "📻"
                    )}
                  </div>
                </div>
              </div>
              
              {/* Spinning active radar rings */}
              {isPlaying && (
                <>
                  <span className="absolute -inset-2 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: "2s" }}></span>
                  <span className="absolute -inset-4 rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: "3s" }}></span>
                </>
              )}
            </div>

            {/* Station details */}
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider mb-2">
              {currentStation?.country || "Global"} Channel
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1">
              {currentStation?.name || "Select a Station"}
            </h2>
            <p className="text-slate-500 text-xs font-semibold tracking-wide uppercase mb-6">
              {currentStation?.tags || "News • Conversations • Live"}
            </p>

            {/* Visualizer bars */}
            <div className="flex items-end gap-1.5 h-10 mb-8 select-none">
              {[
                { delay: "0.1s", height: "h-2/5", activeHeight: "h-5/6" },
                { delay: "0.3s", height: "h-3/5", activeHeight: "h-full" },
                { delay: "0.5s", height: "h-1/5", activeHeight: "h-2/3" },
                { delay: "0.2s", height: "h-4/5", activeHeight: "h-4/5" },
                { delay: "0.6s", height: "h-2/5", activeHeight: "h-full" },
                { delay: "0.4s", height: "h-3/5", activeHeight: "h-3/5" },
                { delay: "0.7s", height: "h-1/5", activeHeight: "h-5/6" },
              ].map((bar, i) => (
                <span 
                  key={i} 
                  className={`w-1.5 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ${
                    isPlaying ? `animate-[bounce_0.8s_infinite] ${bar.activeHeight}` : bar.height
                  }`}
                  style={{ animationDelay: isPlaying ? bar.delay : "0s" }}
                ></span>
              ))}
            </div>

            {/* Audio Controllers Panel */}
            <div className="w-full space-y-6 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
              
              {/* Play Pause Trigger */}
              <button
                onClick={togglePlay}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 mx-auto ${
                  isPlaying 
                    ? "bg-rose-500 text-white hover:bg-rose-400 shadow-rose-500/25" 
                    : "bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/25 hover:translate-y-[-1px]"
                }`}
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 pl-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Volume Controller Slider */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <span className="text-muted-foreground">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:bg-white/20 transition-all"
                />
                <span className="text-xs font-semibold text-slate-400 w-8 text-right select-none">
                  {Math.round(volume * 100)}%
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Radio Channels Database List (7/12 width) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🌐</span> English Stations Directory ({stations.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
            {stations.map((st, i) => (
              <RadioStationCard
                key={i}
                station={st}
                isCurrent={activeStationIdx === i}
                isPlaying={isPlaying}
                onClick={() => handleStationChange(i)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
