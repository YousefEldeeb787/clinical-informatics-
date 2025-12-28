// ===== ROOMS & EQUIPMENT CONTROLLERS =====
using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Room;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Receptionist")]
public class RoomsController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public RoomsController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<RoomDto>>> GetRooms([FromQuery] string status = null, [FromQuery] string type = null)
    {
        var query = _context.Rooms.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(r => r.Status == status);
        if (!string.IsNullOrWhiteSpace(type)) query = query.Where(r => r.RoomType == type);

        var rooms = await query.OrderBy(r => r.RoomNumber).ToListAsync();
        return Ok(_mapper.Map<List<RoomDto>>(rooms));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoomDto>> GetRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return NotFound();
        return Ok(_mapper.Map<RoomDto>(room));
    }

    [HttpPost]
    public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] CreateRoomDto createDto)
    {
        var room = _mapper.Map<Room>(createDto);
        room.Status = "Available";
        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, _mapper.Map<RoomDto>(room));
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateRoomStatus(int id, [FromBody] UpdateRoomStatusDto statusDto)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null) return NotFound();

        room.Status = statusDto.Status;
        room.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Room status updated" });
    }
}