import { useEffect, useMemo, useState, type ReactElement } from 'react';
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Database,
  ExternalLink,
  Gauge,
  LayoutDashboard,
  RefreshCcw,
  Route,
  ShieldCheck,
  Terminal,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAlerts, fetchFleetSummary, fetchTelemetry, fetchVehicles } from './api';
import type { Alert, FleetSummary, TelemetrySummary, Vehicle } from './types';

type View = 'portal' | 'dashboard';

type ApiEvent = {
  ts: string;
  label: string;
  status: 'ok' | 'err';
  json: unknown;
};

const API_BASE = 'http://localhost:5112';

const VEHICLE_ICON: Record<string, ReactElement> = {
  Truck: <Truck size={18} className="text-blue-400" />,
};

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
  Idle: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
  Offline: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function StatTile({
  label,
  value,
  Icon,
  valueClassName,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  valueClassName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
    >
      <Icon size={84} className="absolute -right-2 -bottom-3 text-slate-800" />
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${valueClassName}`}>{value}</p>
    </motion.div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
      <motion.div
        className={`h-1.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

function FleetPerformance({ summary }: { summary: FleetSummary | null }) {
  const metrics = [
    { label: 'Safety', value: summary?.performance.safety ?? 82, color: 'bg-emerald-500' },
    { label: 'Compliance', value: summary?.performance.compliance ?? 91, color: 'bg-blue-500' },
    { label: 'Fuel Efficiency', value: summary?.performance.fuelEfficiency ?? 61, color: 'bg-amber-400' },
    { label: 'Utilisation', value: summary?.performance.utilisation ?? 75, color: 'bg-purple-500' },
  ];
  return (
    <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl p-6">
      <h3 className="font-bold uppercase tracking-widest text-xs text-slate-400 mb-4 flex items-center gap-2">
        <Activity size={14} className="text-blue-400" /> Fleet Performance
      </h3>
      <div className="space-y-4">
        {metrics.map(({ label, value, color }) => (
          <div key={label}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">{label}</span>
              <span className="text-white font-bold">{value}%</span>
            </div>
            <ProgressBar value={value} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VehicleModal({
  vehicle,
  onClose,
}: {
  vehicle: Vehicle;
  onClose: () => void;
}) {
  const [telemetry, setTelemetry] = useState<TelemetrySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const month = new Date().getMonth() + 1;

  useEffect(() => {
    fetchTelemetry(vehicle.id, month)
      .then(setTelemetry)
      .catch(() => setError('No telemetry data for this vehicle/month'))
      .finally(() => setLoading(false));
  }, [vehicle.id, month]);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl"
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Truck size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white uppercase tracking-tight">{vehicle.name}</h3>
              <p className="text-slate-500 text-xs">{vehicle.location} · {vehicle.type}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Status', value: vehicle.status, color: vehicle.status === 'Active' ? 'text-emerald-400' : vehicle.status === 'Idle' ? 'text-amber-400' : 'text-slate-400' },
              { label: 'Speed', value: `${vehicle.speedKmh} km/h`, color: 'text-white' },
              { label: 'Fuel', value: `${vehicle.fuelPercent}%`, color: vehicle.fuelPercent < 25 ? 'text-red-400' : 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-slate-500 text-xs mb-1">{label}</p>
                <p className={`font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
              <Terminal size={12} /> Monthly Telemetry — Month {month}
              <span className="font-mono text-slate-600">GET /api/telemetry/summary?vehicleId={vehicle.id}&month={month}</span>
            </p>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <div className="w-4 h-4 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                Fetching from API...
              </div>
            ) : error ? (
              <p className="text-slate-500 text-sm italic">{error}</p>
            ) : telemetry ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Avg Speed', value: `${telemetry.avgSpeedKmh} km/h`, Icon: Gauge },
                  { label: 'Max Speed', value: `${telemetry.maxSpeedKmh} km/h`, Icon: Zap },
                  { label: 'Distance', value: `${telemetry.distanceKm.toLocaleString()} km`, Icon: Route },
                  { label: 'Engine Hours', value: `${telemetry.engineHours}h`, Icon: Activity },
                  { label: 'Speeding Events', value: `${telemetry.speedingEvents}`, Icon: AlertTriangle },
                  { label: 'Harsh Braking', value: `${telemetry.harshBrakingEvents}`, Icon: AlertTriangle },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="bg-slate-800/40 rounded-lg p-3 flex items-center gap-2">
                    <Icon size={14} className="text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="text-slate-500 text-xs">{label}</p>
                      <p className="text-white text-sm font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Portal({ onLaunch }: { onLaunch: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full live-dot" />
          <span className="text-blue-400 text-xs font-mono tracking-widest uppercase">System Online: v1.0.4</span>
        </div>
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter italic">
          FLEET<span className="text-blue-500">PULSE</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Full-stack IoT Telemetry Platform. Built with{' '}
          <span className="text-blue-400 font-mono">C# ASP.NET Core</span>,{' '}
          <span className="text-blue-400 font-mono">SQLite</span>, and{' '}
          <span className="text-blue-400 font-mono">React</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={onLaunch}
            className="group bg-blue-600 hover:bg-blue-500 p-8 rounded-2xl transition-all text-left flex flex-col border border-blue-400/30 shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)]"
          >
            <LayoutDashboard className="text-white mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Live Dashboard</h3>
            <p className="text-blue-100 text-sm opacity-70">Monitor fleet telemetry, safety alerts, and vehicle status.</p>
            <div className="mt-6 flex items-center text-xs font-bold text-white uppercase tracking-widest">
              Launch System <ChevronRight size={14} className="ml-1" />
            </div>
          </button>

          <a
            href={`${API_BASE}/swagger`}
            target="_blank"
            rel="noreferrer"
            className="group bg-slate-900 hover:bg-slate-800 p-8 rounded-2xl transition-all text-left flex flex-col border border-slate-800"
          >
            <Database className="text-slate-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">API Explorer</h3>
            <p className="text-slate-500 text-sm">Review backend endpoints and SQLite data via Swagger.</p>
            <div className="mt-6 flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">
              Open Swagger UI <ExternalLink size={14} className="ml-2" />
            </div>
          </a>
        </div>

        <p className="text-slate-700 text-xs mt-10 font-mono">
          Backend: {API_BASE} · Frontend: http://localhost:5173
        </p>
      </motion.div>
    </div>
  );
}

function LiveConsole({ events }: { events: ApiEvent[] }) {
  const latest = events[0];

  return (
    <div className="bg-black/40 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl min-h-[420px]">
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
        <Terminal className="mr-2" size={14} /> Live API Traffic
      </div>
      <div className="flex-1 p-4 font-mono text-[10px] space-y-4 overflow-y-auto">
        <div className="text-slate-500 italic">Connected to {API_BASE}...</div>
        {!latest ? (
          <div className="text-slate-500">Awaiting first payload...</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="text-emerald-400 tracking-tighter uppercase font-bold truncate">
                {latest.label}
              </div>
              <div className="text-slate-600">{latest.ts}</div>
            </div>
            <pre className="text-slate-300 bg-black/50 p-3 rounded-lg border border-white/5 overflow-x-auto">
              {JSON.stringify(latest.json, null, 2)}
            </pre>
          </div>
        )}
        <div className="text-blue-500/50 uppercase tracking-[0.3em] pt-2">
          Updating stream...
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>('portal');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<FleetSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const displayVehicles = useMemo(() => vehicles, [vehicles]);

  useEffect(() => {
    if (view !== 'dashboard') return;

    let cancelled = false;
    async function loadAll() {
      setLoading(true);
      try {
        const [v, a, s] = await Promise.all([fetchVehicles(), fetchAlerts(), fetchFleetSummary()]);
        if (cancelled) return;
        setVehicles(v);
        setAlerts(a);
        setSummary(s);
        setError(null);

        const now = new Date();
        setEvents(prev => {
          const next: ApiEvent[] = [
            {
              ts: now.toLocaleTimeString(),
              label: 'GET /api/vehicles - 200 OK',
              status: 'ok',
              json: v.slice(0, 2),
            },
            {
              ts: now.toLocaleTimeString(),
              label: 'GET /api/alerts - 200 OK',
              status: 'ok',
              json: a.slice(0, 2),
            },
            {
              ts: now.toLocaleTimeString(),
              label: 'GET /api/fleet/summary - 200 OK',
              status: 'ok',
              json: s,
            },
            ...prev,
          ];
          return next.slice(0, 8);
        });
      } catch {
        if (cancelled) return;
        setError('Cannot reach API — make sure the C# backend is running on http://localhost:5112');
        const now = new Date();
        setEvents(prev =>
          [
            {
              ts: now.toLocaleTimeString(),
              label: 'API request failed',
              status: 'err' as const,
              json: { error: 'Fetch failed', hint: 'Is FleetPulse.Api running on port 5112?' },
            },
            ...prev,
          ].slice(0, 8),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    const interval = setInterval(loadAll, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [view, refreshTick]);

  if (view === 'portal') {
    return (
      <Portal
        onLaunch={() => {
          setView('dashboard');
        }}
      />
    );
  }

  return (
    <AnimatePresence>
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <div className="w-20 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-8 space-y-8">
        <button
          className="p-3 bg-blue-600 rounded-xl cursor-pointer"
          onClick={() => setView('portal')}
          aria-label="Back to portal"
        >
          <Truck size={24} className="text-white" />
        </button>
        <div className="p-3 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <LayoutDashboard size={24} />
        </div>
        <a
          className="p-3 text-slate-500 hover:text-white transition-colors cursor-pointer"
          href={`${API_BASE}/swagger`}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Swagger"
        >
          <Database size={24} />
        </a>
        <div className="p-3 text-slate-500 hover:text-white transition-colors cursor-pointer relative">
          <AlertTriangle size={24} />
          {alerts.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />}
        </div>
        <button
          className="mt-auto p-3 text-slate-700 hover:text-white transition-colors cursor-pointer"
          onClick={() => setRefreshTick(v => v + 1)}
          aria-label="Refresh"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4 min-w-0">
            <h2 className="text-lg font-bold tracking-tight uppercase italic truncate">FleetPulse Dashboard</h2>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono tracking-widest uppercase">
              Live • ZA-SOUTH-1
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full live-dot" />
              <span className="text-slate-400 uppercase tracking-widest font-bold">
                {loading ? 'Syncing…' : 'Backend Sync Active'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatTile
                label="Fleet Safety Score"
                value={`${summary?.performance.safety ?? 82}%`}
                Icon={ShieldCheck}
                valueClassName="text-emerald-300"
              />
              <StatTile
                label="Active Alerts"
                value={`${summary?.alertsToday ?? alerts.length}`}
                Icon={AlertTriangle}
                valueClassName="text-red-300"
              />
              <StatTile
                label="Utilisation"
                value={`${summary?.utilisation ?? 75}%`}
                Icon={Activity}
                valueClassName="text-blue-300"
              />
              <StatTile
                label="Fuel Avg"
                value={`${Math.round(summary?.avgFuelPercent ?? 68)}%`}
                Icon={Truck}
                valueClassName="text-amber-300"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-bold uppercase tracking-widest text-sm flex items-center">
                    <Truck className="mr-2 text-blue-500" size={18} /> Vehicle Status
                  </h3>
                  <a
                    href={`${API_BASE}/api/vehicles`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-white flex items-center gap-2"
                  >
                    Raw JSON <ExternalLink size={14} />
                  </a>
                </div>

                <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {displayVehicles.map((v, i) => (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.04, 0.3) }}
                        className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                        onClick={() => setSelectedVehicle(v)}
                      >
                        <div className="flex items-center space-x-4 min-w-0">
                          <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                            {VEHICLE_ICON[v.type] ?? <Truck size={18} className="text-slate-400 group-hover:text-blue-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white uppercase tracking-tight truncate">
                              {v.name}{' '}
                              <span className="text-slate-600 font-normal ml-2 tracking-normal text-sm">
                                · {v.location}
                              </span>
                            </p>
                            <p className="text-xs text-slate-500 font-mono truncate">
                              {v.status === 'Offline'
                                ? `LAST_SEEN_${(v.lastSeen ?? 'UNKNOWN').replace(/\s+/g, '_').toUpperCase()}`
                                : `SPEED_${v.speedKmh}KMH • FUEL_${v.fuelPercent}%`}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${STATUS_BADGE[v.status] ?? STATUS_BADGE.Offline}`}
                        >
                          {v.status}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <FleetPerformance summary={summary} />
                <LiveConsole events={events} />
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-blue-400" />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Recent Alerts</h3>
                </div>
                <a
                  href={`${API_BASE}/api/alerts`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-white flex items-center gap-2"
                >
                  Raw JSON <ExternalLink size={14} />
                </a>
              </div>
              <div className="divide-y divide-slate-800">
                {alerts.slice(0, 5).map(a => (
                  <div key={a.id} className="px-6 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-300" />
                        <p className="text-sm font-semibold text-white truncate">{a.message}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        {timeAgo(a.timestamp)} · {a.location}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <AnimatePresence>
      {selectedVehicle && (
        <VehicleModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </AnimatePresence>
    </AnimatePresence>
  );
}
