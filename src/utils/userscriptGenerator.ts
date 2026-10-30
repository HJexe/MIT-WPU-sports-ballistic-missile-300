import { SniperConfig } from '../types';

export function generateTampermonkeyScript(config: SniperConfig): string {
  const courtsJson = JSON.stringify(config.preferredCourts);
  const timeWindowsJson = JSON.stringify(config.preferredTimeWindows);
  const safePassword = config.password ? config.password.replace(/"/g, '\\"') : '';

  return `// ==UserScript==
// @name         Mit wpu sports sniper 3000
// @namespace    https://github.com/mit-wpu-sports-sniper
// @version      3.0.0
// @description  High-precision millisecond slot booking sniper & auto-login for MIT-WPU Courtside (sports.mitwpu.edu.in)
// @author       Hrishiraj Nagawade & AI Studio
// @match        https://sports.mitwpu.edu.in/*
// @match        https://sports.mitwpu.edu.in/login*
// @match        https://*.mitwpu.edu.in/sports*
// @match        http://localhost:*/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // --- Configuration Injected from Sniper Dashboard ---
  const CONFIG = {
    collegeEmail: "${config.collegeEmail || 'hrishiraj.nagawade@mitwpu.edu.in'}",
    password: "${safePassword}",
    studentPrn: "${config.studentPrn}",
    studentName: "${config.studentName}",
    autoLogin: ${config.autoLoginOnExpiry},
    primarySport: "${config.primarySport}",
    fallbackSport: "${config.fallbackSport}",
    targetCourts: ${courtsJson},
    targetTimes: ${timeWindowsJson},
    dropHour: ${config.dropHour},
    dropMinute: ${config.dropMinute},
    dropSecond: ${config.dropSecond},
    preFireOffsetMs: ${config.preFireOffsetMs}, // Trigger ms before round second
    burstRequests: ${config.burstCount},
    isArmed: ${config.isArmed}
  };

  console.log('[Courtside Sniper v2.5] Initialized for student:', CONFIG.collegeEmail, 'PRN:', CONFIG.studentPrn);

  // --- 1. Auto-Login Handler for https://sports.mitwpu.edu.in/login ---
  const isLoginPage = window.location.pathname.includes('/login') || !!document.querySelector('input[type="password"]');

  if (isLoginPage) {
    console.log('[Courtside Sniper] Detected login portal. Executing auto-login check...');
    executeAutoLogin();
    return; // Don't show slot countdown HUD on the login screen
  }

  function executeAutoLogin() {
    const notifyBanner = document.createElement('div');
    notifyBanner.style.cssText = \`
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999999;
      background: #0f172a;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 12px 16px;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      font-size: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    \`;
    notifyBanner.innerHTML = \`
      <div style="font-weight:700; color:#f59e0b; margin-bottom:4px;">⚡ Mit wpu sports sniper 3000 (Auto-Login)</div>
      <div style="color:#94a3b8;">Email: <strong style="color:#fff;">\${CONFIG.collegeEmail}</strong></div>
    \`;
    document.body.appendChild(notifyBanner);

    setTimeout(() => {
      // Find email and password inputs based on Courtside DOM structure
      const emailInput = document.getElementById('email') || document.querySelector('input[type="email"], input[name="email"]');
      const passInput = document.getElementById('password') || document.querySelector('input[type="password"], input[name="password"]');
      const submitBtn = document.querySelector('button[type="submit"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Login') || b.textContent.includes('Sign In'));

      if (emailInput && CONFIG.collegeEmail) {
        emailInput.value = CONFIG.collegeEmail;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[Courtside Sniper] Injected college email into login form.');
      }

      if (passInput && CONFIG.password) {
        passInput.value = CONFIG.password;
        passInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('[Courtside Sniper] Injected password into login form.');
      }

      if (CONFIG.autoLogin && emailInput && passInput && CONFIG.password && submitBtn) {
        notifyBanner.innerHTML += '<div style="color:#10b981; font-weight:600; margin-top:4px;">✓ Authenticating in 500ms...</div>';
        setTimeout(() => {
          submitBtn.click();
        }, 500);
      } else {
        notifyBanner.innerHTML += '<div style="color:#38bdf8; margin-top:4px;">Enter password & submit to lock in session.</div>';
      }
    }, 400);
  }

  // --- 2. In-Page HUD Overlay on Main Booking Portal ---
  const hud = document.createElement('div');
  hud.id = 'wpu-sniper-hud';
  hud.style.cssText = \`
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 16px;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    font-size: 13px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
    width: 320px;
    backdrop-filter: blur(8px);
  \`;

  hud.innerHTML = \`
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
      <span style="font-weight:700; color:#38bdf8;">Mit wpu sports sniper 3000</span>
      <span id="hud-status" style="font-weight:600; color:\${CONFIG.isArmed ? '#34d399' : '#94a3b8'};">
        \${CONFIG.isArmed ? '● ARMED' : '○ STANDBY'}
      </span>
    </div>
    <div style="font-size:11px; color:#94a3b8; line-height:1.6;">
      <div>Account: <span style="color:#f1f5f9; font-family:monospace;">\${CONFIG.collegeEmail}</span></div>
      <div>PRN: <span style="color:#f1f5f9; font-family:monospace;">\${CONFIG.studentPrn}</span></div>
      <div>Target: <span style="color:#fbbf24; font-weight:600;">\${CONFIG.primarySport.toUpperCase()}</span></div>
      <div>Preferred: <span style="color:#e2e8f0;">\${CONFIG.targetTimes.join(', ')}</span></div>
      <div>Countdown: <span id="hud-countdown" style="font-family:monospace; font-weight:700; color:#38bdf8;">--:--:--</span></div>
    </div>
    <div style="margin-top:12px; display:flex; gap:8px;">
      <button id="btn-fire-test" style="flex:1; background:#0284c7; color:#fff; border:none; border-radius:6px; padding:6px; cursor:pointer; font-weight:600; font-size:12px;">Fire Burst Now</button>
      <button id="btn-toggle-arm" style="flex:1; background:#334155; color:#fff; border:none; border-radius:6px; padding:6px; cursor:pointer; font-weight:600; font-size:12px;">
        \${CONFIG.isArmed ? 'Disarm' : 'Arm Bot'}
      </button>
    </div>
  \`;

  document.body.appendChild(hud);

  let armed = CONFIG.isArmed;
  let alreadyFiredToday = false;

  const btnArm = document.getElementById('btn-toggle-arm');
  const btnFire = document.getElementById('btn-fire-test');
  const hudStatus = document.getElementById('hud-status');
  const hudCountdown = document.getElementById('hud-countdown');

  if (btnArm) {
    btnArm.addEventListener('click', () => {
      armed = !armed;
      hudStatus.textContent = armed ? '● ARMED' : '○ STANDBY';
      hudStatus.style.color = armed ? '#34d399' : '#94a3b8';
      btnArm.textContent = armed ? 'Disarm' : 'Arm Bot';
    });
  }

  if (btnFire) {
    btnFire.addEventListener('click', () => {
      executeSlotSniper('manual_override');
    });
  }

  // --- High Precision Countdown & Trigger Loop ---
  function checkClock() {
    const now = new Date();
    const target = new Date();
    target.setHours(CONFIG.dropHour, CONFIG.dropMinute, CONFIG.dropSecond, 0);

    // If drop time has passed today, target tomorrow
    if (now.getTime() > target.getTime() + 5000) {
      target.setDate(target.getDate() + 1);
    }

    const diffMs = target.getTime() - now.getTime();

    if (diffMs > 0) {
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      const tenths = Math.floor((diffMs % 1000) / 100);
      hudCountdown.textContent = \`\${String(hours).padStart(2,'0')}:\${String(minutes).padStart(2,'0')}:\${String(seconds).padStart(2,'0')}.\${tenths}\`;
    } else {
      hudCountdown.textContent = 'DROPPED (00:00:00)';
    }

    // Trigger window: within preFireOffsetMs of drop
    if (armed && !alreadyFiredToday && diffMs <= CONFIG.preFireOffsetMs && diffMs > -4000) {
      console.log('[Courtside Sniper] Trigger condition met! Firing burst...');
      alreadyFiredToday = true;
      executeSlotSniper('scheduled_drop');
    }

    requestAnimationFrame(checkClock);
  }

  requestAnimationFrame(checkClock);

  // --- Slot Sniper Core Execution Routine ---
  async function executeSlotSniper(source) {
    console.log(\`[Courtside Sniper] Executing sniper triggered by \${source} at \${new Date().toISOString()}\`);
    hudStatus.textContent = '⚡ SNIPING...';
    hudStatus.style.color = '#f59e0b';

    const tStart = performance.now();

    // 1. In-Page DOM Instant Clicker (Scans available court buttons)
    let domBooked = attemptDomClickBooking();

    // 2. Direct In-Session API Burst (Runs in parallel with session cookies)
    const apiPromises = [];
    for (let i = 0; i < CONFIG.burstRequests; i++) {
      apiPromises.push(attemptDirectApiReserve(i));
    }

    try {
      const results = await Promise.allSettled(apiPromises);
      const tEnd = performance.now();
      const latency = Math.round(tEnd - tStart);

      const anySuccess = results.some(r => r.status === 'fulfilled' && r.value && r.value.success) || domBooked;

      if (anySuccess) {
        hudStatus.textContent = \`✓ SECURED (\${latency}ms)\`;
        hudStatus.style.color = '#34d399';
        alert(\`[Mit wpu sports sniper 3000] Success! Slot secured in \${latency}ms. Your 30-hour credit progress has been advanced!\`);
      } else {
        hudStatus.textContent = 'COMPLETED (CHECK LOGS)';
        hudStatus.style.color = '#38bdf8';
      }
    } catch (err) {
      console.error('[Courtside Sniper] Error during burst:', err);
    }
  }

  // DOM Clicker fallback
  function attemptDomClickBooking() {
    const courtButtons = Array.from(document.querySelectorAll('button, .slot-btn, .court-slot, [data-slot]'));
    for (const btn of courtButtons) {
      const text = (btn.textContent || '').toLowerCase();
      const isBadm = text.includes('badminton') || text.includes('court') || text.includes('tt');
      const isAvailable = !btn.disabled && !text.includes('full') && !text.includes('booked');

      if (isAvailable && isBadm) {
        btn.click();
        console.log('[Courtside Sniper] Clicked DOM element:', btn);
        const confirmBtn = document.querySelector('button[type="submit"], .btn-confirm-booking, #confirm-booking');
        if (confirmBtn) confirmBtn.click();
        return true;
      }
    }
    return false;
  }

  // Direct REST API Burst using in-browser credentials
  async function attemptDirectApiReserve(burstIdx) {
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1); // Next day booking
      const dateStr = targetDate.toISOString().split('T')[0];

      const payload = {
        email: CONFIG.collegeEmail,
        prn: CONFIG.studentPrn,
        sport: CONFIG.primarySport,
        date: dateStr,
        preferredTime: CONFIG.targetTimes[0] || '17:00-18:00',
        timestamp: Date.now(),
        clientBurstId: burstIdx
      };

      const customEndpointUrl = ${config.customEndpoint?.url ? JSON.stringify(config.customEndpoint.url) : 'null'};
      const customHeaders = ${config.customEndpoint?.headers ? JSON.stringify(config.customEndpoint.headers) : 'null'};

      const targetEndpoint = customEndpointUrl || '/api/v1/sports/slots/reserve';
      const requestHeaders = Object.assign(
        {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        customHeaders || {}
      );

      const response = await fetch(targetEndpoint, {
        method: '${config.customEndpoint?.method || 'POST'}',
        headers: requestHeaders,
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Courtside Sniper] Burst #', burstIdx, 'succeeded:', data);
        return { success: true, data };
      }
    } catch (e) {
      console.warn('[Courtside Sniper] API attempt failed:', e);
    }
    return { success: false };
  }

})();
`;
}
