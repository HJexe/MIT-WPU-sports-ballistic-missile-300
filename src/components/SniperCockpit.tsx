import React, { useState, useEffect } from 'react';
import { SniperConfig, SportCategory } from '../types';
import { MIT_COURTS, TIME_WINDOWS } from '../data/mitwpuData';
import { Zap, Shield, Target, Clock, Settings2, Play, CheckCircle2, ArrowRight, Eye, EyeOff, ExternalLink, Lock, Mail, Info } from 'lucide-react';

interface SniperCockpitProps {
  config: SniperConfig;
  onUpdateConfig: (newConfig: SniperConfig) => void;
  onTriggerBurst: () => void;
  onOpenUserscript: () => void;
  onOpenSandbox: () => void;
  isFiring: boolean;
  lastBurstLatency?: number;
}

export const SniperCockpit: React.FC<SniperCockpitProps> = ({
  config,
  onUpdateConfig,
  onTriggerBurst,
  onOpenUserscript,
  onOpenSandbox,
  isFiring,
  lastBurstLatency,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [countdownStr, setCountdownStr] = useState<string>('00:00:00.0');
  const [msUntilDrop, setMsUntilDrop] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Live millisecond clock update
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);

      const target = new Date();
      target.setHours(config.dropHour, config.dropMinute, config.dropSecond, 0);

      // If already past today, set to tomorrow
      if (now.getTime() > target.getTime() + 1000) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      setMsUntilDrop(diff);

      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        const tenths = Math.floor((diff % 1000) / 100);
        setCountdownStr(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`
        );
      } else {
        setCountdownStr('00:00:00.0 (RELEASED)');
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [config.dropHour, config.dropMinute, config.dropSecond]);

  const toggleCourtPreference = (courtId: string) => {
    const exists = config.preferredCourts.includes(courtId);
    let updated: string[];
    if (exists) {
      updated = config.preferredCourts.filter((c) => c !== courtId);
    } else {
      updated = [...config.preferredCourts, courtId];
    }
    onUpdateConfig({ ...config, preferredCourts: updated });
  };

  const toggleTimeWindow = (windowStr: string) => {
    const exists = config.preferredTimeWindows.includes(windowStr);
    let updated: string[];
    if (exists) {
      updated = config.preferredTimeWindows.filter((w) => w !== windowStr);
    } else {
      updated = [...config.preferredTimeWindows, windowStr];
    }
    onUpdateConfig({ ...config, preferredTimeWindows: updated });
  };

  const availableCourtsForSport = MIT_COURTS.filter(
    (c) => c.sport === config.primarySport
  );

  return (
    <div className="space-y-6">
      {/* Precision Drop Countdown HUD - Modern Monochromatic */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span>MIT-WPU Courtside Portal</span>
              <span aria-hidden="true">·</span>
              <span>Daily Slot Release</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-200 font-mono font-bold">
                {String(config.dropHour).padStart(2, '0')}:{String(config.dropMinute).padStart(2, '0')}:{String(config.dropSecond).padStart(2, '0')} IST
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Release Drop Clock & Armed Status
            </h2>
            <p className="text-xs text-zinc-400 max-w-lg">
              Pre-fire compensation sends the reservation payload {config.preFireOffsetMs}ms before the top of the second to cancel network transit latency.
            </p>
          </div>

          {/* High-visibility Monospace Countdown Display */}
          <div className="bg-black border border-zinc-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
                Time Remaining to Drop
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums tracking-tight">
                {countdownStr}
              </span>
            </div>

            <div className="h-px sm:h-10 sm:w-px bg-zinc-800" />

            <div>
              <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold block">
                Current Time (IST)
              </span>
              <span className="text-base font-mono font-medium text-zinc-300 tabular-nums">
                {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                <span className="text-xs text-zinc-500">
                  .{Math.floor(currentTime.getMilliseconds() / 100)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateConfig({ ...config, isArmed: !config.isArmed })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 ${
                config.isArmed
                  ? 'bg-zinc-900 border-zinc-600 text-white hover:bg-zinc-800'
                  : 'bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Shield className={`w-4 h-4 ${config.isArmed ? 'text-white' : 'text-zinc-500'}`} />
              <span>{config.isArmed ? 'ARMED: Ready to Auto-Fire' : 'STANDBY: Bot Disarmed'}</span>
            </button>

            <button
              onClick={onTriggerBurst}
              disabled={isFiring}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white hover:bg-zinc-200 text-black transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isFiring ? 'Firing 3x Burst...' : 'Fire Manual Burst'}</span>
            </button>

            {lastBurstLatency !== undefined && (
              <span className="text-xs font-mono text-zinc-300 tabular-nums">
                Ping: <strong className="text-white">{lastBurstLatency}ms</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={onOpenSandbox}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Practice in Sandbox Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-zinc-800">|</span>
            <button
              onClick={onOpenUserscript}
              className="text-white hover:text-zinc-300 font-semibold transition-colors underline underline-offset-4"
            >
              Get Tampermonkey Script
            </button>
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Credentials & Drop Timing */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-zinc-300" />
              <span>Courtside Login & Timing Config</span>
            </h3>
            <a
              href="https://sports.mitwpu.edu.in/login"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <span>Login Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-medium flex items-center gap-1">
                  <Mail className="w-3 h-3 text-zinc-400" />
                  <span>College Email</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">@mitwpu.edu.in</span>
              </div>
              <input
                type="email"
                value={config.collegeEmail}
                onChange={(e) => onUpdateConfig({ ...config, collegeEmail: e.target.value })}
                placeholder="your.name@mitwpu.edu.in"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-white transition-colors"
              />
              <span className="text-[11px] text-zinc-500 mt-0.5 block">
                Official MIT World Peace University student email
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-zinc-300 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-400" />
                  <span>Portal Password</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-white text-[11px] flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={config.password || ''}
                onChange={(e) => onUpdateConfig({ ...config, password: e.target.value })}
                placeholder="Enter password to auto-login if session expires"
                className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-white transition-colors"
              />
              <div className="flex items-center gap-2 mt-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-400 select-none">
                  <input
                    type="checkbox"
                    checked={config.autoLoginOnExpiry}
                    onChange={(e) => onUpdateConfig({ ...config, autoLoginOnExpiry: e.target.checked })}
                    className="rounded bg-black border-zinc-700 text-white focus:ring-0"
                  />
                  <span className="text-[11px]">Auto-authenticate on sports.mitwpu.edu.in/login</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Student PRN</label>
                <input
                  type="text"
                  value={config.studentPrn}
                  onChange={(e) => onUpdateConfig({ ...config, studentPrn: e.target.value })}
                  placeholder="1032210892"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 font-mono focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Student Name</label>
                <input
                  type="text"
                  value={config.studentName}
                  onChange={(e) => onUpdateConfig({ ...config, studentName: e.target.value })}
                  placeholder="Hrishiraj Nagawade"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Drop Hour</label>
                <select
                  value={config.dropHour}
                  onChange={(e) => onUpdateConfig({ ...config, dropHour: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 font-mono focus:outline-none focus:border-white transition-colors"
                >
                  <option value={8}>08:00 AM (Morning)</option>
                  <option value={0}>00:00 AM (Midnight)</option>
                  <option value={12}>12:00 PM (Noon)</option>
                  <option value={17}>05:00 PM (Evening)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-medium">Pre-Fire Offset</label>
                <select
                  value={config.preFireOffsetMs}
                  onChange={(e) => onUpdateConfig({ ...config, preFireOffsetMs: Number(e.target.value) })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 font-mono focus:outline-none focus:border-white transition-colors"
                >
                  <option value={100}>100ms (High-speed)</option>
                  <option value={250}>250ms (Optimal)</option>
                  <option value={400}>400ms (WiFi)</option>
                  <option value={550}>550ms (Mobile)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-300 block mb-1 font-medium">Concurrent Burst Level</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onUpdateConfig({ ...config, burstCount: lvl })}
                    className={`py-1.5 rounded text-xs font-mono font-medium border transition-colors ${
                      config.burstCount === lvl
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lvl}x Async
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Dispatches {config.burstCount} asynchronous parallel HTTP requests within 5ms
              </span>
            </div>
          </div>
        </div>

        {/* Middle Column: Target Sport Selection & Specific Courts */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-300" />
              <span>Target Sport & Court Priority</span>
            </h3>
            <span className="text-xs text-zinc-500">Dronacharya Complex</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-zinc-300 block mb-1.5 font-medium">Primary Sport</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'badminton', label: 'Badminton (Courts 1-4)' },
                  { key: 'table_tennis', label: 'Table Tennis (Tables 1-6)' },
                  { key: 'squash', label: 'Squash (Courts 1-2)' },
                  { key: 'gym', label: 'Gymnasium & Studio' },
                ].map((sp) => (
                  <button
                    key={sp.key}
                    type="button"
                    onClick={() => {
                      const sport = sp.key as SportCategory;
                      const newCourts = MIT_COURTS.filter((c) => c.sport === sport).map((c) => c.id);
                      onUpdateConfig({
                        ...config,
                        primarySport: sport,
                        preferredCourts: newCourts.slice(0, 3),
                      });
                    }}
                    className={`p-2 rounded text-left border transition-colors ${
                      config.primarySport === sp.key
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-zinc-300 block mb-1.5 font-medium">
                Preferred Court Allocation ({availableCourtsForSport.length} available)
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableCourtsForSport.map((court) => {
                  const isSelected = config.preferredCourts.includes(court.id);
                  return (
                    <div
                      key={court.id}
                      onClick={() => toggleCourtPreference(court.id)}
                      className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-600 text-white'
                          : 'bg-black border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-zinc-200 block">{court.name}</span>
                        <span className="text-[11px] text-zinc-500">{court.facility}</span>
                      </div>
                      <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-white' : 'text-zinc-600'}`}>
                        {isSelected ? 'PRIORITY' : 'SKIP'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-zinc-300 block mb-1 font-medium">Automatic Fallback Sport</label>
              <select
                value={config.fallbackSport}
                onChange={(e) => onUpdateConfig({ ...config, fallbackSport: e.target.value as any })}
                className="w-full bg-black border border-zinc-800 rounded-lg px-2.5 py-2 text-zinc-200 text-xs focus:outline-none focus:border-white transition-colors"
              >
                <option value="none">No fallback (Do not book anything else)</option>
                <option value="table_tennis">Fallback to Table Tennis</option>
                <option value="badminton">Fallback to Badminton</option>
                <option value="squash">Fallback to Squash</option>
                <option value="gym">Fallback to Gymnasium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Time Windows & Execution Strategy */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-300" />
              <span>Target Time Windows</span>
            </h3>
            <span className="text-xs text-zinc-500">1-Hour Slots</span>
          </div>

          <div className="space-y-3 text-xs">
            <p className="text-zinc-400 text-xs">
              Select time windows that suit your lecture timetable. The bot scans these slots in order of precedence:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {TIME_WINDOWS.map((win) => {
                const isSelected = config.preferredTimeWindows.includes(win);
                return (
                  <button
                    key={win}
                    type="button"
                    onClick={() => toggleTimeWindow(win)}
                    className={`py-1.5 px-2 rounded font-mono text-xs border transition-colors ${
                      isSelected
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {win}
                  </button>
                );
              })}
            </div>

            <div className="bg-black border border-zinc-800 rounded-lg p-3 space-y-1.5 mt-4">
              <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                <Info className="w-3.5 h-3.5" />
                <span>30-Hour Credit Acceleration Tip</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Evening slots (17:00–19:00) at Dronacharya fill in under 2 seconds. Having morning slots (06:00–08:00) as backups guarantees completing your 30 hours weeks ahead of semester exams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
