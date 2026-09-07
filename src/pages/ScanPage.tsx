import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode, ChevronDown, LogOut, CheckCircle, AlertTriangle,
  XCircle, Clock, Wifi, Camera, Loader2, RefreshCw
} from 'lucide-react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

// ── Types ────────────────────────────────────────────────────

const EVENTS = {
  'code-crusade': 'Code Crusade',
  'logic-arena': 'Logic Arena',
  'ui-ux-studio': 'UI/UX Studio',
  'tech-tactics': 'Tech Tactics',
  'pixel-pulse': 'Pixel Pulse',
} as const;

type EventId = keyof typeof EVENTS;

interface CoordInfo {
  id: string;
  name: string;
  assigned_event_id: string;
}

type ScanState =
  | { phase: 'idle' }
  | { phase: 'scanning' }
  | { phase: 'loading' }
  | { phase: 'valid'; participant: { name: string; college: string; department: string; year: string; pass_id: string }; event: string; participant_id: string }
  | { phase: 'confirming' }
  | { phase: 'approved'; name: string; event: string; time: string }
  | { phase: 'duplicate'; name: string; event: string; checked_in_at: string }
  | { phase: 'invalid'; reason: 'INVALID_TOKEN' | 'PAYMENT_PENDING' | 'PASS_CANCELLED' | 'PASS_NOT_ACTIVE' }
  | { phase: 'network_error' }
  | { phase: 'camera_error'; message: string };

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function extractTokenFromUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    // Matches /v/TOKEN or /pass/TOKEN
    const match = url.pathname.match(/^\/(v|pass)\/([a-f0-9]{64})$/);
    if (match) return match[2];
  } catch {
    // Not a URL — check if it's just the 64-char hex token directly
    if (/^[a-f0-9]{64}$/.test(raw.trim())) return raw.trim();
  }
  return null;
}

// ── Coordinator Login ────────────────────────────────────────

const CoordLogin: React.FC<{ onLogin: (coord: CoordInfo) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const r = await fetch('/api/coordinator/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pin }),
    });

    if (r.ok) {
      const j = await r.json();
      onLogin(j.coordinator);
    } else {
      const j = await r.json().catch(() => ({}));
      setError(j.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-4 py-8">
      <div className="grain-overlay" />
      <div className="w-full max-w-xs z-10">
        <div className="text-center mb-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-mustard">VYUGAM 2.0</span>
          <h1 className="font-display text-3xl text-marigold uppercase mt-1">Coordinator</h1>
          <p className="font-mono text-xs text-cream/40 uppercase tracking-wider mt-1">Access</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-carbon border-2 border-marigold shadow-[5px_5px_0_#7A0606] p-6 space-y-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-mustard mb-1.5">
              Coordinator ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. cr01"
              autoComplete="username"
              inputMode="text"
              className="w-full bg-obsidian text-smoke border-2 border-carbon-2 p-3 font-mono text-sm outline-none focus:border-marigold transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-mustard mb-1.5">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoComplete="current-password"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full bg-obsidian text-smoke border-2 border-carbon-2 p-3 font-mono text-sm outline-none focus:border-marigold transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-heading font-extrabold text-base uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian py-4 shadow-[4px_4px_0_#C1121F] hover:-translate-y-0.5 disabled:opacity-60 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
            {loading ? 'Authenticating…' : 'Access Scanner'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Camera Scanner ───────────────────────────────────────────

const Scanner: React.FC<{
  coordinator: CoordInfo;
  onLogout: () => void;
}> = ({ coordinator, onLogout }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventId>(
    (coordinator.assigned_event_id as EventId) || 'code-crusade'
  );
  const [scanState, setScanState] = useState<ScanState>({ phase: 'idle' });
  const [cameraStarted, setCameraStarted] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const isProcessingRef = useRef(false);

  // ── Stop camera ──
  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setCameraStarted(false);
  }, []);

  // ── Start camera ──
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraLoading(true);
    isProcessingRef.current = false;

    try {
      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error, controls) => {
          if (result && !isProcessingRef.current) {
            isProcessingRef.current = true;
            handleScan(result.getText(), controls);
          }
        }
      );
      controlsRef.current = controls;
      setCameraStarted(true);
      setScanState({ phase: 'scanning' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
        setScanState({ phase: 'camera_error', message: 'Camera permission denied. Please allow camera access.' });
      } else if (msg.toLowerCase().includes('notfound') || msg.toLowerCase().includes('no camera')) {
        setScanState({ phase: 'camera_error', message: 'No camera found. Use a device with a camera.' });
      } else {
        setScanState({ phase: 'camera_error', message: `Camera error: ${msg}` });
      }
    }
    setCameraLoading(false);
  }, [selectedEvent]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Handle scanned QR ──
  const handleScan = useCallback(async (raw: string, controls?: IScannerControls) => {
    setScanState({ phase: 'loading' });

    const token = extractTokenFromUrl(raw);
    if (!token) {
      setScanState({ phase: 'invalid', reason: 'INVALID_TOKEN' });
      scheduleReset();
      isProcessingRef.current = false;
      return;
    }

    try {
      const r = await fetch('/api/coordinator/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, event_id: selectedEvent }),
      });

      if (!r.ok) {
        if (r.status === 401) {
          setScanState({ phase: 'network_error' });
          return;
        }
        setScanState({ phase: 'network_error' });
        scheduleReset();
        isProcessingRef.current = false;
        return;
      }

      const data = await r.json();

      switch (data.status) {
        case 'VALID':
          setScanState({
            phase: 'valid',
            participant: data.participant,
            event: data.event,
            participant_id: data.participant_id,
          });
          break;
        case 'ALREADY_CHECKED_IN':
          setScanState({
            phase: 'duplicate',
            name: data.participant.name,
            event: data.event,
            checked_in_at: data.checked_in_at,
          });
          scheduleReset();
          break;
        default:
          setScanState({ phase: 'invalid', reason: data.status });
          scheduleReset();
      }
    } catch {
      setScanState({ phase: 'network_error' });
      scheduleReset();
    }

    isProcessingRef.current = false;
  }, [selectedEvent]);

  // Auto-reset to scanning after a delay
  const scheduleReset = useCallback(() => {
    setTimeout(() => {
      setScanState({ phase: 'scanning' });
      isProcessingRef.current = false;
    }, 3500);
  }, []);

  // ── Confirm Entry ──
  const confirmEntry = useCallback(async () => {
    if (scanState.phase !== 'valid') return;
    const { participant_id } = scanState;
    setScanState({ phase: 'confirming' });

    try {
      const r = await fetch('/api/coordinator/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_id, event_id: selectedEvent }),
      });

      const data = await r.json();

      if (!r.ok) {
        if (data.status === 'ALREADY_CHECKED_IN') {
          setScanState({ phase: 'duplicate', name: 'Participant', event: data.event, checked_in_at: new Date().toISOString() });
        } else {
          setScanState({ phase: 'network_error' });
        }
        scheduleReset();
        return;
      }

      setScanState({
        phase: 'approved',
        name: data.participant_name,
        event: data.event,
        time: data.scanned_at,
      });

      // Auto-return to scanning after success
      setTimeout(() => {
        setScanState({ phase: 'scanning' });
        isProcessingRef.current = false;
      }, 2500);
    } catch {
      setScanState({ phase: 'network_error' });
      scheduleReset();
    }
  }, [scanState, selectedEvent, scheduleReset]);

  const resetToScan = () => {
    setScanState({ phase: cameraStarted ? 'scanning' : 'idle' });
    isProcessingRef.current = false;
  };

  // ── Render status overlay ──
  const renderOverlay = () => {
    switch (scanState.phase) {
      case 'scanning':
        return null; // No overlay — camera is live

      case 'loading':
      case 'confirming':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-obsidian/80">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-12 h-12 text-marigold animate-spin" />
              <p className="font-mono text-xs text-marigold uppercase tracking-widest">
                {scanState.phase === 'confirming' ? 'Recording Entry…' : 'Verifying Pass…'}
              </p>
            </div>
          </div>
        );

      case 'valid':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-400 mb-6">Valid VYUGAM Pass</p>

            <div className="w-full bg-carbon border-2 border-emerald-500 p-5 mb-6 max-w-xs">
              <div className="space-y-2 text-left mb-4">
                <Field label="Participant" value={scanState.participant.name} highlight />
                <Field label="College" value={scanState.participant.college} />
                <Field label="Department" value={`${scanState.participant.department} · ${scanState.participant.year}`} />
                <Field label="Pass ID" value={scanState.participant.pass_id ?? '—'} />
              </div>
              <div className="border-t border-emerald-500/20 pt-3">
                <Field label="Event" value={scanState.event} highlight />
                <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 mt-2">Ready for Entry</p>
              </div>
            </div>

            <button
              onClick={confirmEntry}
              className="w-full max-w-xs font-heading font-extrabold text-xl uppercase tracking-wider text-obsidian bg-emerald-500 border-2 border-obsidian py-5 shadow-[5px_5px_0_#065f46] active:translate-y-1 active:shadow-none transition-all"
            >
              ✓ CONFIRM ENTRY
            </button>
            <button onClick={resetToScan} className="mt-4 font-mono text-xs text-cream/40 uppercase">
              Cancel
            </button>
          </div>
        );

      case 'approved':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-5">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="font-display text-3xl text-emerald-400 uppercase mb-2">Entry Approved</h2>
            <p className="font-heading font-extrabold text-xl text-smoke uppercase">{scanState.name}</p>
            <p className="font-mono text-sm text-marigold mt-1">{scanState.event}</p>
            <p className="font-mono text-xs text-cream/40 mt-1">{formatTime(scanState.time)}</p>
          </div>
        );

      case 'duplicate':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6">
            <AlertTriangle className="w-14 h-14 text-amber-400 mb-4" />
            <h2 className="font-display text-2xl text-amber-400 uppercase mb-3">Already Checked In</h2>
            <p className="font-heading font-extrabold text-xl text-smoke uppercase">{scanState.name}</p>
            <p className="font-mono text-sm text-marigold mt-1">{scanState.event}</p>
            <p className="font-mono text-xs text-cream/40 mt-2">
              Checked in at {formatTime(scanState.checked_in_at)}
            </p>
            <p className="font-mono text-[10px] text-cream/30 mt-4 uppercase">Returning to scanner…</p>
          </div>
        );

      case 'invalid':
        const invalidMsgs = {
          INVALID_TOKEN: { title: 'Invalid Pass', msg: 'This QR could not be verified.', color: 'text-red-400', icon: <XCircle className="w-14 h-14 text-red-500" /> },
          PAYMENT_PENDING: { title: 'Pass Not Active', msg: 'Payment verification is still pending.', color: 'text-amber-400', icon: <Clock className="w-14 h-14 text-amber-400" /> },
          PASS_CANCELLED: { title: 'Pass Inactive', msg: 'This pass has been cancelled.', color: 'text-red-400', icon: <XCircle className="w-14 h-14 text-red-500" /> },
          PASS_NOT_ACTIVE: { title: 'Pass Not Active', msg: 'Please contact the VYUGAM team.', color: 'text-amber-400', icon: <AlertTriangle className="w-14 h-14 text-amber-400" /> },
        }[scanState.reason];

        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6 text-center">
            <div className="mb-4">{invalidMsgs.icon}</div>
            <h2 className={`font-display text-2xl uppercase mb-2 ${invalidMsgs.color}`}>{invalidMsgs.title}</h2>
            <p className="font-body text-sm text-cream/70">{invalidMsgs.msg}</p>
            <p className="font-mono text-[10px] text-cream/30 mt-4 uppercase">Returning to scanner…</p>
          </div>
        );

      case 'network_error':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6 text-center">
            <Wifi className="w-14 h-14 text-red-500 mb-4" />
            <h2 className="font-display text-2xl text-red-400 uppercase mb-2">Connection Error</h2>
            <p className="font-body text-sm text-cream/70 mb-6">
              Unable to verify this pass. Check network and try again.
            </p>
            <button
              onClick={resetToScan}
              className="font-heading font-bold text-sm uppercase tracking-wider text-obsidian bg-marigold px-6 py-3 border-2 border-obsidian flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        );

      case 'camera_error':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/95 p-6 text-center">
            <Camera className="w-14 h-14 text-red-500 mb-4" />
            <h2 className="font-display text-xl text-red-400 uppercase mb-3">Camera Access Required</h2>
            <p className="font-body text-sm text-cream/70 mb-6">{scanState.message}</p>
            <button
              onClick={() => { setScanState({ phase: 'idle' }); startCamera(); }}
              className="font-heading font-bold text-sm uppercase tracking-wider text-obsidian bg-marigold px-6 py-3 border-2 border-obsidian flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        );

      case 'idle':
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      {/* Header */}
      <header className="bg-obsidian border-b-2 border-marigold px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-mustard">VYUGAM 2.0</p>
          <p className="font-heading font-extrabold text-base text-smoke uppercase">{coordinator.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="font-mono text-[10px] uppercase text-cream/40 hover:text-red-400 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </header>

      {/* Event selector */}
      <div className="px-4 py-3 bg-carbon/50 border-b border-carbon-2 flex-shrink-0">
        <label className="font-mono text-[9px] uppercase tracking-widest text-mustard block mb-1.5">
          Select Event
        </label>
        <div className="relative">
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value as EventId);
              if (cameraStarted) {
                setScanState({ phase: 'scanning' });
                isProcessingRef.current = false;
              }
            }}
            className="w-full bg-obsidian text-smoke border-2 border-marigold px-4 py-3 font-heading font-bold text-sm uppercase tracking-wider appearance-none outline-none pr-10"
          >
            {Object.entries(EVENTS).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-marigold pointer-events-none" />
        </div>
      </div>

      {/* Camera viewfinder */}
      <div className="relative flex-1 bg-obsidian overflow-hidden min-h-[50vh]">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* QR alignment guide (only shown while scanning) */}
        {scanState.phase === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-56 h-56">
              {/* Corner brackets */}
              {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                <div key={i} className={`absolute w-8 h-8 ${pos}`}>
                  <div className={`absolute border-marigold border-2 w-8 h-8 ${
                    i === 0 ? 'border-r-0 border-b-0' :
                    i === 1 ? 'border-l-0 border-b-0' :
                    i === 2 ? 'border-r-0 border-t-0' :
                    'border-l-0 border-t-0'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start camera prompt */}
        {scanState.phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian p-6 text-center">
            <QrCode className="w-16 h-16 text-marigold/30 mb-6" />
            <p className="font-heading font-bold text-sm uppercase tracking-wider text-cream/50 mb-6">
              Ready to scan VYUGAM Passes
            </p>
            <button
              onClick={startCamera}
              disabled={cameraLoading}
              className="font-heading font-extrabold text-base uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian px-8 py-4 shadow-[4px_4px_0_#C1121F] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              {cameraLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              {cameraLoading ? 'Opening Camera…' : 'Open Camera'}
            </button>
          </div>
        )}

        {/* Status overlays */}
        {renderOverlay()}
      </div>

      {/* Status bar */}
      <div className="flex-shrink-0 bg-carbon border-t border-marigold/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            scanState.phase === 'scanning' ? 'bg-emerald-400 animate-pulse' :
            scanState.phase === 'idle' ? 'bg-carbon-2 border border-marigold/20' :
            'bg-marigold'
          }`} />
          <span className="font-mono text-[10px] uppercase tracking-wider text-cream/50">
            {scanState.phase === 'scanning' ? 'Ready to Scan' :
             scanState.phase === 'idle' ? 'Camera Off' :
             scanState.phase === 'loading' ? 'Verifying…' :
             scanState.phase === 'confirming' ? 'Recording…' :
             scanState.phase === 'approved' ? 'Entry Approved' :
             'Processing'}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-marigold/60">
          {EVENTS[selectedEvent]}
        </span>
      </div>
    </div>
  );
};

// ── Helper ───────────────────────────────────────────────────

const Field: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div>
    <p className="font-mono text-[9px] uppercase tracking-wider text-mustard/60">{label}</p>
    <p className={`font-heading font-extrabold text-base ${highlight ? 'text-smoke' : 'text-cream/80'} uppercase`}>
      {value}
    </p>
  </div>
);

// ── Main Page ────────────────────────────────────────────────

export const ScanPage: React.FC = () => {
  const [coordinator] = useState<CoordInfo>({
    id: 'CR-01',
    name: 'Coordinator',
    assigned_event_id: 'code-crusade',
  });

  return (
    <Scanner
      coordinator={coordinator}
      onLogout={() => {
        window.location.href = '/';
      }}
    />
  );
};

export default ScanPage;
