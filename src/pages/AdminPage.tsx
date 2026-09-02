import React, { useState, useEffect, useCallback } from 'react';
import {
  LogOut, CheckCircle, XCircle, Clock, RefreshCw, Ban, Send,
  Users, Ticket, TrendingUp, Eye, ChevronDown, X, Loader2,
  ShieldCheck, AlertTriangle, Search, BarChart2
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────

interface Participant {
  id: string;
  pass_id: string | null;
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  utr: string | null;
  payment_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  pass_status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
  created_at: string;
  verified_at: string | null;
  has_screenshot: boolean;
  payment_screenshot_url?: string | null;
  checkins?: { event_id: string; event_name: string; coordinator_id: string; scanned_at: string }[];
}

interface CheckinSummary {
  summary: {
    total_passes: number;
    active_passes: number;
    pending_passes: number;
    total_checkins: number;
    event_counts: { event_id: string; event_name: string; count: number }[];
  };
  checkins: {
    participant_name: string;
    participant_pass_id: string;
    college: string;
    event_name: string;
    coordinator_id: string;
    scanned_at: string;
  }[];
}

type TabId = 'registrations' | 'attendance';
type FilterId = 'all' | 'pending' | 'verified' | 'rejected' | 'active' | 'cancelled';

// ── Helpers ──────────────────────────────────────────────────

function formatTime(raw?: string | null): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) return '—';
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return '—';
  }
}

function PaymentBadge({ status }: { status: Participant['payment_status'] }) {
  const cfg = {
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    VERIFIED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    REJECTED: 'bg-red-500/15 text-red-400 border-red-500/40',
  }[status];
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 ${cfg}`}>
      {status}
    </span>
  );
}

function PassBadge({ status }: { status: Participant['pass_status'] }) {
  const cfg = {
    PENDING: 'bg-carbon text-cream/50 border-carbon-2',
    ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
    CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/40',
  }[status];
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-0.5 ${cfg}`}>
      {status}
    </span>
  );
}

// ── Admin Login ──────────────────────────────────────────────

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (r.ok) {
      onLogin();
    } else {
      const j = await r.json().catch(() => ({}));
      setError(j.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="grain-overlay" />
      <div className="relative w-full max-w-sm z-10">
        <div className="text-center mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-mustard">
            VYUGAM 2.0
          </span>
          <h1 className="font-display text-4xl text-marigold uppercase mt-1">Admin Panel</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ShieldCheck className="w-4 h-4 text-ember" />
            <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">Authorized Access Only</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-carbon border-2 border-marigold p-6 shadow-[6px_6px_0_#7A0606]">
          <div className="mb-4">
            <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              className="w-full bg-obsidian text-smoke border-2 border-carbon-2 p-3 font-mono text-sm outline-none focus:border-marigold transition-colors"
            />
          </div>
          <div className="mb-6">
            <label className="block font-heading font-bold text-xs uppercase text-marigold mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-obsidian text-smoke border-2 border-carbon-2 p-3 font-mono text-sm outline-none focus:border-marigold transition-colors"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-heading font-extrabold text-sm uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian py-3 shadow-[4px_4px_0_#C1121F] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#C1121F] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {loading ? 'Authenticating…' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Participant Detail Modal ──────────────────────────────────

const ParticipantModal: React.FC<{
  participant: Participant;
  onClose: () => void;
  onAction: (action: 'verify' | 'reject' | 'cancel' | 'resend', id: string) => Promise<void>;
}> = ({ participant, onClose, onAction }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [detail, setDetail] = useState<Participant>(participant);

  useEffect(() => {
    fetch(`/api/admin/registration/${participant.id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((j) => {
        if (j && !j.error) setDetail(j);
      })
      .catch((err) => {
        console.error('[ParticipantModal] Error loading detail:', err);
      });
  }, [participant.id]);

  const handleAction = async (action: 'verify' | 'reject' | 'cancel' | 'resend') => {
    setLoading(action);
    await onAction(action, detail.id);
    // Refresh detail
    const r = await fetch(`/api/admin/registration/${detail.id}`);
    if (r.ok) setDetail(await r.json());
    setLoading(null);
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-start justify-center bg-obsidian/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-carbon border-2 border-marigold shadow-[8px_8px_0_#7A0606] my-8">
        {/* Header */}
        <div className="bg-marigold/10 border-b border-marigold/30 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-mustard">
              Participant Detail
            </p>
            <h3 className="font-heading font-extrabold text-xl text-smoke uppercase mt-0.5">
              {detail.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-cream/60 hover:text-marigold transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status row */}
          <div className="flex flex-wrap gap-2 items-center">
            <PaymentBadge status={detail.payment_status} />
            <PassBadge status={detail.pass_status} />
            {detail.pass_id && (
              <span className="font-mono text-xs text-marigold border border-marigold/30 px-2 py-0.5">
                {detail.pass_id}
              </span>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Email', value: detail.email },
              { label: 'Phone', value: detail.phone },
              { label: 'College', value: detail.college },
              { label: 'Department', value: detail.department },
              { label: 'Year', value: detail.year },
              { label: 'Registered', value: formatTime(detail.created_at) },
              { label: 'UTR / Transaction ID', value: detail.utr || '—' },
              { label: 'Verified At', value: detail.verified_at ? formatTime(detail.verified_at) : '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-obsidian border border-carbon-2 px-4 py-3">
                <p className="font-mono text-[9px] uppercase tracking-wider text-mustard/60 mb-1">{label}</p>
                <p className="font-body text-sm text-cream">{value}</p>
              </div>
            ))}
          </div>

          {/* Screenshot */}
          {detail.payment_screenshot_url && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-mustard mb-2">
                Payment Screenshot
              </p>
              <div className="border-2 border-marigold/40 overflow-hidden">
                <img
                  src={detail.payment_screenshot_url}
                  alt="Payment screenshot"
                  className="w-full max-h-96 object-contain bg-white"
                />
              </div>
            </div>
          )}
          {!detail.payment_screenshot_url && (
            <div className="border-2 border-dashed border-carbon-2 p-6 text-center">
              <p className="font-mono text-xs text-cream/30">No screenshot uploaded</p>
            </div>
          )}

          {/* Check-in history */}
          {detail.checkins && detail.checkins.length > 0 && (
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-mustard mb-2">
                Check-In History
              </p>
              <div className="space-y-2">
                {detail.checkins.map((c, i) => (
                  <div key={i} className="bg-obsidian border border-emerald-500/20 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-heading font-bold text-sm text-smoke">{c.event_name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[10px] text-mustard/60">{c.coordinator_id}</p>
                      <p className="font-mono text-[10px] text-cream/50">{formatTime(c.scanned_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-marigold/20">
            {detail.payment_status === 'PENDING' && (
              <>
                <button
                  onClick={() => handleAction('verify')}
                  disabled={!!loading}
                  className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-obsidian bg-emerald-500 border-2 border-obsidian px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading === 'verify' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Verify Payment
                </button>
                <button
                  onClick={() => handleAction('reject')}
                  disabled={!!loading}
                  className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-smoke bg-red-600 border-2 border-obsidian px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Reject
                </button>
              </>
            )}
            {detail.pass_status === 'ACTIVE' && (
              <>
                <button
                  onClick={() => handleAction('resend')}
                  disabled={!!loading}
                  className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading === 'resend' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Resend Pass Email
                </button>
                <button
                  onClick={() => handleAction('cancel')}
                  disabled={!!loading}
                  className="flex items-center gap-2 font-heading font-bold text-sm uppercase tracking-wider text-smoke bg-red-600/80 border-2 border-red-700 px-5 py-2.5 hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                >
                  {loading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                  Cancel Pass
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Admin Dashboard ─────────────────────────────────────

export const AdminPage: React.FC = () => {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabId>('registrations');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filter, setFilter] = useState<FilterId>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Participant | null>(null);
  const [checkins, setCheckins] = useState<CheckinSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  // Check session
  useEffect(() => {
    fetch('/api/admin/login')
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  const showToast = useCallback((msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setRefreshing(true);
    const r = await fetch(`/api/admin/registrations?status=${filter}`);
    if (r.ok) {
      const j = await r.json();
      setParticipants(j.participants || []);
    }
    setRefreshing(false);
  }, [filter]);

  const fetchCheckins = useCallback(async () => {
    setRefreshing(true);
    const r = await fetch('/api/admin/checkins');
    if (r.ok) setCheckins(await r.json());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (authed !== true) return;
    if (tab === 'registrations') fetchRegistrations();
    else fetchCheckins();
  }, [authed, tab, fetchRegistrations, fetchCheckins]);

  const handleAction = async (action: string, id: string) => {
    const r = await fetch(`/api/admin/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participant_id: id }),
    });
    const j = await r.json();
    if (r.ok) {
      showToast(j.message || 'Done', 'ok');
      fetchRegistrations();
    } else {
      showToast(j.error || 'Action failed', 'err');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
  };

  // ── Loading state ──
  if (authed === null) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-marigold animate-spin" />
      </div>
    );
  }

  if (authed === false) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  // Filtered + searched participants
  const displayed = participants.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      (p.pass_id ?? '').toLowerCase().includes(q)
    );
  });

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'verified', label: 'Verified' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'active', label: 'Active' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-[#060404] text-smoke">
      <div className="grain-overlay" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] font-mono text-xs px-4 py-3 border shadow-md flex items-center gap-2 ${
          toast.type === 'ok'
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : 'bg-red-500/10 border-red-500/40 text-red-400'
        }`}>
          {toast.type === 'ok' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b-2 border-marigold bg-obsidian sticky top-0 z-[500] px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-mustard">VYUGAM 2.0</p>
            <h1 className="font-display text-xl text-marigold uppercase leading-none">Admin Panel</h1>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cream/60 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-carbon-2 px-4 md:px-8 bg-obsidian/80">
        <div className="flex gap-0">
          {([
            { id: 'registrations', label: 'Registrations', icon: <Users className="w-3.5 h-3.5" /> },
            { id: 'attendance', label: 'Attendance', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          ] as { id: TabId; label: string; icon: React.ReactNode }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 font-heading font-bold text-xs uppercase tracking-wider px-5 py-3 border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-marigold text-marigold'
                  : 'border-transparent text-cream/50 hover:text-cream'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        {/* ── REGISTRATIONS TAB ── */}
        {tab === 'registrations' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-marigold/50" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, college, pass ID…"
                  className="w-full bg-carbon border-2 border-carbon-2 text-smoke pl-9 pr-4 py-2.5 font-mono text-xs outline-none focus:border-marigold transition-colors"
                />
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
                      filter === f.id
                        ? 'bg-marigold text-obsidian border-obsidian'
                        : 'text-cream/60 border-carbon-2 hover:border-marigold/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  onClick={fetchRegistrations}
                  className="font-mono text-[10px] uppercase tracking-wider text-marigold border border-marigold/40 px-3 py-1.5 hover:bg-marigold/10 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Count */}
            <p className="font-mono text-[10px] text-mustard/60 uppercase mb-3">
              {displayed.length} participant{displayed.length !== 1 ? 's' : ''}
            </p>

            {/* Table */}
            {displayed.length === 0 ? (
              <div className="bg-carbon border-2 border-carbon-2 p-12 text-center">
                <p className="font-mono text-sm text-cream/30">No registrations found</p>
              </div>
            ) : (
              <div className="bg-carbon border-2 border-carbon-2 overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-marigold/20">
                      {['Pass ID', 'Name', 'College', 'Payment', 'Pass', 'Registered'].map((h) => (
                        <th key={h} className="font-mono text-[9px] uppercase tracking-wider text-mustard/60 px-4 py-3">
                          {h}
                        </th>
                      ))}
                      <th className="font-mono text-[9px] uppercase tracking-wider text-mustard/60 px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.map((p, i) => (
                      <tr
                        key={p.id}
                        className={`border-b border-carbon-2 hover:bg-obsidian/60 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-obsidian/20'}`}
                        onClick={() => setSelected(p)}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-marigold">{p.pass_id || '—'}</td>
                        <td className="px-4 py-3">
                          <p className="font-heading font-bold text-sm text-smoke">{p.name}</p>
                          <p className="font-mono text-[10px] text-cream/40">{p.email}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-cream/70 max-w-[150px] truncate">{p.college}</td>
                        <td className="px-4 py-3"><PaymentBadge status={p.payment_status} /></td>
                        <td className="px-4 py-3"><PassBadge status={p.pass_status} /></td>
                        <td className="px-4 py-3 font-mono text-[10px] text-cream/40">{formatTime(p.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                            className="font-mono text-[10px] uppercase text-marigold border border-marigold/40 px-2 py-1 hover:bg-marigold/10 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ATTENDANCE TAB ── */}
        {tab === 'attendance' && (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={fetchCheckins}
                className="font-mono text-[10px] uppercase tracking-wider text-marigold border border-marigold/40 px-3 py-1.5 hover:bg-marigold/10 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {checkins ? (
              <>
                {/* Summary cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Passes', value: checkins.summary.total_passes, icon: <Ticket className="w-5 h-5 text-marigold" /> },
                    { label: 'Active Passes', value: checkins.summary.active_passes, icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
                    { label: 'Pending', value: checkins.summary.pending_passes, icon: <Clock className="w-5 h-5 text-amber-400" /> },
                    { label: 'Total Check-ins', value: checkins.summary.total_checkins, icon: <TrendingUp className="w-5 h-5 text-marigold" /> },
                  ].map((card) => (
                    <div key={card.label} className="bg-carbon border-2 border-carbon-2 p-5">
                      <div className="flex items-center gap-2 mb-2">{card.icon}</div>
                      <div className="font-display text-3xl text-smoke">{card.value}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-mustard/60 mt-1">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Per-event breakdown */}
                <div className="mb-8">
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-marigold mb-4">
                    Check-ins by Event
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {checkins.summary.event_counts.map((e) => (
                      <div key={e.event_id} className="bg-carbon border border-carbon-2 p-4 flex items-center justify-between">
                        <div>
                          <p className="font-heading font-bold text-sm text-smoke">{e.event_name}</p>
                          <p className="font-mono text-[9px] text-mustard/50 uppercase">{e.event_id}</p>
                        </div>
                        <div className="font-display text-3xl text-marigold">{e.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check-in log */}
                <div>
                  <h3 className="font-heading font-extrabold text-sm uppercase tracking-wider text-marigold mb-4">
                    Recent Check-ins
                  </h3>
                  {checkins.checkins.length === 0 ? (
                    <div className="bg-carbon border-2 border-carbon-2 p-10 text-center">
                      <p className="font-mono text-sm text-cream/30">No check-ins yet</p>
                    </div>
                  ) : (
                    <div className="bg-carbon border-2 border-carbon-2 overflow-x-auto">
                      <table className="w-full text-left min-w-[550px]">
                        <thead>
                          <tr className="border-b border-marigold/20">
                            {['Pass ID', 'Participant', 'Event', 'Coordinator', 'Time'].map((h) => (
                              <th key={h} className="font-mono text-[9px] uppercase tracking-wider text-mustard/60 px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {checkins.checkins.map((c, i) => (
                            <tr key={i} className={`border-b border-carbon-2 ${i % 2 === 0 ? '' : 'bg-obsidian/20'}`}>
                              <td className="px-4 py-3 font-mono text-xs text-marigold">{c.participant_pass_id}</td>
                              <td className="px-4 py-3">
                                <p className="font-heading font-bold text-sm text-smoke">{c.participant_name}</p>
                                <p className="font-mono text-[10px] text-cream/40">{c.college}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5">
                                  {c.event_name}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-cream/60">{c.coordinator_id}</td>
                              <td className="px-4 py-3 font-mono text-[10px] text-cream/40">{formatTime(c.scanned_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-marigold animate-spin" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Participant Modal */}
      {selected && (
        <ParticipantModal
          participant={selected}
          onClose={() => setSelected(null)}
          onAction={async (action, id) => {
            await handleAction(action, id);
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;
