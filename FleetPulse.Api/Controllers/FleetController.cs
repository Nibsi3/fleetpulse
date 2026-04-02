using FleetPulse.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FleetController : ControllerBase
{
    private readonly FleetDbContext _db;
    public FleetController(FleetDbContext db) => _db = db;

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var vehicles = await _db.Vehicles.ToListAsync();
        var alerts = await _db.Alerts
            .Where(a => a.Timestamp >= DateTime.UtcNow.AddHours(-24))
            .ToListAsync();

        int total = vehicles.Count;
        int active = vehicles.Count(v => v.Status == "Active");
        int idle = vehicles.Count(v => v.Status == "Idle");
        int offline = vehicles.Count(v => v.Status == "Offline");
        double avgFuel = vehicles.Average(v => v.FuelPercent);
        double utilisation = total > 0 ? Math.Round((double)active / total * 100, 1) : 0;

        int alertsToday = alerts.Count;
        int speedingAlerts = alerts.Count(a => a.Type == "Speeding");
        int harshBrakingAlerts = alerts.Count(a => a.Type == "HarshBraking");

        double safetyScore = 82;
        double complianceScore = 91;
        double fuelEfficiency = 61;

        return Ok(new
        {
            totalVehicles = total,
            activeVehicles = active,
            idleVehicles = idle,
            offlineVehicles = offline,
            avgFuelPercent = Math.Round(avgFuel, 1),
            utilisation,
            alertsToday,
            speedingAlerts,
            harshBrakingAlerts,
            performance = new
            {
                safety = safetyScore,
                compliance = complianceScore,
                fuelEfficiency,
                utilisation
            }
        });
    }
}
