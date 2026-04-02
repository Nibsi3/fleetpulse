namespace FleetPulse.Api.Models;

public class Vehicle
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public double SpeedKmh { get; set; }
    public double FuelPercent { get; set; }
    public string? LastSeen { get; set; }
    public ICollection<TelemetryRecord> TelemetryRecords { get; set; } = new List<TelemetryRecord>();
    public ICollection<Alert> Alerts { get; set; } = new List<Alert>();
}
