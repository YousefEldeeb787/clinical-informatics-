using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Common;
using ClinicSystemBackend.Data.DTOs.Encounter;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClinicSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EncountersController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public EncountersController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "Clinician")]
        public async Task<ActionResult<PagedResultDto<EncounterDto>>> GetEncounters(
            [FromQuery] int? patientId = null, [FromQuery] int? clinicianId = null,
            [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            var query = _context.Encounters
                .Include(e => e.Patient).ThenInclude(p => p.User)
                .Include(e => e.Clinician).ThenInclude(c => c.User)
                .AsQueryable();

            if (patientId.HasValue) query = query.Where(e => e.PatientId == patientId.Value);
            if (clinicianId.HasValue) query = query.Where(e => e.ClinicianId == clinicianId.Value);

            var totalCount = await query.CountAsync();
            var encounters = await query.OrderByDescending(e => e.EncounterDate)
                .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new PagedResultDto<EncounterDto>
            {
                Items = _mapper.Map<List<EncounterDto>>(encounters),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EncounterDto>> GetEncounter(int id)
        {
            var encounter = await _context.Encounters
                .Include(e => e.Patient).ThenInclude(p => p.User)
                .Include(e => e.Clinician).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (encounter == null) return NotFound();
            return Ok(_mapper.Map<EncounterDto>(encounter));
        }

        [HttpPost]
        [Authorize(Roles = "Clinician")]
        public async Task<ActionResult<EncounterDto>> CreateEncounter([FromBody] CreateEncounterDto createDto)
        {
            var encounter = _mapper.Map<Encounter>(createDto);
            encounter.EncounterDate = DateTime.UtcNow;
            encounter.Status = "InProgress";
            _context.Encounters.Add(encounter);
            await _context.SaveChangesAsync();

            encounter = await _context.Encounters
                .Include(e => e.Patient).ThenInclude(p => p.User)
                .Include(e => e.Clinician).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(e => e.Id == encounter.Id);

            return CreatedAtAction(nameof(GetEncounter), new { id = encounter.Id }, _mapper.Map<EncounterDto>(encounter));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> UpdateEncounter(int id, [FromBody] UpdateEncounterDto updateDto)
        {
            var encounter = await _context.Encounters.FindAsync(id);
            if (encounter == null) return NotFound();
            if (encounter.Status == "Signed") return BadRequest(new { message = "Cannot update signed encounters" });

            _mapper.Map(updateDto, encounter);
            encounter.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/sign")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> SignEncounter(int id)
        {
            var encounter = await _context.Encounters.FindAsync(id);
            if (encounter == null) return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int userId);

            encounter.Status = "Signed";
            encounter.SignedBy = userId;
            encounter.SignedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Encounter signed successfully" });
        }
    }
}
