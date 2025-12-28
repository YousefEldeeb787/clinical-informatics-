using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.LabResult;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/lab-results")]
[ApiController]
[Authorize]
public class LabResultsController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public LabResultsController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<List<LabResultDto>>> GetLabResults([FromQuery] int? patientId = null)
    {
        var query = _context.LabResults
            .Include(lr => lr.Patient).ThenInclude(p => p.User)
            .AsQueryable();

        if (patientId.HasValue) query = query.Where(lr => lr.PatientId == patientId.Value);

        var results = await query.OrderByDescending(lr => lr.ResultDate).ToListAsync();
        return Ok(_mapper.Map<List<LabResultDto>>(results));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<LabResultDto>> GetLabResult(int id)
    {
        var result = await _context.LabResults
            .Include(lr => lr.Patient).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(lr => lr.Id == id);

        if (result == null) return NotFound();
        return Ok(_mapper.Map<LabResultDto>(result));
    }

    [HttpPost]
    [Authorize(Roles = "Clinician")]
    public async Task<ActionResult<LabResultDto>> CreateLabResult([FromBody] CreateLabResultDto createDto)
    {
        var labResult = _mapper.Map<LabResult>(createDto);
        labResult.ResultDate = DateTime.UtcNow;

        _context.LabResults.Add(labResult);
        await _context.SaveChangesAsync();

        labResult = await _context.LabResults
            .Include(lr => lr.Patient).ThenInclude(p => p.User)
            .FirstOrDefaultAsync(lr => lr.Id == labResult.Id);

        return CreatedAtAction(nameof(GetLabResult), new { id = labResult.Id }, _mapper.Map<LabResultDto>(labResult));
    }
}
