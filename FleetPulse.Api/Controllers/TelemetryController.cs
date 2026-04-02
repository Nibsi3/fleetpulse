using FleetPulse.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly FleetDbContext _db;
    public TelemetryController(FleetDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary([FromQuery] int vehicleId, [FromQuery] int month)
    {
        var vehicle = await _db.Vehicles.FindAsync(vehicleId);
        if (vehicle == null) return NotFound(new { message = $"Vehicle {vehicleId} not found" });

        var record = await _db.TelemetryRecords
            .Where(t => t.VehicleId == vehicleId && t.Month == month)
            .FirstOrDefaultAsync();

        if (record == null)
            return NotFound(new { message = $"No telemetry data for vehicle {vehicleId} in month {month}" });

        return Ok(new
        {
            vehicleId = record.VehicleId,
            vehicleName = vehicle.Name,
            month = record.Month,
            year = record.Year,
            avgSpeedKmh = record.AvgSpeedKmh,
            maxSpeedKmh = record.MaxSpeedKmh,
            avgFuelPercent = record.AvgFuelPercent,
            distanceKm = record.DistanceKm,
            harshBrakingEvents = record.HarshBrakingEvents,
            speedingEvents = record.SpeedingEvents,
            engineHours = record.EngineHours
        });
    }
}
