export interface Vehicle {
  id: number;
  name: string;
  type: string;
  location: string;
  status: 'Active' | 'Idle' | 'Offline';
  speedKmh: number;
  fuelPercent: number;
  lastSeen?: string;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  location: string;
  timestamp: string;
  vehicleName: string;
  vehicleType: string;
}

export interface FleetSummary {
  totalVehicles: number;
  activeVehicles: number;
  idleVehicles: number;
  offlineVehicles: number;
  avgFuelPercent: number;
  utilisation: number;
  alertsToday: number;
  speedingAlerts: number;
  harshBrakingAlerts: number;
  performance: {
    safety: number;
    compliance: number;
    fuelEfficiency: number;
    utilisation: number;
  };
}

export interface TelemetrySummary {
  vehicleId: number;
  vehicleName: string;
  month: number;
  year: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
  avgFuelPercent: number;
  distanceKm: number;
  harshBrakingEvents: number;
  speedingEvents: number;
  engineHours: number;
}
