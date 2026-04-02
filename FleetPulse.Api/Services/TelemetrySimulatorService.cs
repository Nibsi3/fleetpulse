using FleetPulse.Api.Data;
using FleetPulse.Api.Models;

namespace FleetPulse.Api.Services;

public class TelemetrySimulatorService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<TelemetrySimulatorService> _logger;
    private static readonly Random _rng = new();

    private static readonly string[] AlertMessages =
    [
        "{0} exceeded speed limit ({1} km/h)",
        "{0} harsh braking detected",
        "{0} sudden lane change detected",
        "{0} engine temperature warning",
        "{0} fuel below 20% threshold",
        "{0} battery below 20% threshold",
        "{0} idle time exceeded 30 minutes",
        "{0} geofence boundary crossed",
    ];

    private static readonly string[] AlertTypes =
    [
        "Speeding", "HarshBraking", "LaneChange", "EngineWarning",
        "LowFuel", "LowBattery", "ExcessiveIdle", "Geofence"
    ];

    private static readonly string[] Locations =
    [
        "N1 Highway", "N2 Highway", "N3 Highway", "N14 Highway",
        "Durban CBD", "Cape Town CBD", "Sandton", "Warehouse A",
        "Warehouse B", "Warehouse C", "OR Tambo Industrial", "Rosslyn Industrial"
    ];

    public TelemetrySimulatorService(IServiceScopeFactory scopeFactory, ILogger<TelemetrySimulatorService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Telemetry simulator started.");

        int tickCount = 0;
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            tickCount++;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FleetDbContext>();

            await UpdateVehicleTelemetry(db, stoppingToken);

            if (tickCount % 3 == 0)
                await MaybeGenerateAlert(db, stoppingToken);
        }
    }

    private static async Task UpdateVehicleTelemetry(FleetDbContext db, CancellationToken ct)
    {
        var vehicles = db.Vehicles.ToList();
        foreach (var v in vehicles)
        {
            switch (v.Status)
            {
                case "Active":
                    v.SpeedKmh = Math.Round(Clamp(v.SpeedKmh + _rng.NextDouble() * 14 - 7, 30, 130), 1);
                    v.FuelPercent = Math.Round(Clamp(v.FuelPercent - _rng.NextDouble() * 0.8, 5, 100), 1);
                    if (_rng.Next(20) == 0) v.Status = "Idle";
                    break;

                case "Idle":
                    v.SpeedKmh = 0;
                    v.FuelPercent = Math.Round(Clamp(v.FuelPercent - _rng.NextDouble() * 0.1, 5, 100), 1);
                    if (_rng.Next(15) == 0) v.Status = "Active";
                    break;

                case "Offline":
                    if (_rng.Next(30) == 0)
                    {
                        v.Status = "Active";
                        v.SpeedKmh = _rng.Next(40, 90);
                        v.LastSeen = null;
                    }
                    break;
            }
        }

        await db.SaveChangesAsync(ct);
    }

    private static async Task MaybeGenerateAlert(FleetDbContext db, CancellationToken ct)
    {
        if (_rng.Next(3) != 0) return;

        var activeVehicles = db.Vehicles.Where(v => v.Status == "Active").ToList();
        if (!activeVehicles.Any()) return;

        var vehicle = activeVehicles[_rng.Next(activeVehicles.Count)];
        int typeIndex = _rng.Next(AlertTypes.Length);
        string type = AlertTypes[typeIndex];
        string location = Locations[_rng.Next(Locations.Length)];

        string message = typeIndex == 0
            ? string.Format(AlertMessages[0], vehicle.Name, (int)vehicle.SpeedKmh)
            : string.Format(AlertMessages[typeIndex], vehicle.Name);

        string severity = type switch
        {
            "Speeding" or "HarshBraking" or "LaneChange" => "High",
            "EngineWarning" or "LowFuel" or "LowBattery" or "Geofence" => "Medium",
            _ => "Low"
        };

        db.Alerts.Add(new Alert
        {
            VehicleId = vehicle.Id,
            Type = type,
            Message = message,
            Severity = severity,
            Location = location,
            Timestamp = DateTime.UtcNow
        });

        await db.SaveChangesAsync(ct);
    }

    private static double Clamp(double value, double min, double max)
        => value < min ? min : value > max ? max : value;
}
