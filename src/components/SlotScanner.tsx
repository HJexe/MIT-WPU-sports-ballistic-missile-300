import React, { useState } from 'react';
import { TimeSlot, SportCategory } from '../types';
import { Search, Filter, Calendar, Zap, CheckCircle2 } from 'lucide-react';

interface SlotScannerProps {
  slots: TimeSlot[];
  onBookSlot: (slot: TimeSlot) => void;
  bookingSlotId?: string | null;
}

export const SlotScanner: React.FC<SlotScannerProps> = ({
  slots,
  onBookSlot,
  bookingSlotId,
}) => {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  const filteredSlots = slots.filter((slot) => {
    if (slot.date !== selectedDate) return false;
    if (selectedSport !== 'all' && slot.sport !== selectedSport) return false;
    if (onlyAvailable && slot.status === 'full') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        slot.courtName.toLowerCase().includes(q) ||
        slot.startTime.includes(q) ||
        slot.sport.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Header - Modern Monochromatic */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span>Dronacharya Sports Complex</span>
              <span aria-hidden="true">·</span>
              <span>Courtside Facility Live Matrix</span>
              <span aria-hidden="true">·</span>
              <span>{filteredSlots.length} Slots Found</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
              Court & Slot Availability Matrix
            </h2>
          </div>

          {/* Date Picker Switcher */}
          <div className="flex items-center p-1 bg-black rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedDate('2026-10-30')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                selectedDate === '2026-10-30'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Today (30 Oct)
            </button>
            <button
              onClick={() => setSelectedDate('2026-10-31')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                selectedDate === '2026-10-31'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tomorrow (31 Oct)
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-800/80 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by court name or time..."
              className="w-full bg-black border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-zinc-200 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Sports' },
              { id: 'badminton', label: 'Badminton' },
              { id: 'table_tennis', label: 'Table Tennis' },
              { id: 'squash', label: 'Squash' },
              { id: 'gym', label: 'Gym' },
              { id: 'swimming', label: 'Swimming' },
            ].map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`px-2.5 py-1.5 rounded border transition-colors whitespace-nowrap ${
                  selectedSport === sport.id
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-black border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {sport.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-400 hover:text-white">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded bg-black border-zinc-700 text-white focus:ring-0"
            />
            <span>Open Only</span>
          </label>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredSlots.map((slot) => {
          const isFull = slot.status === 'full';
          const isFilling = slot.status === 'filling_fast';
          const isUserBooked = slot.status === 'booked_by_user';
          const isAvailable = slot.status === 'available';
          const isThisSlotBooking = bookingSlotId === slot.id;

          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                isUserBooked
                  ? 'bg-zinc-900 border-white text-white'
                  : isFull
                  ? 'bg-zinc-950/60 border-zinc-900 opacity-50'
                  : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-semibold text-white text-sm block line-clamp-1">
                    {slot.courtName}
                  </span>
                  <span className="text-[11px] text-zinc-400 capitalize">
                    {slot.sport.replace('_', ' ')} · +1.0 Credit Hr
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-black border border-zinc-800 px-2 py-0.5 rounded tabular-nums">
                  {slot.startTime}
                </span>
              </div>

              {/* Capacity meter */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Capacity</span>
                  <span className="font-mono tabular-nums">
                    {slot.bookedCount}/{slot.totalCapacity} Booked
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(slot.bookedCount / slot.totalCapacity) * 100}%` }}
                    className={`h-full transition-all ${
                      isFull ? 'bg-zinc-600' : isFilling ? 'bg-zinc-300' : 'bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  {isUserBooked && (
                    <span className="text-xs text-white font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Secured</span>
                    </span>
                  )}
                  {isFull && <span className="text-xs text-zinc-500 font-medium">Sold Out</span>}
                  {isFilling && (
                    <span className="text-xs text-zinc-300 font-medium">Filling Fast</span>
                  )}
                  {isAvailable && (
                    <span className="text-xs text-white font-medium">Open Slot</span>
                  )}
                </div>

                {!isFull && !isUserBooked && (
                  <button
                    onClick={() => onBookSlot(slot)}
                    disabled={isThisSlotBooking}
                    className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-3 h-3 fill-current" />
                    <span>{isThisSlotBooking ? 'Sniping...' : 'Instant Snipe'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
