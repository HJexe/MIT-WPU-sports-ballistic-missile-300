export type SportCategory =
  | 'badminton'
  | 'table_tennis'
  | 'squash'
  | 'gym'
  | 'swimming'
  | 'basketball'
  | 'football';

export interface SportCourt {
  id: string;
  name: string;
  sport: SportCategory;
  facility: string; // e.g. "Dronacharya Sports Complex - Floor 2"
  capacity: number;
}

export interface TimeSlot {
  id: string;
  sport: SportCategory;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "17:00"
  endTime: string; // "18:00"
  totalCapacity: number;
  bookedCount: number;
  status: 'available' | 'filling_fast' | 'full' | 'booked_by_user';
  creditHours: number; // 1.0
}

export interface ReverseEngineeredEndpoint {
  url: string;
  method: 'POST' | 'GET' | 'PUT';
  headers: Record<string, string>;
  cookieString?: string;
  bodyTemplate?: string;
  sourceType: 'curl_paste' | 'preset' | 'manual';
  lastTestedMs?: number;
  lastTestStatus?: string;
}

export interface SniperConfig {
  collegeEmail: string; // e.g. "hrishiraj.nagawade@mitwpu.edu.in"
  password?: string;
  studentPrn: string;
  studentName: string;
  authToken: string;
  autoLoginOnExpiry: boolean; // Auto re-authenticates if session logs out on login page
  primarySport: SportCategory;
  preferredCourts: string[]; // Court IDs
  fallbackSport: SportCategory | 'none';
  preferredTimeWindows: string[]; // e.g. ["06:00-07:00", "17:00-18:00", "18:00-19:00"]
  dropHour: number; // e.g. 8 for 08:00 AM
  dropMinute: number;
  dropSecond: number;
  preFireOffsetMs: number; // e.g. 250ms before drop
  burstCount: number; // e.g. 3 concurrent requests
  isArmed: boolean;
  autoSolveCheck: boolean;
  customEndpoint?: ReverseEngineeredEndpoint;
}

export interface CreditRecord {
  id: string;
  bookingRef: string;
  sport: SportCategory;
  courtName: string;
  date: string;
  timeSlot: string;
  hours: number;
  status: 'attended' | 'upcoming' | 'missed' | 'cancelled';
  verifiedByFaculty: boolean;
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  latencyMs?: number;
  payloadSummary?: string;
}
