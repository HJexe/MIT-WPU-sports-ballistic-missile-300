import { SportCategory, SportCourt, TimeSlot, CreditRecord, SniperConfig } from '../types';

export const MIT_COURTS: SportCourt[] = [
  { id: 'badm_c1', name: 'Badminton Court 1 (Indoor Synthetic)', sport: 'badminton', facility: 'Dronacharya Complex - Hall A', capacity: 4 },
  { id: 'badm_c2', name: 'Badminton Court 2 (Indoor Synthetic)', sport: 'badminton', facility: 'Dronacharya Complex - Hall A', capacity: 4 },
  { id: 'badm_c3', name: 'Badminton Court 3 (Wooden Floor)', sport: 'badminton', facility: 'Dronacharya Complex - Hall A', capacity: 4 },
  { id: 'badm_c4', name: 'Badminton Court 4 (Wooden Floor)', sport: 'badminton', facility: 'Dronacharya Complex - Hall A', capacity: 4 },
  { id: 'tt_t1', name: 'Table Tennis Table 1 (Stag Pro)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'tt_t2', name: 'Table Tennis Table 2 (Stag Pro)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'tt_t3', name: 'Table Tennis Table 3 (Butterfly)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'tt_t4', name: 'Table Tennis Table 4 (Butterfly)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'tt_t5', name: 'Table Tennis Table 5 (Practice)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'tt_t6', name: 'Table Tennis Table 6 (Practice)', sport: 'table_tennis', facility: 'Dronacharya Complex - TT Arena', capacity: 2 },
  { id: 'sq_c1', name: 'Squash Court 1 (Glass Back)', sport: 'squash', facility: 'Dronacharya Complex - Ground Fl.', capacity: 2 },
  { id: 'sq_c2', name: 'Squash Court 2 (Standard)', sport: 'squash', facility: 'Dronacharya Complex - Ground Fl.', capacity: 2 },
  { id: 'gym_main', name: 'Fitness & Cardio Studio', sport: 'gym', facility: 'Dronacharya Complex - 1st Floor', capacity: 25 },
  { id: 'swim_pool', name: 'Swimming Pool (25m Heated)', sport: 'swimming', facility: 'MIT Aquatic Center', capacity: 15 },
  { id: 'bb_court', name: 'Basketball Court (Main)', sport: 'basketball', facility: 'Campus Sports Ground', capacity: 12 },
  { id: 'fb_turf', name: 'Football / Multi-Sport Turf', sport: 'football', facility: 'Kothrud Main Ground', capacity: 18 },
];

export const TIME_WINDOWS = [
  '06:00-07:00',
  '07:00-08:00',
  '08:00-09:00',
  '09:00-10:00',
  '16:00-17:00',
  '17:00-18:00',
  '18:00-19:00',
  '19:00-20:00',
  '20:00-21:00',
];

export const DEFAULT_SNIPER_CONFIG: SniperConfig = {
  collegeEmail: '1292260927.h@mitwpu.edu.in',
  password: 'Astha@4708',
  studentPrn: '1292260927',
  studentName: 'Student (1292260927)',
  authToken: 'wpu_sess_verified_auth',
  autoLoginOnExpiry: true,
  primarySport: 'badminton',
  preferredCourts: ['badm_c1', 'badm_c2', 'badm_c3'],
  fallbackSport: 'table_tennis',
  preferredTimeWindows: ['07:00-08:00', '17:00-18:00', '18:00-19:00'],
  dropHour: 8,
  dropMinute: 0,
  dropSecond: 0,
  preFireOffsetMs: 250,
  burstCount: 3,
  isArmed: true,
  autoSolveCheck: true,
  customEndpoint: {
    url: 'https://sports.mitwpu.edu.in/sports',
    method: 'POST',
    headers: {
      'Next-Action': '4023a0a095970e44402bbb8faabfd30e8756fe3276',
      'Accept': 'text/x-component',
      'Content-Type': 'multipart/form-data',
    },
    cookieString: 'student_prn=1292260927; email=1292260927.h@mitwpu.edu.in',
    bodyTemplate: '{"email":"1292260927.h@mitwpu.edu.in","sport":"badminton"}',
    sourceType: 'preset',
  },
};

export const INITIAL_CREDIT_RECORDS: CreditRecord[] = [
  {
    id: 'cred-1',
    bookingRef: 'WPU-SP-89412',
    sport: 'badminton',
    courtName: 'Badminton Court 1',
    date: '2026-10-24',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
    notes: 'Biometric swipe verified at Dronacharya turnstile',
  },
  {
    id: 'cred-2',
    bookingRef: 'WPU-SP-89104',
    sport: 'badminton',
    courtName: 'Badminton Court 2',
    date: '2026-10-22',
    timeSlot: '07:00-08:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-3',
    bookingRef: 'WPU-SP-88761',
    sport: 'table_tennis',
    courtName: 'Table Tennis Table 1',
    date: '2026-10-20',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-4',
    bookingRef: 'WPU-SP-88339',
    sport: 'badminton',
    courtName: 'Badminton Court 1',
    date: '2026-10-18',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-5',
    bookingRef: 'WPU-SP-87910',
    sport: 'gym',
    courtName: 'Fitness & Cardio Studio',
    date: '2026-10-16',
    timeSlot: '07:00-08:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-6',
    bookingRef: 'WPU-SP-87420',
    sport: 'badminton',
    courtName: 'Badminton Court 3',
    date: '2026-10-14',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-7',
    bookingRef: 'WPU-SP-87002',
    sport: 'table_tennis',
    courtName: 'Table Tennis Table 2',
    date: '2026-10-12',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-8',
    bookingRef: 'WPU-SP-86511',
    sport: 'badminton',
    courtName: 'Badminton Court 4',
    date: '2026-10-10',
    timeSlot: '06:00-07:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-9',
    bookingRef: 'WPU-SP-86094',
    sport: 'badminton',
    courtName: 'Badminton Court 2',
    date: '2026-10-08',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-10',
    bookingRef: 'WPU-SP-85610',
    sport: 'swimming',
    courtName: 'Swimming Pool (25m)',
    date: '2026-10-05',
    timeSlot: '07:00-08:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-11',
    bookingRef: 'WPU-SP-85123',
    sport: 'badminton',
    courtName: 'Badminton Court 1',
    date: '2026-10-03',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-12',
    bookingRef: 'WPU-SP-84801',
    sport: 'table_tennis',
    courtName: 'Table Tennis Table 3',
    date: '2026-09-30',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-13',
    bookingRef: 'WPU-SP-84400',
    sport: 'badminton',
    courtName: 'Badminton Court 2',
    date: '2026-09-28',
    timeSlot: '07:00-08:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-14',
    bookingRef: 'WPU-SP-83991',
    sport: 'squash',
    courtName: 'Squash Court 1',
    date: '2026-09-25',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-15',
    bookingRef: 'WPU-SP-83540',
    sport: 'badminton',
    courtName: 'Badminton Court 1',
    date: '2026-09-22',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-16',
    bookingRef: 'WPU-SP-83100',
    sport: 'badminton',
    courtName: 'Badminton Court 3',
    date: '2026-09-18',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-17',
    bookingRef: 'WPU-SP-82600',
    sport: 'table_tennis',
    courtName: 'Table Tennis Table 1',
    date: '2026-09-15',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  {
    id: 'cred-18',
    bookingRef: 'WPU-SP-82100',
    sport: 'badminton',
    courtName: 'Badminton Court 2',
    date: '2026-09-12',
    timeSlot: '07:00-08:00',
    hours: 1.0,
    status: 'attended',
    verifiedByFaculty: true,
  },
  // Upcoming confirmed bookings secured previously:
  {
    id: 'cred-up-1',
    bookingRef: 'WPU-SP-90114',
    sport: 'badminton',
    courtName: 'Badminton Court 1',
    date: '2026-10-30',
    timeSlot: '17:00-18:00',
    hours: 1.0,
    status: 'upcoming',
    verifiedByFaculty: false,
    notes: 'Sniped successfully in 78ms',
  },
  {
    id: 'cred-up-2',
    bookingRef: 'WPU-SP-90250',
    sport: 'table_tennis',
    courtName: 'Table Tennis Table 2',
    date: '2026-10-31',
    timeSlot: '18:00-19:00',
    hours: 1.0,
    status: 'upcoming',
    verifiedByFaculty: false,
    notes: 'Sniped successfully in 91ms',
  },
];

export function generateInitialSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = '2026-10-30';
  const tomorrow = '2026-10-31';

  [today, tomorrow].forEach((date) => {
    MIT_COURTS.forEach((court) => {
      TIME_WINDOWS.forEach((win) => {
        const [startTime, endTime] = win.split('-');
        const isEvening = startTime.startsWith('17') || startTime.startsWith('18') || startTime.startsWith('19');
        const isBadminton = court.sport === 'badminton';

        // High demand slots book out fast or are full
        let status: TimeSlot['status'] = 'available';
        let booked = Math.floor(Math.random() * (court.capacity + 1));

        if (isBadminton && isEvening) {
          booked = court.capacity;
          status = 'full';
        } else if (booked >= court.capacity) {
          status = 'full';
        } else if (booked >= court.capacity - 1) {
          status = 'filling_fast';
        }

        // Tag user's already booked upcoming slot
        if (date === today && court.id === 'badm_c1' && win === '17:00-18:00') {
          status = 'booked_by_user';
          booked = court.capacity;
        }
        if (date === tomorrow && court.id === 'tt_t2' && win === '18:00-19:00') {
          status = 'booked_by_user';
          booked = court.capacity;
        }

        slots.push({
          id: `slot_${court.id}_${date}_${startTime.replace(':', '')}`,
          sport: court.sport,
          courtId: court.id,
          courtName: court.name,
          date,
          startTime,
          endTime,
          totalCapacity: court.capacity,
          bookedCount: booked,
          status,
          creditHours: 1.0,
        });
      });
    });
  });

  return slots;
}
