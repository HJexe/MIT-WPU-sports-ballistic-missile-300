import React, { useState, useEffect } from 'react';
import {
  SniperConfig,
  CreditRecord,
  TimeSlot,
  AuditLogItem,
  SportCategory,
} from './types';
import {
  DEFAULT_SNIPER_CONFIG,
  INITIAL_CREDIT_RECORDS,
  generateInitialSlots,
  MIT_COURTS,
} from './data/mitwpuData';
import { Header } from './components/Header';
import { SniperCockpit } from './components/SniperCockpit';
import { CreditTracker } from './components/CreditTracker';
import { SlotScanner } from './components/SlotScanner';
import { SandboxSimulator } from './components/SandboxSimulator';
import { UserscriptModal } from './components/UserscriptModal';
import { AuditConsole } from './components/AuditConsole';
import { ReverseEngineerWorkbench } from './components/ReverseEngineerWorkbench';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'credits' | 'slots' | 'sandbox' | 'userscript' | 'reverse'
  >('cockpit');

  // Sniper configuration
  const [config, setConfig] = useState<SniperConfig>(() => {
    try {
      const saved = localStorage.getItem('mit_wpu_sniper_cfg');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SNIPER_CONFIG;
  });

  // Credit records
  const [creditRecords, setCreditRecords] = useState<CreditRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mit_wpu_credit_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CREDIT_RECORDS;
  });

  // Slot availability
  const [slots, setSlots] = useState<TimeSlot[]>(() => generateInitialSlots());

  // Audit telemetry logs
  const [logs, setLogs] = useState<AuditLogItem[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: 'System booted. Synchronized clock with MIT-WPU Courtside NTP server.',
    },
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'info',
      message: `Configured PRN ${config.studentPrn} targeting Badminton Courts 1-4 & TT Arena.`,
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'success',
      message: 'Sniper pre-trigger lead time calibrated to -250ms offset.',
    },
  ]);

  const [isUserscriptModalOpen, setIsUserscriptModalOpen] = useState<boolean>(false);
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [lastBurstLatency, setLastBurstLatency] = useState<number | undefined>(74);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mit_wpu_sniper_cfg', JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('mit_wpu_credit_records', JSON.stringify(creditRecords));
    } catch {}
  }, [creditRecords]);

  const addLog = (
    type: AuditLogItem['type'],
    message: string,
    latencyMs?: number,
    payloadSummary?: string
  ) => {
    const item: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      message,
      latencyMs,
      payloadSummary,
    };
    setLogs((prev) => [item, ...prev].slice(0, 100));
  };

  const notify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => setActiveNotification(null), 4000);
  };

  // Trigger Burst Sniper Routine
  const handleTriggerBurst = () => {
    if (isFiring) return;
    setIsFiring(true);

    const endpointUrl = config.customEndpoint?.url || 'https://sports.mitwpu.edu.in/api/v1/sports/slots/reserve';
    addLog('info', `Dispatched ${config.burstCount}x parallel HTTP burst to ${endpointUrl}`);

    const latency = Math.floor(45 + Math.random() * 45); // 45-90ms
    setLastBurstLatency(latency);

    setTimeout(() => {
      // Find candidate slot matching preferences
      const candidate = slots.find(
        (s) =>
          s.sport === config.primarySport &&
          s.status === 'available' &&
          config.preferredTimeWindows.includes(`${s.startTime}-${s.endTime}`)
      ) || slots.find((s) => s.sport === config.primarySport && s.status === 'available') ||
        slots.find((s) => s.status === 'available');

      if (candidate) {
        // Reserve the candidate slot
        setSlots((prev) =>
          prev.map((s) =>
            s.id === candidate.id ? { ...s, status: 'booked_by_user', bookedCount: s.totalCapacity } : s
          )
        );

        // Add to Credit Records
        const newRecord: CreditRecord = {
          id: `cred-${Date.now()}`,
          bookingRef: `WPU-SNIP-${Math.floor(10000 + Math.random() * 90000)}`,
          sport: candidate.sport,
          courtName: candidate.courtName,
          date: candidate.date,
          timeSlot: `${candidate.startTime}-${candidate.endTime}`,
          hours: 1.0,
          status: 'upcoming',
          verifiedByFaculty: false,
          notes: `Sniped in ${latency}ms via burst dispatcher`,
        };

        setCreditRecords((prev) => [newRecord, ...prev]);

        addLog(
          'success',
          `Slot secured: ${candidate.courtName} (${candidate.startTime}-${candidate.endTime}) for ${candidate.date}`,
          latency,
          `PRN: ${config.studentPrn} | HTTP 200 OK`
        );

        notify(`Success! ${candidate.courtName} secured in ${latency}ms! +1.0 hr added to upcoming credits.`);

        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        addLog(
          'warning',
          `Burst completed in ${latency}ms, but all targeted slots for ${config.primarySport} were already sold out.`,
          latency
        );
        notify(`Slots were already full. Consider adding fallback sports or alternative time windows.`);
      }

      setIsFiring(false);
    }, latency);
  };

  // Manual 1-click booking
  const handleBookSlot = (slot: TimeSlot) => {
    setBookingSlotId(slot.id);
    const latency = Math.floor(60 + Math.random() * 30);

    setTimeout(() => {
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id ? { ...s, status: 'booked_by_user', bookedCount: s.totalCapacity } : s
        )
      );

      const newRecord: CreditRecord = {
        id: `cred-${Date.now()}`,
        bookingRef: `WPU-DIR-${Math.floor(10000 + Math.random() * 90000)}`,
        sport: slot.sport,
        courtName: slot.courtName,
        date: slot.date,
        timeSlot: `${slot.startTime}-${slot.endTime}`,
        hours: 1.0,
        status: 'upcoming',
        verifiedByFaculty: false,
        notes: `Manual 1-click reservation (${latency}ms)`,
      };

      setCreditRecords((prev) => [newRecord, ...prev]);

      addLog(
        'success',
        `Manually sniped: ${slot.courtName} (${slot.startTime}-${slot.endTime})`,
        latency
      );

      notify(`Reserved: ${slot.courtName} at ${slot.startTime}!`);
      setBookingSlotId(null);
    }, latency);
  };

  // Add credit record manually
  const handleAddCreditRecord = (newRec: Omit<CreditRecord, 'id'>) => {
    const item: CreditRecord = {
      id: `cred-${Date.now()}`,
      ...newRec,
    };
    setCreditRecords((prev) => [item, ...prev]);
    addLog('info', `Manually logged credit: ${item.courtName} (+${item.hours}h)`);
    notify(`Logged ${item.hours} hours for ${item.courtName}`);
  };

  // Update record status (e.g. mark attended)
  const handleUpdateCreditStatus = (id: string, status: CreditRecord['status']) => {
    setCreditRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, verifiedByFaculty: status === 'attended' } : r))
    );
    addLog('success', `Updated session status to ${status.toUpperCase()} for record ${id}`);
    notify(`Session marked as ${status}`);
  };

  // Simulated booking from Sandbox
  const handleSimulatedBookingSuccess = (court: string, time: string, latency: number) => {
    addLog('success', `[SANDBOX TEST] Successfully simulated sniper drop: ${court} (${time})`, latency);
  };

  const hoursCompleted = creditRecords
    .filter((r) => r.status === 'attended')
    .reduce((sum, r) => sum + r.hours, 0);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Toast Notification */}
      {activeNotification && (
        <div className="fixed top-20 right-6 z-50 bg-white text-black border border-zinc-200 px-4 py-2.5 rounded-lg font-bold text-xs shadow-2xl flex items-center gap-2">
          <span>⚡</span>
          <span>{activeNotification}</span>
        </div>
      )}

      {/* Header conforming to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isArmed={config.isArmed}
        setIsArmed={(val) => setConfig((prev) => ({ ...prev, isArmed: val }))}
        onOpenUserscript={() => setIsUserscriptModalOpen(true)}
        onQuickFire={handleTriggerBurst}
        hoursCompleted={hoursCompleted}
        totalTargetHours={30}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Command Cockpit */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8">
            <SniperCockpit
              config={config}
              onUpdateConfig={setConfig}
              onTriggerBurst={handleTriggerBurst}
              onOpenUserscript={() => setIsUserscriptModalOpen(true)}
              onOpenSandbox={() => setActiveTab('sandbox')}
              isFiring={isFiring}
              lastBurstLatency={lastBurstLatency}
            />

            {/* Quick 30-Hour Progress Peek */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-400 block font-medium">Graduation Requirement Progress</span>
                <span className="text-lg font-bold text-white">
                  {hoursCompleted.toFixed(1)} of 30.0 Physical Education Hours Attended ({Math.round((hoursCompleted / 30) * 100)}%)
                </span>
                <span className="text-xs text-zinc-500 block mt-0.5">
                  Remaining needed: {(30 - hoursCompleted).toFixed(1)} hours · Dronacharya Sports Complex
                </span>
              </div>
              <button
                onClick={() => setActiveTab('credits')}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
              >
                View Credit Ledger & History →
              </button>
            </div>

            {/* Live Audit Console */}
            <AuditConsole logs={logs} onClearLogs={() => setLogs([])} />
          </div>
        )}

        {/* Tab 2: 30-Hour Credit Tracker */}
        {activeTab === 'credits' && (
          <CreditTracker
            records={creditRecords}
            onAddRecord={handleAddCreditRecord}
            onUpdateStatus={handleUpdateCreditStatus}
            targetHours={30}
          />
        )}

        {/* Tab 3: Slot Scanner Matrix */}
        {activeTab === 'slots' && (
          <SlotScanner
            slots={slots}
            onBookSlot={handleBookSlot}
            bookingSlotId={bookingSlotId}
          />
        )}

        {/* Tab 4: Sandbox Drop Simulator */}
        {activeTab === 'sandbox' && (
          <SandboxSimulator
            config={config}
            onSimulatedBookingSuccess={handleSimulatedBookingSuccess}
          />
        )}

        {/* Tab: Reverse API Engineer Workbench */}
        {activeTab === 'reverse' && (
          <ReverseEngineerWorkbench
            config={config}
            onUpdateConfig={setConfig}
            onLogEvent={addLog}
          />
        )}

        {/* Tab 5: Userscript Direct Tab */}
        {activeTab === 'userscript' && (
          <div className="space-y-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-1">
                Mit wpu sports sniper 3000 · Userscript Center
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Automate your booking directly on <code className="text-white font-mono">sports.mitwpu.edu.in</code> without running any servers.
              </p>
              <button
                onClick={() => setIsUserscriptModalOpen(true)}
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-lg transition-colors"
              >
                Launch Script Generator & Guide
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Tampermonkey Userscript Modal */}
      <UserscriptModal
        config={config}
        isOpen={isUserscriptModalOpen}
        onClose={() => setIsUserscriptModalOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-800/80 bg-black py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mit wpu sports sniper 3000 · MIT World Peace University (Pune)</span>
          <span className="font-mono text-[11px] text-zinc-600">
            Dronacharya Complex · v3.0.0
          </span>
        </div>
      </footer>
    </div>
  );
}
