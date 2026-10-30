import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'cockpit' | 'credits' | 'slots' | 'sandbox' | 'userscript' | 'reverse';
  setActiveTab: (tab: 'cockpit' | 'credits' | 'slots' | 'sandbox' | 'userscript' | 'reverse') => void;
  isArmed: boolean;
  setIsArmed: (val: boolean) => void;
  onOpenUserscript: () => void;
  onQuickFire: () => void;
  hoursCompleted: number;
  totalTargetHours: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isArmed,
  setIsArmed,
  onOpenUserscript,
  onQuickFire,
  hoursCompleted,
  totalTargetHours,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-black/90 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs tracking-wider">
            WPU
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Mit wpu sports sniper 3000
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('cockpit')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'cockpit'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            Command Cockpit
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'credits'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span>30-Hour Credit Tracker</span>
            <span className="font-mono text-xs text-zinc-300 font-bold tabular-nums">
              ({hoursCompleted}/{totalTargetHours}h)
            </span>
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'slots'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            Court Slot Matrix
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'sandbox'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            Sandbox Drop Test
          </button>
          <button
            onClick={() => setActiveTab('reverse')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'reverse'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span>Reverse Engineer</span>
          </button>
          <button
            onClick={() => setActiveTab('userscript')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'userscript'
                ? 'text-white border-b-2 border-white font-semibold'
                : 'hover:text-white'
            }`}
          >
            <span>Userscript</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Arming State */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsArmed(!isArmed)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md border transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isArmed
                ? 'bg-zinc-900 border-zinc-600 text-white hover:bg-zinc-800'
                : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isArmed ? 'text-white' : 'text-zinc-500'}`} />
            <span>{isArmed ? 'Sniper Armed' : 'Sniper Standby'}</span>
          </button>

          <button
            onClick={onQuickFire}
            className="px-3.5 py-1.5 text-xs font-bold rounded-md bg-white hover:bg-zinc-200 text-black transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Test Burst</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-800 px-2 py-2 text-xs bg-black">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`py-1 px-2 rounded ${activeTab === 'cockpit' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          Cockpit
        </button>
        <button
          onClick={() => setActiveTab('credits')}
          className={`py-1 px-2 rounded ${activeTab === 'credits' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          30h Tracker
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`py-1 px-2 rounded ${activeTab === 'slots' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          Slots
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`py-1 px-2 rounded ${activeTab === 'sandbox' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          Sandbox
        </button>
        <button
          onClick={() => setActiveTab('reverse')}
          className={`py-1 px-2 rounded ${activeTab === 'reverse' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          Reverse
        </button>
        <button
          onClick={() => setActiveTab('userscript')}
          className={`py-1 px-2 rounded ${activeTab === 'userscript' ? 'text-white font-bold bg-zinc-900' : 'text-zinc-400'}`}
        >
          Script
        </button>
      </div>
    </header>
  );
};
