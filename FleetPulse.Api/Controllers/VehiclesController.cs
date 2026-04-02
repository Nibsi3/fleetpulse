using FleetPulse.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FleetPulse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly FleetDbContext _db;
    public VehiclesController(FleetDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var vehicles = await _db.Vehicles
            .Select(v => new
            {
                v.Id,
                v.Name,
                v.Type,
                v.Location,
                v.Status,
                v.SpeedKmh,
                v.FuelPercent,
                v.LastSeen
            })
            .ToListAsync();
        return Ok(vehicles);
    }
}
