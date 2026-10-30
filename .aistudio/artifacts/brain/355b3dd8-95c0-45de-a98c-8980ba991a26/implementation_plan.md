# MIT-WPU Sports Credit Slot Sniper Bot & 30-Hour Tracker

An automated slot sniper cockpit and 30-hour physical education credit tracker engineered for MIT World Peace University (Courtside/Dronacharya Sports Complex portal). It eliminates manual booking latency through sub-second precision release triggers, automated priority slot snipers for Badminton and Table Tennis, and an exportable in-browser Tampermonkey userscript for instant client-side execution.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following parameters were confirmed during Phase 1 clarification:
> - **Authentication Method**: College ERP Student PRN (Permanent Registration Number) and password with session authorization header persistence.
> - **Execution Mode**: Dual-engine strategy featuring a live web control dashboard with simulated and automated backend sniping, combined with an exportable 1-click Tampermonkey/Violentmonkey browser userscript that runs directly on `sports.mitwpu.edu.in` to bypass browser security and network latency.
> - **Sport Targeting Strategy**: Priority sport queue targeting preferred racket sports (Badminton Courts 1–4, Table Tennis Arena) with user-defined backup slots and preferred time windows.
>
> **Recommended Defaults**:
> - Slot Drop Clock Sync: NTP server time offset compensation (triggering burst requests at $T-250\text{ms}$ before slot unlock time).
> - Target Hours: 30 credit hours graduation requirement tracked across completed, booked, and remaining hours.

---

## 1. Overview & Core Concept

- **What It Does**: A complete tactical booking terminal for MIT-WPU students to secure high-demand sports slots at the Dronacharya Sports Complex. It features millisecond-accurate drop countdowns, auto-login session managers, automated priority queue dispatchers, live slot availability scanners, and an integrated progress tracker for the mandatory 30-hour university sports credit requirement.
- **Target Audience / Persona**: MIT-WPU undergraduate and postgraduate students enrolled in mandatory physical education credit courses facing high slot competition where courts book out within 3–5 seconds of opening.
- **Key Value**: Guarantees timely slot reservation through millisecond-timed multi-request bursts, provides a direct in-browser userscript that operates inside the student's active campus session, and systematically logs attendance toward the 30-hour milestone.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Dashboard & 30-Hour Credit Monitor**:
   - Visual progress gauge showing completed hours, confirmed upcoming reservations, and remaining credits to hit 30 hours.
   - Quick breakdown by sport (Badminton hours logged, Table Tennis sessions, backup workout logs).
2. **Sniper Configuration & Slot Matrix**:
   - Select primary target sport (Badminton Courts 1–4, Table Tennis Tables 1–6) and optional fallback sports (Squash, Gymnasium).
   - Set preferred daily time windows (e.g., Morning 06:00–08:00 AM or Evening 17:00–20:00 PM).
   - Configure drop release time (e.g., daily 08:00:00 AM or 00:00:00 AM) with adjustable pre-trigger millisecond offset ($50\text{ms}$ to $500\text{ms}$).
3. **Live Terminal & Sniper Execution**:
   - Real-time countdown timer to the next slot release down to hundredths of a second with synchronized local clock display.
   - Live sniper arming toggle ("Armed / Ready to Fire" vs "Standby").
   - Live event log showing timestamped burst requests, HTTP response statuses, slot payload delivery, and booking confirmation IDs.
4. **Browser Userscript & Extension Generator**:
   - 1-click generated Tampermonkey / Violentmonkey script ready to install for students logged into `sports.mitwpu.edu.in`.
   - Script runs directly inside the authenticated browser tab, automatically refreshing at 07:59:59.8 AM, selecting the preferred Badminton/TT court, solving any client interactions, and auto-submitting the booking in $<200\text{ms}$.
5. **Slot Scanner & Manual Quick-Sniper**:
   - Interactive grid of current slot statuses across MIT-WPU courts with instant 1-click reservation action.
   - Ability to simulate dry-run test bursts to verify latency without consuming real credits.

### Visual Identity & Theme

- **Aesthetic Direction**: Tactical dark command console with clean typography and high visual density, inspired by professional financial terminals and developer monitoring tools.
- **Color Palette (60-30-10 discipline)**:
  - 60% Canvas: Deep dark slate (`#0B0F19`) and neutral carbon (`#111827`).
  - 30% Structural Surfaces: Slate cards (`#1E293B`) with crisp hairline borders (`#334155`).
  - 10% Accents: Amber/Gold warning accents (`#F59E0B`) for countdown timers, Emerald (`#10B981`) for confirmed bookings, and Electric Cyan (`#06B6D4`) for active sniper state.
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans` font for crisp, structured headers and card titles.
  - Body Prose: `DM Sans` for high legibility at compact interface scales.
  - Telemetry & Timestamps: Strict monospace with tabular numerals (`JetBrains Mono`, `tabular-nums`) for millisecond clocks, PRN data, and booking IDs.
- **Component Styling & Layout**:
  - 3-zone Top Bar Contract: Brand title (`MIT-WPU Courtside Sniper`), single-line navigation tabs, and primary action (`Armed Status / Quick Run`).
  - Zero-pill metadata: Pure text tags separated by subtle `·` dividers.
  - No decorative pulse dots or mechanical `//` comment banners.
- **Interactive Feedback**:
  - Millisecond-smooth countdown indicator.
  - Toast notifications on slot reservation success or dry-run completion.
  - Visual copy-to-clipboard feedback for generated userscripts.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Architecture (Web Cockpit + Browser Userscript)**
  - *Chosen Approach*: Deliver both a full-featured web simulation & control dashboard AND an exportable 1-click Tampermonkey script.
  - *Why*: Direct external API requests to college portals often require intranet access, VPN, or complex session cookies. The userscript executes directly in the user's logged-in Chrome tab on `sports.mitwpu.edu.in`, guaranteeing 100% authentication validity with 0 network proxy lag, while the web dashboard manages preferences, tracking, and countdowns.
  - *Alternatives Considered*: Pure server-side bot only (fails if campus portal blocks external IP or requires active CAS/SSO session).
- **Decision 2: 30-Hour Sports Credit Tracker Integration**
  - *Chosen Approach*: Native credit hour ledger tracking attended hours, booked hours, and remaining balance with requirement verification metrics.
  - *Why*: Solves the user's primary academic goal (graduating 30 hours) rather than just being an isolated booking tool.
- **Decision 3: Realistic Portal Simulation & Test Mode**
  - *Chosen Approach*: Include an interactive test portal mode allowing the user to practice sniping slots against a simulated millisecond countdown drop to verify bot reaction speed before the real 8:00 AM release.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MIT-WPU Sports Credit System                          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
┌─────────────────────────────────────────┐   ┌───────────────────────────────┐
│           React Client Cockpit          │   │  Tampermonkey Userscript      │
│  - 30-Hour Credit Progress Bar          │   │  (Runs on sports.mitwpu.edu)  │
│  - Precision Drop Clock (ms)            │   │  - In-page slot detector      │
│  - Target Sport & Court Preferences     │   │  - Auto-select Badminton/TT   │
│  - Booking History & Credit Ledger      │   │  - Sub-millisecond submitter  │
│  - Test Sniper Sandbox Simulator        │   │  - Session token bypass       │
└───────────────────┬─────────────────────┘   └───────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          Express / Node Relay           │
│  - NTP Server-Time Sync Endpoint        │
│  - Sniper Burst Dispatcher              │
│  - Booking Credentials & Profile Store  │
│  - Credit Progress & Attendance Store   │
└─────────────────────────────────────────┘
```

### Data Model & State

- **StudentProfile**: PRN, Student Name, Program/Branch, Target Hours (30), Completed Hours, Booked Hours.
- **SniperConfig**: Primary Sport (`badminton`, `table_tennis`), Preferred Courts, Time Slots (`06:00-07:00`, `07:00-08:00`, `17:00-18:00`, etc.), Drop Time (`08:00:00`), Pre-fire Offset ($250\text{ms}$), Request Concurrency (1–5 parallel attempts).
- **SlotRecord**: Sport, Court/Table ID, Date, Start Time, End Time, Status (`available`, `booked_by_user`, `full`), Credits Earned (1 hr).
- **BookingAuditLog**: Timestamp, Action, HTTP Status, Latency (ms), Outcome message.

### Component Mapping

- `NavigationHeader`: 3-zone header with university badge, navigation tabs, and system status.
- `CreditProgressTracker`: Visual 30-hour progress bar, remaining hours, and attendance requirements.
- `DropCountdownTimer`: High-precision synchronization clock showing countdown to daily release with millisecond readout.
- `SportPreferenceSelector`: Court selection for Badminton (Courts 1–4) & Table Tennis (Arena 1–6), time range toggles, and fallback priority.
- `LiveSniperConsole`: Execution console showing live burst attempts, logs, response payloads, and manual trigger test button.
- `UserscriptGenerator`: Exportable, syntax-highlighted Tampermonkey script customized with user PRN and preferred courts, with 1-click install instructions.
- `BookingLedgerTable`: Tabular view of past bookings and logged hours toward graduation.
