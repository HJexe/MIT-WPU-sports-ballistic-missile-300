import React, { useState } from 'react';
import { AuditLogItem } from '../types';
import { Terminal, Trash2, Download } from 'lucide-react';

interface AuditConsoleProps {
  logs: AuditLogItem[];
  onClearLogs: () => void;
}

export const AuditConsole: React.FC<AuditConsoleProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = logs.filter((l) => {
    if (filter === 'all') return true;
    return l.type === filter;
  });

  const exportLogs = () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message} (latency: ${l.latencyMs ?? 'N/A'}ms)`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mit_wpu_sniper_logs_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden text-xs">
      {/* Console Header - Modern Monochromatic */}
      <div className="p-3 border-b border-zinc-800 bg-black flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-white" />
          <span className="font-semibold text-white">Execution Telemetry & Audit Stream</span>
          <span className="text-zinc-500 font-mono text-[11px]">({logs.length} events)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded p-0.5 text-[11px]">
            {['all', 'success', 'info', 'warning'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                  filter === f ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onClearLogs}
            className="p-1 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded transition-colors"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={exportLogs}
            className="p-1 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded transition-colors"
            title="Download Logs"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Log Feed */}
      <div className="p-3 bg-black font-mono text-[11px] max-h-56 overflow-y-auto space-y-1.5 select-text">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 py-4 text-center">
            No audit events yet. Fire a test burst or wait for slot release.
          </div>
        ) : (
          filteredLogs.map((log) => {
            return (
              <div
                key={log.id}
                className="flex items-start gap-2 hover:bg-zinc-900/60 p-1 rounded transition-colors"
              >
                <span className="text-zinc-600 shrink-0 select-none">[{log.timestamp}]</span>
                <span className="font-bold shrink-0 uppercase text-[10px] px-1 py-0.2 rounded border bg-zinc-900 border-zinc-700 text-white">
                  {log.type}
                </span>

                <span className="text-zinc-300 flex-1 leading-relaxed">{log.message}</span>

                {log.latencyMs !== undefined && (
                  <span className="text-white font-bold shrink-0 tabular-nums">
                    {log.latencyMs}ms
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
