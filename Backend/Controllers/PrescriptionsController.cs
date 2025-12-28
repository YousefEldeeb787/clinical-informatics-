using AutoMapper;
using ClinicSystemBackend.Authorization;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Prescription;
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
    public class PrescriptionsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public PrescriptionsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// GET: api/prescriptions - Get prescriptions
        /// ✅ Allowed: Admin, Clinician
        /// 🚫 Blocked: Receptionist (no medical data), Patient (use own endpoint)
        /// </summary>
        [HttpGet]
        [Authorize(Policy = nameof(RolePermissions.ViewPrescriptions))]
        public async Task<ActionResult<List<PrescriptionDto>>> GetPrescriptions(
            [FromQuery] int? patientId = null, [FromQuery] string status = null)
        {
            var query = _context.Prescriptions
                .Include(p => p.Patient).ThenInclude(pt => pt.User)
                .Include(p => p.PrescribedBy).ThenInclude(c => c.User)
                .AsQueryable();

            if (patientId.HasValue) query = query.Where(p => p.PatientId == patientId.Value);
            if (!string.IsNullOrWhiteSpace(status)) query = query.Where(p => p.Status == status);

            var prescriptions = await query.OrderByDescending(p => p.PrescribedDate).ToListAsync();
            return Ok(_mapper.Map<List<PrescriptionDto>>(prescriptions));
        }

        /// <summary>
        /// GET: api/prescriptions/my - Get own prescriptions (Patient only)
        /// ✅ Allowed: Patient (own only)
        /// </summary>
        [HttpGet("my")]
        [Authorize(Policy = nameof(RolePermissions.ViewOwnPrescriptions))]
        public async Task<ActionResult<List<PrescriptionDto>>> GetMyPrescriptions()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
            if (patient == null)
            {
                return NotFound(new { message = "Patient record not found" });
            }

            var prescriptions = await _context.Prescriptions
                .Include(p => p.Patient).ThenInclude(pt => pt.User)
                .Include(p => p.PrescribedBy).ThenInclude(c => c.User)
                .Where(p => p.PatientId == patient.Id)
                .OrderByDescending(p => p.PrescribedDate)
                .ToListAsync();

            return Ok(_mapper.Map<List<PrescriptionDto>>(prescriptions));
        }

        /// <summary>
        /// GET: api/prescriptions/{id} - Get prescription details
        /// ✅ Allowed: Admin, Clinician, Patient (own only)
        /// 🚫 Blocked: Receptionist
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<PrescriptionDto>> GetPrescription(int id)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var prescription = await _context.Prescriptions
                .Include(p => p.Patient).ThenInclude(pt => pt.User)
                .Include(p => p.PrescribedBy).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (prescription == null) return NotFound();

            // RBAC Check
            if (currentRole == "Patient")
            {
                // Patient can only view own prescriptions
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || prescription.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Not your prescription
                }
            }
            else if (currentRole == "Receptionist")
            {
                // Receptionist CANNOT view prescriptions (medical data)
                return Forbid(); // 403 - No medical access
            }
            else if (currentRole != "Clinician" && currentRole != "Admin")
            {
                return Forbid();
            }

            return Ok(_mapper.Map<PrescriptionDto>(prescription));
        }

        /// <summary>
        /// POST: api/prescriptions - Create prescription
        /// ✅ Allowed: Clinician ONLY
        /// 🚫 Blocked: Receptionist, Patient, Admin (only medical staff can prescribe)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = nameof(RolePermissions.CreatePrescription))]
        public async Task<ActionResult<PrescriptionDto>> CreatePrescription([FromBody] CreatePrescriptionDto createDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int clinicianUserId);

            var clinician = await _context.Clinicians.FirstOrDefaultAsync(c => c.UserId == clinicianUserId);
            if (clinician == null) 
                return BadRequest(new { message = "Only clinicians can prescribe medications" });

            var prescription = _mapper.Map<Prescription>(createDto);
            prescription.PrescribedById = clinician.Id;
            prescription.Status = "Active";
            prescription.PrescribedDate = DateTime.UtcNow;

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            prescription = await _context.Prescriptions
                .Include(p => p.Patient).ThenInclude(pt => pt.User)
                .Include(p => p.PrescribedBy).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == prescription.Id);

            return CreatedAtAction(nameof(GetPrescription), new { id = prescription.Id }, _mapper.Map<PrescriptionDto>(prescription));
        }

        /// <summary>
        /// PATCH: api/prescriptions/{id}/status - Update prescription status
        /// ✅ Allowed: Clinician, Admin
        /// 🚫 Blocked: Receptionist, Patient
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdatePrescriptionStatusDto statusDto)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return NotFound();

            prescription.Status = statusDto.Status;
            if (statusDto.FilledDate.HasValue) prescription.FilledDate = statusDto.FilledDate;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated successfully" });
        }

        /// <summary>
        /// POST: api/prescriptions/{id}/refill - Request refill
        /// ✅ Allowed: Patient (request), Clinician (approve)
        /// 🚫 Blocked: Receptionist
        /// </summary>
        [HttpPost("{id}/refill")]
        [Authorize]
        public async Task<IActionResult> RequestRefill(int id)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var prescription = await _context.Prescriptions
                .Include(p => p.Patient)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (prescription == null) return NotFound();

            // RBAC Check
            if (currentRole == "Patient")
            {
                // Patient can only request refill for own prescriptions
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || prescription.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Not your prescription
                }
                
                if (!RolePermissions.HasPermission("Patient", RolePermissions.RequestPrescriptionRefill))
                {
                    return Forbid();
                }
            }
            else if (currentRole == "Receptionist")
            {
                // Receptionist CANNOT handle prescriptions
                return Forbid(); // 403 - No medical access
            }

            if (prescription.Refills == null || prescription.Refills <= 0)
                return BadRequest(new { message = "No refills remaining" });

            // In real app, this would create a refill request
            return Ok(new { message = "Refill requested successfully" });
        }
    }
}
