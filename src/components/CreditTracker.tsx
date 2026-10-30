import React, { useState } from 'react';
import { CreditRecord, SportCategory } from '../types';
import { Trophy, CheckCircle2, Clock, Calendar, Plus, Download, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreditTrackerProps {
  records: CreditRecord[];
  onAddRecord: (record: Omit<CreditRecord, 'id'>) => void;
  onUpdateStatus: (id: string, status: CreditRecord['status']) => void;
  targetHours?: number;
}

export const CreditTracker: React.FC<CreditTrackerProps> = ({
  records,
  onAddRecord,
  onUpdateStatus,
  targetHours = 30,
}) => {
  const [filterSport, setFilterSport] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New session state
  const [newSport, setNewSport] = useState<SportCategory>('badminton');
  const [newCourt, setNewCourt] = useState<string>('Badminton Court 1');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState<string>('17:00-18:00');
  const [newHours, setNewHours] = useState<number>(1.0);
  const [newStatus, setNewStatus] = useState<CreditRecord['status']>('attended');

  const attendedHours = records
    .filter((r) => r.status === 'attended')
    .reduce((sum, r) => sum + r.hours, 0);

  const upcomingHours = records
    .filter((r) => r.status === 'upcoming')
    .reduce((sum, r) => sum + r.hours, 0);

  const totalSecuredHours = attendedHours + upcomingHours;
  const remainingHours = Math.max(0, targetHours - attendedHours);
  const percentage = Math.min(100, Math.round((attendedHours / targetHours) * 100));

  // Sport distribution
  const sportCounts: Record<string, number> = {};
  records.forEach((r) => {
    if (r.status === 'attended' || r.status === 'upcoming') {
      sportCounts[r.sport] = (sportCounts[r.sport] || 0) + r.hours;
    }
  });

  const filteredRecords = records.filter((r) => {
    if (filterSport === 'all') return true;
    return r.sport === filterSport;
  });

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#a1a1aa', '#71717a'],
    });
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      bookingRef: `WPU-MAN-${Math.floor(10000 + Math.random() * 90000)}`,
      sport: newSport,
      courtName: newCourt,
      date: newDate,
      timeSlot: newTime,
      hours: Number(newHours),
      status: newStatus,
      verifiedByFaculty: newStatus === 'attended',
      notes: 'Logged directly by student via cockpit',
    });
    setShowAddModal(false);
  };

  const exportCreditSummary = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Ref,Sport,Court,Date,Time,Hours,Status,Verified']
        .concat(
          records.map(
            (r) =>
              `${r.bookingRef},${r.sport},"${r.courtName}",${r.date},${r.timeSlot},${r.hours},${r.status},${r.verifiedByFaculty}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MIT_WPU_Sports_Credit_Report_${records.length}sessions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 30-Hour Requirement Hero Metric Card - Modern Monochromatic */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span>MIT World Peace University</span>
              <span aria-hidden="true">·</span>
              <span>Physical Education Credit Requirement</span>
              <span aria-hidden="true">·</span>
              <span>Graduation Target</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>30-Hour Sports Credit Milestone</span>
              {attendedHours >= targetHours && (
                <button
                  onClick={triggerCelebration}
                  className="text-xs bg-white text-black font-bold px-2 py-0.5 rounded hover:bg-zinc-200 transition-colors"
                >
                  Goal Achieved!
                </button>
              )}
            </h2>
            <p className="text-sm text-zinc-400">
              Track mandatory physical education hours across Dronacharya Sports Complex facilities. Each sniped slot secures 1.0 verified hour toward your 30.0 hour graduation requirement.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 shrink-0 sm:min-w-[340px]">
            <div className="bg-black border border-zinc-800 rounded-lg p-3">
              <span className="text-xs text-zinc-400 block font-medium">Attended & Verified</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                {attendedHours.toFixed(1)}h
              </span>
              <span className="text-xs text-zinc-500 block mt-0.5">Verified attendance</span>
            </div>

            <div className="bg-black border border-zinc-800 rounded-lg p-3">
              <span className="text-xs text-zinc-400 block font-medium">Upcoming Booked</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-zinc-300 tabular-nums">
                {upcomingHours.toFixed(1)}h
              </span>
              <span className="text-xs text-zinc-500 block mt-0.5">Slots secured</span>
            </div>

            <div className="bg-black border border-zinc-800 rounded-lg p-3">
              <span className="text-xs text-zinc-400 block font-medium">Remaining Needed</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                {remainingHours.toFixed(1)}h
              </span>
              <span className="text-xs text-zinc-500 block mt-0.5">Needed for 30h</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar with Multi-Segment tracking */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium text-zinc-200">
              Credit Progress: <span className="font-mono text-white font-bold tabular-nums">{percentage}%</span> of 30.0 hours completed
            </span>
            <span className="font-mono tabular-nums text-zinc-400">
              {attendedHours.toFixed(1)} / {targetHours.toFixed(1)} Hours
            </span>
          </div>

          <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-zinc-800">
            {/* Attended (Verified) - Pure White */}
            <div
              style={{ width: `${Math.min(100, (attendedHours / targetHours) * 100)}%` }}
              className="bg-white transition-all duration-500"
              title={`Attended: ${attendedHours}h`}
            />
            {/* Upcoming (Booked) - High-contrast Zinc */}
            <div
              style={{ width: `${Math.min(100 - (attendedHours / targetHours) * 100, (upcomingHours / targetHours) * 100)}%` }}
              className="bg-zinc-500 transition-all duration-500"
              title={`Upcoming: ${upcomingHours}h`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-white inline-block" />
                <span className="text-zinc-200">Attended ({attendedHours}h)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-500 inline-block" />
                <span className="text-zinc-300">Upcoming ({upcomingHours}h)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 inline-block border border-zinc-700" />
                <span className="text-zinc-400">Remaining ({remainingHours}h)</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Session</span>
              </button>
              <button
                onClick={exportCreditSummary}
                className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sport Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {[
          { key: 'badminton', label: 'Badminton' },
          { key: 'table_tennis', label: 'Table Tennis' },
          { key: 'squash', label: 'Squash' },
          { key: 'gym', label: 'Gym & Cardio' },
          { key: 'swimming', label: 'Swimming' },
        ].map((sport) => {
          const hrs = sportCounts[sport.key] || 0;
          const isSelected = filterSport === sport.key;
          return (
            <div
              key={sport.key}
              onClick={() => setFilterSport(isSelected ? 'all' : sport.key)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-zinc-900 border-white text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="text-xs text-zinc-400 block font-medium">{sport.label}</span>
              <span className="text-lg font-bold font-mono tabular-nums text-white block mt-0.5">
                {hrs.toFixed(1)}h
              </span>
              <span className="text-[11px] text-zinc-500 block mt-0.5">
                {Math.round((hrs / 30) * 100)}% of goal
              </span>
            </div>
          );
        })}
      </div>

      {/* Sessions Ledger Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white text-base">Booking & Credit Attendance Log</h3>
            <span className="text-xs text-zinc-400">· {filteredRecords.length} sessions listed</span>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-black rounded-lg border border-zinc-800 text-xs">
            {['all', 'badminton', 'table_tennis', 'gym'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterSport(tab)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  filterSport === tab
                    ? 'bg-white text-black font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black text-zinc-400 font-medium border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Sport & Venue</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Credit Hours</th>
                <th className="py-3 px-4">Attendance Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-400 font-medium">
                    {item.bookingRef}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-white block">{item.courtName}</span>
                    <span className="text-zinc-500 capitalize">{item.sport.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-zinc-200 block">{item.date}</span>
                    <span className="font-mono text-zinc-400">{item.timeSlot}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white tabular-nums">
                    +{item.hours.toFixed(1)}h
                  </td>
                  <td className="py-3 px-4">
                    {item.status === 'attended' && (
                      <span className="text-white flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Verified Attended</span>
                      </span>
                    )}
                    {item.status === 'upcoming' && (
                      <span className="text-zinc-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Booked (Upcoming)</span>
                      </span>
                    )}
                    {item.status === 'missed' && (
                      <span className="text-zinc-500 font-medium line-through">Missed Slot</span>
                    )}
                    {item.status === 'cancelled' && (
                      <span className="text-zinc-600 font-medium">Cancelled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status === 'upcoming' && (
                      <button
                        onClick={() => onUpdateStatus(item.id, 'attended')}
                        className="px-2.5 py-1 bg-white hover:bg-zinc-200 text-black font-semibold rounded text-[11px] transition-colors"
                      >
                        Mark Attended
                      </button>
                    )}
                    {item.status === 'attended' && (
                      <span className="text-zinc-500 text-[11px]">ERP Synced</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Log Past Sports Session</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Add hours completed at Dronacharya Sports Complex to keep your 30-hour tracker synchronized.
            </p>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-300 block mb-1">Sport</label>
                <select
                  value={newSport}
                  onChange={(e) => {
                    const sp = e.target.value as SportCategory;
                    setNewSport(sp);
                    if (sp === 'badminton') setNewCourt('Badminton Court 1');
                    else if (sp === 'table_tennis') setNewCourt('Table Tennis Table 1');
                    else if (sp === 'squash') setNewCourt('Squash Court 1');
                    else if (sp === 'gym') setNewCourt('Fitness & Cardio Studio');
                    else setNewCourt('Swimming Pool');
                  }}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                >
                  <option value="badminton">Badminton</option>
                  <option value="table_tennis">Table Tennis</option>
                  <option value="squash">Squash</option>
                  <option value="gym">Gymnasium</option>
                  <option value="swimming">Swimming</option>
                  <option value="basketball">Basketball</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-300 block mb-1">Court / Table Name</label>
                <input
                  type="text"
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Time Window</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="17:00-18:00"
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Credit Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="4"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-300 block mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CreditRecord['status'])}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="attended">Attended & Verified</option>
                    <option value="upcoming">Upcoming Booked</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-white hover:bg-zinc-200 text-black rounded-lg transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
