using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Insurance;
using ClinicSystemBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class InsuranceController : ControllerBase
{
    private readonly ClinicDbContext _context;
    private readonly IMapper _mapper;

    public InsuranceController(ClinicDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(Roles = "Receptionist")]
    public async Task<ActionResult<List<InsuranceDto>>> GetInsurances([FromQuery] int? patientId = null)
    {
        var query = _context.Insurances.AsQueryable();
        if (patientId.HasValue) query = query.Where(i => i.PatientId == patientId.Value);

        var insurances = await query.Where(i => i.IsActive).ToListAsync();
        return Ok(_mapper.Map<List<InsuranceDto>>(insurances));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InsuranceDto>> GetInsurance(int id)
    {
        var insurance = await _context.Insurances.FindAsync(id);
        if (insurance == null) return NotFound();
        return Ok(_mapper.Map<InsuranceDto>(insurance));
    }

    [HttpPost]
    [Authorize(Roles = "Receptionist,Patient")]
    public async Task<ActionResult<InsuranceDto>> CreateInsurance([FromBody] CreateInsuranceDto createDto)
    {
        var insurance = _mapper.Map<Insurance>(createDto);
        _context.Insurances.Add(insurance);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInsurance), new { id = insurance.Id }, _mapper.Map<InsuranceDto>(insurance));
    }
}
