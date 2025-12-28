using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Equipment;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Receptionist")]
public class EquipmentController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public EquipmentController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<EquipmentDto>>> GetEquipment([FromQuery] string status = null, [FromQuery] int? roomId = null)
    {
        var query = _context.Equipments.Include(e => e.Room).AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(e => e.Status == status);
        if (roomId.HasValue) query = query.Where(e => e.RoomId == roomId.Value);

        var equipment = await query.OrderBy(e => e.Name).ToListAsync();
        return Ok(_mapper.Map<List<EquipmentDto>>(equipment));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EquipmentDto>> GetEquipmentById(int id)
    {
        var equipment = await _context.Equipments.Include(e => e.Room).FirstOrDefaultAsync(e => e.Id == id);
        if (equipment == null) return NotFound();
        return Ok(_mapper.Map<EquipmentDto>(equipment));
    }

    [HttpPost]
    public async Task<ActionResult<EquipmentDto>> CreateEquipment([FromBody] CreateEquipmentDto createDto)
    {
        var equipment = _mapper.Map<Equipment>(createDto);
        equipment.Status = "Available";
        _context.Equipments.Add(equipment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEquipmentById), new { id = equipment.Id }, _mapper.Map<EquipmentDto>(equipment));
    }
}