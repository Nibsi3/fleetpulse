using FleetPulse.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FleetPulse.Api.Data;

public class FleetDbContext : DbContext
{
    public FleetDbContext(DbContextOptions<FleetDbContext> options) : base(options) { }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<TelemetryRecord> TelemetryRecords => Set<TelemetryRecord>();
    public DbSet<Alert> Alerts => Set<Alert>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Vehicle>().HasData(
            new Vehicle { Id = 1, Name = "Truck-01", Type = "Truck", Location = "Cape Town", Status = "Active", SpeedKmh = 112, FuelPercent = 72 },
            new Vehicle { Id = 2, Name = "Truck-02", Type = "Truck", Location = "Johannesburg", Status = "Idle", SpeedKmh = 0, FuelPercent = 45 },
            new Vehicle { Id = 3, Name = "Truck-03", Type = "Truck", Location = "Pretoria", Status = "Active", SpeedKmh = 87, FuelPercent = 60 },
            new Vehicle { Id = 4, Name = "Truck-04", Type = "Truck", Location = "Port Elizabeth", Status = "Active", SpeedKmh = 95, FuelPercent = 55 },
            new Vehicle { Id = 5, Name = "Truck-05", Type = "Truck", Location = "Bloemfontein", Status = "Idle", SpeedKmh = 0, FuelPercent = 80 },
            new Vehicle { Id = 6, Name = "Truck-06", Type = "Truck", Location = "East London", Status = "Active", SpeedKmh = 103, FuelPercent = 38 },
            new Vehicle { Id = 7, Name = "Forklift-07", Type = "Forklift", Location = "Warehouse A", Status = "Active", SpeedKmh = 8, FuelPercent = 91 },
            new Vehicle { Id = 8, Name = "Forklift-08", Type = "Forklift", Location = "Warehouse B", Status = "Idle", SpeedKmh = 0, FuelPercent = 65 },
            new Vehicle { Id = 9, Name = "Forklift-09", Type = "Forklift", Location = "Warehouse A", Status = "Active", SpeedKmh = 5, FuelPercent = 44 },
            new Vehicle { Id = 10, Name = "Van-03", Type = "Van", Location = "Durban", Status = "Offline", SpeedKmh = 0, FuelPercent = 30, LastSeen = "4h ago" },
            new Vehicle { Id = 11, Name = "Van-04", Type = "Van", Location = "Cape Town", Status = "Active", SpeedKmh = 68, FuelPercent = 78 },
            new Vehicle { Id = 12, Name = "Van-05", Type = "Van", Location = "Johannesburg", Status = "Active", SpeedKmh = 72, FuelPercent = 82 },
            new Vehicle { Id = 13, Name = "Van-06", Type = "Van", Location = "Durban", Status = "Idle", SpeedKmh = 0, FuelPercent = 57 },
            new Vehicle { Id = 14, Name = "Truck-07", Type = "Truck", Location = "Kimberley", Status = "Active", SpeedKmh = 115, FuelPercent = 48 },
            new Vehicle { Id = 15, Name = "Truck-08", Type = "Truck", Location = "Nelspruit", Status = "Active", SpeedKmh = 89, FuelPercent = 67 },
            new Vehicle { Id = 16, Name = "Truck-09", Type = "Truck", Location = "Polokwane", Status = "Idle", SpeedKmh = 0, FuelPercent = 72 },
            new Vehicle { Id = 17, Name = "Truck-10", Type = "Truck", Location = "George", Status = "Active", SpeedKmh = 91, FuelPercent = 50 },
            new Vehicle { Id = 18, Name = "Forklift-10", Type = "Forklift", Location = "Warehouse C", Status = "Active", SpeedKmh = 6, FuelPercent = 30 },
            new Vehicle { Id = 19, Name = "Forklift-11", Type = "Forklift", Location = "Warehouse B", Status = "Idle", SpeedKmh = 0, FuelPercent = 88 },
            new Vehicle { Id = 20, Name = "Van-07", Type = "Van", Location = "Rustenburg", Status = "Active", SpeedKmh = 65, FuelPercent = 70 },
            new Vehicle { Id = 21, Name = "Van-08", Type = "Van", Location = "Pietermaritzburg", Status = "Offline", SpeedKmh = 0, FuelPercent = 22, LastSeen = "7h ago" },
            new Vehicle { Id = 22, Name = "Truck-11", Type = "Truck", Location = "Upington", Status = "Active", SpeedKmh = 100, FuelPercent = 61 },
            new Vehicle { Id = 23, Name = "Truck-12", Type = "Truck", Location = "Mafikeng", Status = "Idle", SpeedKmh = 0, FuelPercent = 76 },
            new Vehicle { Id = 24, Name = "Van-09", Type = "Van", Location = "Witbank", Status = "Active", SpeedKmh = 74, FuelPercent = 85 }
        );

        modelBuilder.Entity<TelemetryRecord>().HasData(
            new TelemetryRecord { Id = 1, VehicleId = 1, Month = 3, Year = 2025, AvgSpeedKmh = 88.4, MaxSpeedKmh = 118, AvgFuelPercent = 69, DistanceKm = 3240, HarshBrakingEvents = 4, SpeedingEvents = 7, EngineHours = 38.5 },
            new TelemetryRecord { Id = 2, VehicleId = 1, Month = 2, Year = 2025, AvgSpeedKmh = 84.1, MaxSpeedKmh = 112, AvgFuelPercent = 71, DistanceKm = 2980, HarshBrakingEvents = 3, SpeedingEvents = 5, EngineHours = 35.2 },
            new TelemetryRecord { Id = 3, VehicleId = 1, Month = 1, Year = 2025, AvgSpeedKmh = 79.3, MaxSpeedKmh = 105, AvgFuelPercent = 74, DistanceKm = 2750, HarshBrakingEvents = 2, SpeedingEvents = 3, EngineHours = 32.8 },
            new TelemetryRecord { Id = 4, VehicleId = 2, Month = 3, Year = 2025, AvgSpeedKmh = 76.2, MaxSpeedKmh = 99, AvgFuelPercent = 58, DistanceKm = 2100, HarshBrakingEvents = 1, SpeedingEvents = 2, EngineHours = 28.1 },
            new TelemetryRecord { Id = 5, VehicleId = 2, Month = 2, Year = 2025, AvgSpeedKmh = 72.8, MaxSpeedKmh = 95, AvgFuelPercent = 62, DistanceKm = 1950, HarshBrakingEvents = 2, SpeedingEvents = 1, EngineHours = 25.4 },
            new TelemetryRecord { Id = 6, VehicleId = 3, Month = 3, Year = 2025, AvgSpeedKmh = 81.5, MaxSpeedKmh = 108, AvgFuelPercent = 63, DistanceKm = 2600, HarshBrakingEvents = 3, SpeedingEvents = 4, EngineHours = 31.0 },
            new TelemetryRecord { Id = 7, VehicleId = 4, Month = 3, Year = 2025, AvgSpeedKmh = 85.0, MaxSpeedKmh = 110, AvgFuelPercent = 57, DistanceKm = 2850, HarshBrakingEvents = 5, SpeedingEvents = 6, EngineHours = 33.5 },
            new TelemetryRecord { Id = 8, VehicleId = 5, Month = 3, Year = 2025, AvgSpeedKmh = 70.0, MaxSpeedKmh = 92, AvgFuelPercent = 76, DistanceKm = 1800, HarshBrakingEvents = 1, SpeedingEvents = 0, EngineHours = 22.0 },
            new TelemetryRecord { Id = 9, VehicleId = 6, Month = 3, Year = 2025, AvgSpeedKmh = 90.2, MaxSpeedKmh = 120, AvgFuelPercent = 42, DistanceKm = 3100, HarshBrakingEvents = 6, SpeedingEvents = 9, EngineHours = 36.8 },
            new TelemetryRecord { Id = 10, VehicleId = 7, Month = 3, Year = 2025, AvgSpeedKmh = 7.2, MaxSpeedKmh = 15, AvgFuelPercent = 88, DistanceKm = 120, HarshBrakingEvents = 0, SpeedingEvents = 0, EngineHours = 48.0 },
            new TelemetryRecord { Id = 11, VehicleId = 8, Month = 3, Year = 2025, AvgSpeedKmh = 6.8, MaxSpeedKmh = 14, AvgFuelPercent = 72, DistanceKm = 95, HarshBrakingEvents = 1, SpeedingEvents = 0, EngineHours = 42.5 },
            new TelemetryRecord { Id = 12, VehicleId = 9, Month = 3, Year = 2025, AvgSpeedKmh = 5.5, MaxSpeedKmh = 12, AvgFuelPercent = 48, DistanceKm = 78, HarshBrakingEvents = 0, SpeedingEvents = 0, EngineHours = 39.0 },
            new TelemetryRecord { Id = 13, VehicleId = 10, Month = 3, Year = 2025, AvgSpeedKmh = 65.0, MaxSpeedKmh = 89, AvgFuelPercent = 34, DistanceKm = 1600, HarshBrakingEvents = 8, SpeedingEvents = 2, EngineHours = 24.5 },
            new TelemetryRecord { Id = 14, VehicleId = 11, Month = 3, Year = 2025, AvgSpeedKmh = 62.5, MaxSpeedKmh = 85, AvgFuelPercent = 79, DistanceKm = 1750, HarshBrakingEvents = 2, SpeedingEvents = 1, EngineHours = 26.0 },
            new TelemetryRecord { Id = 15, VehicleId = 12, Month = 3, Year = 2025, AvgSpeedKmh = 68.3, MaxSpeedKmh = 88, AvgFuelPercent = 81, DistanceKm = 1900, HarshBrakingEvents = 1, SpeedingEvents = 2, EngineHours = 28.5 }
        );

        modelBuilder.Entity<Alert>().HasData(
            new Alert { Id = 1, VehicleId = 1, Type = "Speeding", Message = "Truck-01 exceeded speed limit (112 km/h)", Severity = "High", Location = "N1 Highway", Timestamp = DateTime.UtcNow.AddMinutes(-2) },
            new Alert { Id = 2, VehicleId = 10, Type = "HarshBraking", Message = "Van-03 harsh braking detected", Severity = "Medium", Location = "Durban CBD", Timestamp = DateTime.UtcNow.AddHours(-1) },
            new Alert { Id = 3, VehicleId = 7, Type = "LowBattery", Message = "Forklift-07 battery below 20% threshold", Severity = "Medium", Location = "Warehouse A", Timestamp = DateTime.UtcNow.AddHours(-3) },
            new Alert { Id = 4, VehicleId = 6, Type = "Speeding", Message = "Truck-06 exceeded speed limit (103 km/h)", Severity = "High", Location = "N2 Highway", Timestamp = DateTime.UtcNow.AddHours(-4) },
            new Alert { Id = 5, VehicleId = 14, Type = "Speeding", Message = "Truck-07 exceeded speed limit (115 km/h)", Severity = "High", Location = "N14 Highway", Timestamp = DateTime.UtcNow.AddMinutes(-30) },
            new Alert { Id = 6, VehicleId = 21, Type = "Offline", Message = "Van-08 has been offline for 7 hours", Severity = "Medium", Location = "Pietermaritzburg", Timestamp = DateTime.UtcNow.AddHours(-7) },
            new Alert { Id = 7, VehicleId = 9, Type = "LowFuel", Message = "Forklift-09 fuel below 50%", Severity = "Low", Location = "Warehouse A", Timestamp = DateTime.UtcNow.AddHours(-2) }
        );
    }
}
