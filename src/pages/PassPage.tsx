import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QrCode, MapPin, Calendar, AlertTriangle, XCircle, Clock, Loader2 } from 'lucide-react';

interface PassData {
  status: 'ACTIVE' | 'PENDING' | 'CANCELLED' | 'INVALID_TOKEN';
  name?: string;
  college?: string;
  department?: string;
  year?: string;
  pass_id?: string;
  qr_data_url?: string;
  event_date?: string;
}

export const PassPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<PassData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setData({ status: 'INVALID_TOKEN' });
      setLoading(false);
      return;
    }

    fetch(`/api/pass/${token}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json as PassData);
        setLoading(false);
      })
      .catch(() => {
        setData({ status: 'INVALID_TOKEN' });
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-marigold animate-spin" />
          <p className="font-mono text-xs text-mustard uppercase tracking-widest">Loading Pass…</p>
        </div>
      </div>
    );
  }

  if (!data || data.status === 'INVALID_TOKEN') return <InvalidPass />;
  if (data.status === 'PENDING') return <PendingPass />;
  if (data.status === 'CANCELLED') return <CancelledPass passId={data.pass_id} />;

  // Active Pass
  return (
    <div className="min-h-screen bg-obsidian flex flex-col items-center justify-start pt-6 pb-12 px-4">
      <div className="grain-overlay" />

      {/* Page title */}
      <div className="text-center mb-6 z-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-mustard">
          P.A. College of Engineering and Technology
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-marigold/60 mt-0.5">
          Dept. of Information Technology
        </p>
      </div>

      {/* ── THE PASS CARD ─────────────────────────────── */}
      <div className="relative w-full max-w-sm z-10">
        {/* Outer glow */}
        <div className="absolute -inset-1 bg-gradient-to-b from-marigold/30 via-ember/10 to-transparent blur-xl pointer-events-none" />

        <div className="relative bg-[#0A0806] border-2 border-marigold shadow-[8px_8px_0_#7A0606] overflow-hidden">
          {/* Top gradient stripe */}
          <div className="h-1.5 bg-gradient-to-r from-oxblood via-ember to-marigold" />

          {/* Pass header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-mustard">VYUGAM 2.0</p>
              <p className="font-heading font-extrabold text-xs uppercase text-smoke tracking-wider mt-0.5">
                Symposium Pass
              </p>
            </div>
            <div className="w-7 h-7 bg-gradient-to-br from-ember to-marigold clip-spark animate-spark" />
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-marigold/20" />

          {/* Participant info */}
          <div className="px-5 pt-4 pb-3">
            <p className="font-mono text-[9px] uppercase tracking-widest text-mustard/60 mb-1">Pass Holder</p>
            <h1 className="font-heading font-extrabold text-2xl text-smoke uppercase tracking-wide leading-tight">
              {data.name}
            </h1>
            <p className="font-mono text-xs text-cream/60 mt-1">{data.college}</p>
            <p className="font-mono text-[10px] text-cream/40 mt-0.5">
              {data.department} &middot; {data.year}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center px-5 pb-4">
            <div className="bg-white p-3 border-2 border-marigold shadow-[4px_4px_0_#7A0606]">
              {data.qr_data_url ? (
                <img
                  src={data.qr_data_url}
                  alt="VYUGAM Pass QR Code"
                  className="w-52 h-52 object-contain"
                  draggable={false}
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-obsidian/30" />
                </div>
              )}
            </div>
          </div>

          {/* Pass ID */}
          <div className="flex justify-center pb-3">
            <div className="bg-marigold/10 border border-marigold/30 px-4 py-1">
              <p className="font-mono text-xs font-bold tracking-[0.15em] text-marigold text-center">
                {data.pass_id}
              </p>
            </div>
          </div>

          {/* Bottom info strip */}
          <div className="bg-marigold/8 border-t border-dashed border-marigold/30 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-marigold flex-shrink-0" />
                <span className="font-heading font-bold text-xs text-smoke uppercase">24 Sept 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-marigold flex-shrink-0" />
                <span className="font-heading font-bold text-xs text-smoke uppercase">IT Block · PACET</span>
              </div>
            </div>
          </div>

          {/* Active badge */}
          <div className="bg-emerald-500/10 border-t border-emerald-500/30 px-5 py-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              Pass Active
            </span>
          </div>

          {/* Bottom gradient stripe */}
          <div className="h-px bg-gradient-to-r from-transparent via-marigold/50 to-transparent" />
        </div>

        {/* Shadow layer */}
        <div className="absolute -bottom-2 -right-2 w-full h-full border border-marigold/10 -z-10" />
      </div>

      {/* Instructions */}
      <div className="mt-8 max-w-sm w-full z-10">
        <div className="bg-carbon/60 border border-marigold/20 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-marigold font-bold mb-3 text-center">
            Event Day Instructions
          </p>
          <div className="space-y-2">
            {[
              'Keep this pass accessible on your phone',
              'Your QR code is your entry credential',
              'Present to event coordinators before participating',
              'One pass. Multiple arenas. No re-registration.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-marigold font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
                <p className="font-body text-xs text-cream/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] text-mustard/40 uppercase tracking-wider text-center z-10">
        VYUGAM 2.0 &mdash; Dept. of IT, PACET &copy; 2026
      </p>
    </div>
  );
};

// ── Status Screens ──────────────────────────────────────────

const InvalidPass: React.FC = () => (
  <StatusScreen
    icon={<XCircle className="w-14 h-14 text-red-500" />}
    accent="border-red-500"
    badge="Invalid Pass"
    badgeColor="bg-red-500/10 text-red-400 border-red-500/30"
    title="Pass Not Found"
    message="This VYUGAM Pass could not be verified. The QR code may be invalid or expired."
    footer="Contact the VYUGAM team if you believe this is an error."
  />
);

const PendingPass: React.FC = () => (
  <StatusScreen
    icon={<Clock className="w-14 h-14 text-amber-400" />}
    accent="border-amber-500"
    badge="Pending Verification"
    badgeColor="bg-amber-500/10 text-amber-400 border-amber-500/30"
    title="Pass Not Active Yet"
    message="Your payment is being manually verified by the VYUGAM team. Your pass will be activated after verification."
    footer="Once verified, you will receive your pass link by email."
  />
);

const CancelledPass: React.FC<{ passId?: string | null }> = ({ passId }) => (
  <StatusScreen
    icon={<AlertTriangle className="w-14 h-14 text-red-500" />}
    accent="border-red-500"
    badge="Pass Inactive"
    badgeColor="bg-red-500/10 text-red-400 border-red-500/30"
    title="Pass Inactive"
    message="This VYUGAM Pass is currently inactive and cannot be used for event entry."
    footer="Please contact the VYUGAM team for assistance."
    passId={passId}
  />
);

const StatusScreen: React.FC<{
  icon: React.ReactNode;
  accent: string;
  badge: string;
  badgeColor: string;
  title: string;
  message: string;
  footer: string;
  passId?: string | null;
}> = ({ icon, accent, badge, badgeColor, title, message, footer, passId }) => (
  <div className="min-h-screen bg-obsidian flex items-center justify-center px-4">
    <div className={`w-full max-w-sm bg-carbon border-2 ${accent} shadow-[6px_6px_0_#7A0606] p-8 text-center`}>
      <div className="flex justify-center mb-5">{icon}</div>

      <span className={`font-mono text-[10px] uppercase tracking-widest border px-3 py-1 inline-block mb-4 ${badgeColor}`}>
        {badge}
      </span>

      <h2 className="font-display text-2xl text-smoke uppercase mb-3">{title}</h2>
      <p className="font-body text-sm text-cream/70 leading-relaxed mb-4">{message}</p>

      {passId && (
        <p className="font-mono text-xs text-mustard/60 mb-4">Pass ID: {passId}</p>
      )}

      <p className="font-mono text-[10px] text-mustard/40 uppercase tracking-wider">{footer}</p>
    </div>
  </div>
);

export default PassPage;
