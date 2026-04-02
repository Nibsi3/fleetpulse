namespace FleetPulse.Api.Models;

public class TelemetryRecord
{
    public int Id { get; set; }
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public double AvgSpeedKmh { get; set; }
    public double MaxSpeedKmh { get; set; }
    public double AvgFuelPercent { get; set; }
    public double DistanceKm { get; set; }
    public int HarshBrakingEvents { get; set; }
    public int SpeedingEvents { get; set; }
    public double EngineHours { get; set; }
}
