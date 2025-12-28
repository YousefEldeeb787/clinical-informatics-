// ===== MEDICAL HISTORY CONTROLLER =====
using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.MedicalHistory;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/medical-history")]
[ApiController]
[Authorize]
public class MedicalHistoryController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public MedicalHistoryController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(Roles = "Clinician")]
    public async Task<ActionResult<List<MedicalHistoryEntryDto>>> GetMedicalHistory(
        [FromQuery] int patientId, [FromQuery] string type = null, [FromQuery] DateTime? since = null)
    {
        var query = _context.MedicalHistoryEntries.Where(mh => mh.PatientId == patientId);

        if (!string.IsNullOrWhiteSpace(type)) query = query.Where(mh => mh.EntryType == type);
        if (since.HasValue) query = query.Where(mh => mh.RecordedAt >= since.Value);

        var entries = await query.OrderByDescending(mh => mh.RecordedAt).ToListAsync();
        return Ok(_mapper.Map<List<MedicalHistoryEntryDto>>(entries));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MedicalHistoryEntryDto>> GetEntry(int id)
    {
        var entry = await _context.MedicalHistoryEntries.FindAsync(id);
        if (entry == null) return NotFound();
        return Ok(_mapper.Map<MedicalHistoryEntryDto>(entry));
    }

    [HttpPost]
    [Authorize(Roles = "Clinician,Patient")]
    public async Task<ActionResult<MedicalHistoryEntryDto>> CreateEntry([FromBody] CreateMedicalHistoryEntryDto createDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int userId);

        var entry = _mapper.Map<MedicalHistoryEntry>(createDto);
        entry.RecordedBy = userId;
        entry.RecordedAt = DateTime.UtcNow;

        _context.MedicalHistoryEntries.Add(entry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, _mapper.Map<MedicalHistoryEntryDto>(entry));
    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "Clinician")]
    public async Task<IActionResult> UpdateEntry(int id, [FromBody] UpdateMedicalHistoryEntryDto updateDto)
    {
        var entry = await _context.MedicalHistoryEntries.FindAsync(id);
        if (entry == null) return NotFound();

        entry.Status = updateDto.Status ?? entry.Status;
        entry.Description = updateDto.Description ?? entry.Description;
        entry.ResolutionDate = updateDto.ResolutionDate ?? entry.ResolutionDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/verify")]
    [Authorize(Roles = "Clinician")]
    public async Task<IActionResult> VerifyEntry(int id)
    {
        var entry = await _context.MedicalHistoryEntries.FindAsync(id);
        if (entry == null) return NotFound();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int userId);

        entry.IsVerified = true;
        entry.VerifiedBy = userId;
        entry.VerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Entry verified successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Clinician")]
    public async Task<IActionResult> DeleteEntry(int id)
    {
        var entry = await _context.MedicalHistoryEntries.FindAsync(id);
        if (entry == null) return NotFound();

        entry.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Entry deleted successfully" });
    }
}
