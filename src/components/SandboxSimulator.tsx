import React, { useState, useEffect, useRef } from 'react';
import { SniperConfig } from '../types';
import { Play, RotateCcw, Zap, Timer, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SandboxSimulatorProps {
  config: SniperConfig;
  onSimulatedBookingSuccess: (court: string, time: string, latency: number) => void;
}

export const SandboxSimulator: React.FC<SandboxSimulatorProps> = ({
  config,
  onSimulatedBookingSuccess,
}) => {
  const [phase, setPhase] = useState<'idle' | 'countdown' | 'dropped' | 'completed'>('idle');
  const [simulatedCountdown, setSimulatedCountdown] = useState<number>(5000); // 5 seconds
  const [mode, setMode] = useState<'bot' | 'human'>('bot');
  const [latencyResult, setLatencyResult] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<{
    success: boolean;
    message: string;
    court?: string;
    reactionMs?: number;
  } | null>(null);

  // Simulated portal slots
  const [simSlots, setSimSlots] = useState([
    { id: 'sim_b1', name: 'Badminton Court 1', time: '17:00-18:00', status: 'locked' },
    { id: 'sim_b2', name: 'Badminton Court 2', time: '17:00-18:00', status: 'locked' },
    { id: 'sim_b3', name: 'Badminton Court 3', time: '18:00-19:00', status: 'locked' },
    { id: 'sim_tt1', name: 'Table Tennis Table 1', time: '17:00-18:00', status: 'locked' },
    { id: 'sim_tt2', name: 'Table Tennis Table 2', time: '18:00-19:00', status: 'locked' },
  ]);

  const dropStartTimeRef = useRef<number>(0);

  // Countdown timer in ms
  useEffect(() => {
    let timerId: any;
    if (phase === 'countdown') {
      const intervalMs = 20;
      timerId = setInterval(() => {
        setSimulatedCountdown((prev) => {
          if (prev <= intervalMs) {
            clearInterval(timerId);
            triggerDrop();
            return 0;
          }
          return prev - intervalMs;
        });
      }, intervalMs);
    }
    return () => clearInterval(timerId);
  }, [phase]);

  const startSimulation = () => {
    setOutcome(null);
    setLatencyResult(null);
    setSimulatedCountdown(5000);
    setPhase('countdown');
    setSimSlots((prev) => prev.map((s) => ({ ...s, status: 'locked' })));
  };

  const resetSimulation = () => {
    setPhase('idle');
    setOutcome(null);
    setLatencyResult(null);
    setSimulatedCountdown(5000);
    setSimSlots((prev) => prev.map((s) => ({ ...s, status: 'locked' })));
  };

  const triggerDrop = () => {
    setPhase('dropped');
    dropStartTimeRef.current = performance.now();

    // Unlock slots for booking
    setSimSlots((prev) => prev.map((s) => ({ ...s, status: 'open' })));

    if (mode === 'bot') {
      // Simulate Bot execution speed with pre-fire compensation (45ms - 85ms)
      const simulatedBotLatency = Math.floor(45 + Math.random() * 45);
      setTimeout(() => {
        const targetCourt = 'Badminton Court 2';
        const targetTime = '17:00-18:00';

        setSimSlots((prev) =>
          prev.map((s) =>
            s.name === targetCourt ? { ...s, status: 'sniped_by_bot' } : { ...s, status: 'taken_by_others' }
          )
        );

        setLatencyResult(simulatedBotLatency);
        setOutcome({
          success: true,
          message: `Slot secured! The bot fired ${config.burstCount} concurrent requests with -${config.preFireOffsetMs}ms pre-trigger offset.`,
          court: targetCourt,
          reactionMs: simulatedBotLatency,
        });
        setPhase('completed');

        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#71717a'],
        });

        onSimulatedBookingSuccess(targetCourt, targetTime, simulatedBotLatency);
      }, simulatedBotLatency);
    } else {
      // Human mode: other bots will take all slots in 350ms
      setTimeout(() => {
        setSimSlots((prev) =>
          prev.map((s) => (s.status === 'open' ? { ...s, status: 'taken_by_others' } : s))
        );
      }, 350);
    }
  };

  const handleHumanClickSlot = (slotName: string) => {
    if (phase !== 'dropped' || mode !== 'human') return;

    const reactionTime = Math.round(performance.now() - dropStartTimeRef.current);
    setLatencyResult(reactionTime);

    if (reactionTime < 350) {
      setOutcome({
        success: true,
        message: `Insane human reflexes! You clicked in ${reactionTime}ms before other bots.`,
        court: slotName,
        reactionMs: reactionTime,
      });
      setSimSlots((prev) =>
        prev.map((s) => (s.name === slotName ? { ...s, status: 'sniped_by_bot' } : s))
      );
      setPhase('completed');
    } else {
      setOutcome({
        success: false,
        message: `Too slow! You clicked in ${reactionTime}ms, but other campus bots took the slot in ~120ms. Use the automated sniper!`,
        court: slotName,
        reactionMs: reactionTime,
      });
      setPhase('completed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card - Modern Monochromatic */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span>Sandbox Environment</span>
              <span aria-hidden="true">·</span>
              <span>MIT-WPU Courtside Simulation</span>
              <span aria-hidden="true">·</span>
              <span>Latency Benchmark</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Practice Slot Drop Simulator
            </h2>
            <p className="text-xs text-zinc-400">
              Experience the exact high-stress drop condition. Test whether a human can manually outclick the automated bot when badminton courts unlock.
            </p>
          </div>

          {/* Mode Switcher & Start Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex items-center p-1 bg-black rounded-lg border border-zinc-800 text-xs">
              <button
                onClick={() => {
                  setMode('bot');
                  resetSimulation();
                }}
                className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
                  mode === 'bot'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Sniper Bot</span>
              </button>
              <button
                onClick={() => {
                  setMode('human');
                  resetSimulation();
                }}
                className={`px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1.5 ${
                  mode === 'human'
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Manual Human Click</span>
              </button>
            </div>

            {phase === 'idle' ? (
              <button
                onClick={startSimulation}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start 5s Drop Countdown</span>
              </button>
            ) : (
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sandbox</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Arena */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <div className="bg-black border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                  Simulated Portal Status:
                </span>
                <span className="font-mono text-xs font-semibold text-white">
                  {phase === 'idle' && 'Waiting to start'}
                  {phase === 'countdown' && 'Counting down to release...'}
                  {phase === 'dropped' && 'SLOTS UNLOCKED! FIRING!'}
                  {phase === 'completed' && 'Drop Complete'}
                </span>
              </div>

              {/* Countdown clock in ms */}
              <div className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                {(simulatedCountdown / 1000).toFixed(2)}s
              </div>
            </div>

            {/* Instruction Banner */}
            {mode === 'human' && phase === 'countdown' && (
              <div className="mb-4 p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200">
                Get ready! When the timer hits 0.00s, click on <span className="font-bold underline text-white">Badminton Court 2</span> as fast as humanly possible!
              </div>
            )}

            {mode === 'bot' && phase === 'countdown' && (
              <div className="mb-4 p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-200">
                Bot is armed! It will automatically fire concurrent HTTP bursts with {config.preFireOffsetMs}ms pre-fire compensation the moment the clock strikes zero.
              </div>
            )}

            {/* Simulated Court Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {simSlots.map((slot) => {
                const isLocked = slot.status === 'locked';
                const isOpen = slot.status === 'open';
                const isSniped = slot.status === 'sniped_by_bot';
                const isTaken = slot.status === 'taken_by_others';

                return (
                  <div
                    key={slot.id}
                    onClick={() => handleHumanClickSlot(slot.name)}
                    className={`p-4 rounded-lg border transition-all ${
                      isOpen
                        ? 'bg-white text-black border-white cursor-pointer scale-[1.02] shadow-lg'
                        : isSniped
                        ? 'bg-zinc-800 border-zinc-500 text-white'
                        : isTaken
                        ? 'bg-zinc-950/40 border-zinc-900 opacity-50 text-zinc-500'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold text-sm ${isOpen ? 'text-black' : 'text-zinc-200'}`}>{slot.name}</span>
                      <span className={`font-mono text-xs ${isOpen ? 'text-zinc-700 font-bold' : 'text-zinc-400'}`}>{slot.time}</span>
                    </div>

                    <div className={`flex items-center justify-between mt-3 pt-2 text-xs border-t ${isOpen ? 'border-zinc-300' : 'border-zinc-800/80'}`}>
                      <span className={isOpen ? 'text-zinc-700' : 'text-zinc-400'}>Status:</span>
                      {isLocked && <span className="text-zinc-500 font-mono">LOCKED</span>}
                      {isOpen && (
                        <span className="text-black font-black font-mono tracking-wider">CLICK TO BOOK NOW</span>
                      )}
                      {isSniped && (
                        <span className="text-white font-bold font-mono">
                          ✓ SECURED ({latencyResult}ms)
                        </span>
                      )}
                      {isTaken && (
                        <span className="text-zinc-500 font-mono">TAKEN (FULL)</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Outcome Result Card */}
            {outcome && (
              <div
                className="mt-5 p-4 rounded-lg border border-zinc-700 bg-zinc-900 text-white flex items-start gap-3"
              >
                {outcome.success ? (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {outcome.success ? 'Booking Successful!' : 'Booking Missed!'}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed text-zinc-300">{outcome.message}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs font-mono">
                    <span>
                      Reaction / Latency: <strong className="text-white">{outcome.reactionMs}ms</strong>
                    </span>
                    {outcome.court && (
                      <span>
                        Venue: <strong className="text-white">{outcome.court}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Latency Comparison Card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
        <h3 className="font-semibold text-white text-sm mb-2">
          Why MIT-WPU Courtside Slots Disappear in Seconds
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
          <div className="bg-black border border-zinc-800 rounded-lg p-3">
            <span className="font-bold text-zinc-400 block mb-1">Human Reaction Time</span>
            <span className="font-mono text-xl text-white block font-bold tabular-nums">
              1,200ms - 2,500ms
            </span>
            <p className="mt-1 text-zinc-500">
              A human requires 250ms to see the button change, 400ms to move the cursor, and 800ms to click confirmation. By then, slots are already gone.
            </p>
          </div>

          <div className="bg-black border border-zinc-800 rounded-lg p-3">
            <span className="font-bold text-zinc-300 block mb-1">Other Students' Scripts</span>
            <span className="font-mono text-xl text-white block font-bold tabular-nums">
              150ms - 350ms
            </span>
            <p className="mt-1 text-zinc-500">
              Dozens of senior engineering students already use basic scripts. They capture the easiest badminton slots within 200 milliseconds.
            </p>
          </div>

          <div className="bg-black border border-zinc-800 rounded-lg p-3">
            <span className="font-bold text-white block mb-1">Your Courtside Sniper</span>
            <span className="font-mono text-xl text-white block font-bold tabular-nums">
              45ms - 85ms
            </span>
            <p className="mt-1 text-zinc-400">
              Pre-fire timing compensation combined with asynchronous 3x burst guarantees your packet reaches the server precisely when the table unlocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
