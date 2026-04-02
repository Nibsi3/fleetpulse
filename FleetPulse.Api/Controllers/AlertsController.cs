using FleetPulse.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly FleetDbContext _db;
    public AlertsController(FleetDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAlerts()
    {
        var alerts = await _db.Alerts
            .Include(a => a.Vehicle)
            .OrderByDescending(a => a.Timestamp)
            .Select(a => new
            {
                a.Id,
                a.Type,
                a.Message,
                a.Severity,
                a.Location,
                a.Timestamp,
                vehicleName = a.Vehicle!.Name,
                vehicleType = a.Vehicle.Type
            })
            .ToListAsync();
        return Ok(alerts);
    }
}
