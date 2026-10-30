import React, { useState } from 'react';
import { SniperConfig } from '../types';
import { generateTampermonkeyScript } from '../utils/userscriptGenerator';
import { Copy, Check, Download, ExternalLink, Code2, ShieldAlert } from 'lucide-react';

interface UserscriptModalProps {
  config: SniperConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const UserscriptModal: React.FC<UserscriptModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const scriptContent = generateTampermonkeyScript(config);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mit_wpu_sports_sniper_3000_${config.studentPrn}.user.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Mit wpu sports sniper 3000 (Tampermonkey Script)
              </h3>
              <p className="text-xs text-zinc-400">
                Runs directly on <code className="text-white font-mono">sports.mitwpu.edu.in</code> inside your authenticated browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Explanation banner */}
          <div className="bg-black border border-zinc-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Why the Userscript is 100% Unstoppable</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Because it executes directly inside your logged-in browser tab at MIT-WPU Courtside, it re-uses your authentic university cookies and ERP session. It avoids all external firewall blocks, CAPTCHA hurdles, and campus intranet restrictions.
            </p>
          </div>

          {/* Step-by-step Setup Guide */}
          <div>
            <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider mb-3">
              3-Step Installation Guide
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-mono font-bold flex items-center justify-center text-[11px] mb-2">
                  1
                </span>
                <span className="font-semibold text-white block mb-1">Install Extension</span>
                <p className="text-zinc-400 text-[11px]">
                  Add <a href="https://www.tampermonkey.net" target="_blank" rel="noreferrer" className="text-white underline font-medium">Tampermonkey</a> or Violentmonkey to Chrome/Edge.
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-mono font-bold flex items-center justify-center text-[11px] mb-2">
                  2
                </span>
                <span className="font-semibold text-white block mb-1">Paste This Script</span>
                <p className="text-zinc-400 text-[11px]">
                  Click the button below to Copy or Download the generated script, then paste into a new Tampermonkey script.
                </p>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-3">
                <span className="w-5 h-5 rounded-full bg-white text-black font-mono font-bold flex items-center justify-center text-[11px] mb-2">
                  3
                </span>
                <span className="font-semibold text-white block mb-1">Open Courtside</span>
                <p className="text-zinc-400 text-[11px]">
                  Go to <a href="https://sports.mitwpu.edu.in/login" target="_blank" rel="noreferrer" className="text-white underline font-medium">sports.mitwpu.edu.in/login</a>. The script auto-authenticates your college credentials and activates the sniper HUD!
                </p>
              </div>
            </div>
          </div>

          {/* Script code display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">
                Tailored for: <span className="font-mono text-white font-bold">{config.collegeEmail || config.studentPrn}</span> (Target: {config.primarySport.toUpperCase()})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-white hover:bg-zinc-200 text-black rounded font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Userscript'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 rounded font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .user.js</span>
                </button>
              </div>
            </div>

            <pre className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-[11px] text-zinc-300 max-h-60 overflow-y-auto leading-relaxed select-all">
              {scriptContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-black flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Script auto-updates when you modify sport preferences in the cockpit.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 rounded font-medium text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
