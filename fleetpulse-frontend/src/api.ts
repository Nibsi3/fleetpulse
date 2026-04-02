import type { Vehicle, Alert, FleetSummary, TelemetrySummary } from './types';

const BASE = 'http://localhost:5112/api';

export async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await fetch(`${BASE}/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await fetch(`${BASE}/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchFleetSummary(): Promise<FleetSummary> {
  const res = await fetch(`${BASE}/fleet/summary`);
  if (!res.ok) throw new Error('Failed to fetch fleet summary');
  return res.json();
}

export async function fetchTelemetry(vehicleId: number, month: number): Promise<TelemetrySummary> {
  const res = await fetch(`${BASE}/telemetry/summary?vehicleId=${vehicleId}&month=${month}`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return res.json();
}
