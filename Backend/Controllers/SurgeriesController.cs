using AutoMapper;
using ClinicSystemBackend.Authorization;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Common;
using ClinicSystemBackend.Data.DTOs.Surgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ClinicSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SurgeriesController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public SurgeriesController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// GET: api/surgeries - List surgeries with filters
        /// ? Allowed: Admin, Clinician
        /// ?? Blocked: Receptionist (cannot schedule surgeries), Patient (use own endpoint)
        /// </summary>
        [HttpGet]
        [Authorize(Policy = nameof(RolePermissions.ViewSurgeries))]
        public async Task<ActionResult<PagedResultDto<SurgeryDto>>> GetSurgeries(
            [FromQuery] int? patientId = null,
            [FromQuery] int? surgeonId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string status = null,
            [FromQuery] string surgeryType = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .AsQueryable();

            if (patientId.HasValue)
                query = query.Where(s => s.PatientId == patientId.Value);

            if (surgeonId.HasValue)
                query = query.Where(s => s.SurgeonId == surgeonId.Value);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(s => s.Status == status);

            if (!string.IsNullOrWhiteSpace(surgeryType))
                query = query.Where(s => s.SurgeryType == surgeryType);

            if (startDate.HasValue)
                query = query.Where(s => s.ScheduledDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(s => s.ScheduledDate <= endDate.Value);

            var totalCount = await query.CountAsync();

            var surgeries = await query
                .OrderByDescending(s => s.ScheduledDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var surgeryDtos = _mapper.Map<List<SurgeryDto>>(surgeries);

            var result = new PagedResultDto<SurgeryDto>
            {
                Items = surgeryDtos,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                HasPreviousPage = pageNumber > 1,
                HasNextPage = pageNumber < (int)Math.Ceiling(totalCount / (double)pageSize)
            };

            return Ok(result);
        }

        /// <summary>
        /// GET: api/surgeries/my - Get own surgeries (Patient only)
        /// ? Allowed: Patient (own only)
        /// </summary>
        [HttpGet("my")]
        [Authorize(Policy = nameof(RolePermissions.ViewOwnSurgeries))]
        public async Task<ActionResult<List<SurgeryDto>>> GetMySurgeries()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
            if (patient == null)
            {
                return NotFound(new { message = "Patient record not found" });
            }

            var surgeries = await _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .Where(s => s.PatientId == patient.Id)
                .OrderByDescending(s => s.ScheduledDate)
                .ToListAsync();

            return Ok(_mapper.Map<List<SurgeryDto>>(surgeries));
        }

        /// <summary>
        /// GET: api/surgeries/{id}
        /// ? Allowed: Admin, Clinician, Patient (own only)
        /// ?? Blocked: Receptionist (cannot access surgery data)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<SurgeryDto>> GetSurgery(int id)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var surgery = await _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            // RBAC Check
            if (currentRole == "Patient")
            {
                // Patient can only view own surgeries
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || surgery.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Not your surgery
                }
            }
            else if (currentRole == "Receptionist")
            {
                // Receptionist CANNOT view or schedule surgeries
                return Forbid(); // 403 - No surgical access
            }
            else if (currentRole != "Clinician" && currentRole != "Admin")
            {
                return Forbid();
            }

            var surgeryDto = _mapper.Map<SurgeryDto>(surgery);
            return Ok(surgeryDto);
        }

        /// <summary>
        /// POST: api/surgeries - Schedule surgery
        /// ? Allowed: Clinician ONLY
        /// ?? Blocked: Receptionist (cannot schedule surgeries), Patient, Admin
        /// </summary>
        [HttpPost]
        [Authorize(Policy = nameof(RolePermissions.CreateSurgery))]
        public async Task<ActionResult<SurgeryDto>> CreateSurgery([FromBody] CreateSurgeryDto createDto)
        {
            // Validate that the user is a clinician
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int clinicianUserId);

            var clinician = await _context.Clinicians.FirstOrDefaultAsync(c => c.UserId == clinicianUserId);
            if (clinician == null)
                return BadRequest(new { message = "Only clinicians can schedule surgeries" });

            // Validate patient exists
            if (!await _context.Patients.AnyAsync(p => p.Id == createDto.PatientId))
                return BadRequest(new { message = "Patient not found" });

            // Validate surgeon exists
            if (!await _context.Clinicians.AnyAsync(c => c.Id == createDto.SurgeonId))
                return BadRequest(new { message = "Surgeon not found" });

            // Check room availability
            if (createDto.RoomId.HasValue)
            {
                var roomConflict = await _context.Surgeries
                    .AnyAsync(s => s.RoomId == createDto.RoomId &&
                                  s.Status != "Cancelled" &&
                                  s.ScheduledDate.Date == createDto.ScheduledDate.Date);

                if (roomConflict)
                    return BadRequest(new { message = "Operating room is not available" });
            }

            var surgery = _mapper.Map<ClinicSystemBackend.Models.Surgery>(createDto);
            surgery.Status = "Scheduled";
            surgery.CreatedAt = DateTime.UtcNow;
            surgery.UpdatedAt = DateTime.UtcNow;

            _context.Surgeries.Add(surgery);
            await _context.SaveChangesAsync();

            // Reload with includes
            surgery = await _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .FirstOrDefaultAsync(s => s.Id == surgery.Id);

            var surgeryDto = _mapper.Map<SurgeryDto>(surgery);
            return CreatedAtAction(nameof(GetSurgery), new { id = surgery.Id }, surgeryDto);
        }

        /// <summary>
        /// PUT: api/surgeries/{id} - Update surgery details
        /// ? Allowed: Clinician (medical notes), Admin
        /// ?? Blocked: Receptionist, Patient
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = nameof(RolePermissions.UpdateSurgery))]
        public async Task<IActionResult> UpdateSurgery(int id, [FromBody] UpdateSurgeryDto updateDto)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            if (surgery.Status == "Completed")
                return BadRequest(new { message = "Cannot update completed surgeries" });

            // Update fields
            if (updateDto.ActualStartTime.HasValue)
                surgery.ActualStartTime = updateDto.ActualStartTime;

            if (updateDto.ActualEndTime.HasValue)
                surgery.ActualEndTime = updateDto.ActualEndTime;

            surgery.OperativeFindings = updateDto.OperativeFindings ?? surgery.OperativeFindings;
            surgery.ProcedureDetails = updateDto.ProcedureDetails ?? surgery.ProcedureDetails;
            surgery.Complications = updateDto.Complications ?? surgery.Complications;
            surgery.EstimatedBloodLoss = updateDto.EstimatedBloodLoss ?? surgery.EstimatedBloodLoss;
            surgery.PostOpDiagnosis = updateDto.PostOpDiagnosis ?? surgery.PostOpDiagnosis;
            surgery.PostOpInstructions = updateDto.PostOpInstructions ?? surgery.PostOpInstructions;
            surgery.PostOpNotes = updateDto.PostOpNotes ?? surgery.PostOpNotes;
            surgery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// PATCH: api/surgeries/{id}/status - Update surgery status
        /// ? Allowed: Clinician, Admin
        /// ?? Blocked: Receptionist, Patient
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Policy = nameof(RolePermissions.UpdateSurgery))]
        public async Task<IActionResult> UpdateSurgeryStatus(int id, [FromBody] dynamic statusData)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            string newStatus = statusData.status.ToString();

            // Status transitions
            if (newStatus == "InProgress" && surgery.Status != "Scheduled")
                return BadRequest(new { message = "Only scheduled surgeries can be started" });

            if (newStatus == "Completed" && surgery.Status != "InProgress")
                return BadRequest(new { message = "Only in-progress surgeries can be completed" });

            surgery.Status = newStatus;
            surgery.UpdatedAt = DateTime.UtcNow;

            if (newStatus == "InProgress" && !surgery.ActualStartTime.HasValue)
                surgery.ActualStartTime = DateTime.UtcNow;

            if (newStatus == "Completed" && !surgery.ActualEndTime.HasValue)
                surgery.ActualEndTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Surgery status updated to {newStatus}" });
        }

        /// <summary>
        /// POST: api/surgeries/{id}/assign-staff - Assign surgical team
        /// </summary>
        [HttpPost("{id}/assign-staff")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> AssignSurgeryStaff(int id, [FromBody] AssignSurgeryStaffDto assignDto)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            if (surgery.Status == "Completed" || surgery.Status == "Cancelled")
                return BadRequest(new { message = "Cannot assign staff to completed or cancelled surgeries" });

            surgery.AnesthesiologistId = assignDto.AnesthesiologistId;
            surgery.NurseId = assignDto.NurseId;
            surgery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Surgical team assigned successfully" });
        }

        /// <summary>
        /// POST: api/surgeries/{id}/start - Start surgery
        /// </summary>
        [HttpPost("{id}/start")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> StartSurgery(int id)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            if (surgery.Status != "Scheduled")
                return BadRequest(new { message = "Only scheduled surgeries can be started" });

            surgery.Status = "InProgress";
            surgery.ActualStartTime = DateTime.UtcNow;
            surgery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Surgery started", startTime = surgery.ActualStartTime });
        }

        /// <summary>
        /// POST: api/surgeries/{id}/complete - Complete surgery
        /// </summary>
        [HttpPost("{id}/complete")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> CompleteSurgery(int id, [FromBody] UpdateSurgeryDto completionData)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            if (surgery.Status != "InProgress")
                return BadRequest(new { message = "Only in-progress surgeries can be completed" });

            surgery.Status = "Completed";
            surgery.ActualEndTime = DateTime.UtcNow;
            surgery.PostOpDiagnosis = completionData.PostOpDiagnosis;
            surgery.PostOpInstructions = completionData.PostOpInstructions;
            surgery.PostOpNotes = completionData.PostOpNotes;
            surgery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Surgery completed successfully" });
        }

        /// <summary>
        /// GET: api/surgeries/scheduled - Get scheduled surgeries
        /// </summary>
        [HttpGet("scheduled")]
        [Authorize(Roles = "Clinician,Receptionist")]
        public async Task<ActionResult<List<SurgeryDto>>> GetScheduledSurgeries([FromQuery] DateTime? date = null)
        {
            var query = _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .Where(s => s.Status == "Scheduled");

            if (date.HasValue)
                query = query.Where(s => s.ScheduledDate.Date == date.Value.Date);

            var surgeries = await query
                .OrderBy(s => s.ScheduledDate)
                .ToListAsync();

            var surgeryDtos = _mapper.Map<List<SurgeryDto>>(surgeries);
            return Ok(surgeryDtos);
        }

        /// <summary>
        /// GET: api/surgeries/today - Today's surgeries
        /// </summary>
        [HttpGet("today")]
        [Authorize(Roles = "Clinician,Receptionist")]
        public async Task<ActionResult<List<SurgeryDto>>> GetTodaySurgeries()
        {
            var today = DateTime.Today;

            var surgeries = await _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .Include(s => s.Room)
                .Where(s => s.ScheduledDate.Date == today)
                .OrderBy(s => s.ScheduledDate)
                .ToListAsync();

            var surgeryDtos = _mapper.Map<List<SurgeryDto>>(surgeries);
            return Ok(surgeryDtos);
        }

        /// <summary>
        /// GET: api/surgeries/statistics
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "Clinician")]
        public async Task<ActionResult> GetSurgeryStatistics([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Surgeries.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(s => s.ScheduledDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(s => s.ScheduledDate <= endDate.Value);

            var stats = new
            {
                Total = await query.CountAsync(),
                Scheduled = await query.CountAsync(s => s.Status == "Scheduled"),
                InProgress = await query.CountAsync(s => s.Status == "InProgress"),
                Completed = await query.CountAsync(s => s.Status == "Completed"),
                Cancelled = await query.CountAsync(s => s.Status == "Cancelled"),
                ByType = await query.GroupBy(s => s.SurgeryType)
                    .Select(g => new { Type = g.Key, Count = g.Count() })
                    .ToListAsync(),
                BySurgeon = await query
                    .Include(s => s.Surgeon).ThenInclude(c => c.User)
                    .GroupBy(s => new { s.SurgeonId, s.Surgeon.User.FirstName, s.Surgeon.User.LastName })
                    .Select(g => new {
                        SurgeonName = $"{g.Key.FirstName} {g.Key.LastName}",
                        Count = g.Count()
                    })
                    .ToListAsync()
            };

            return Ok(stats);
        }

        /// <summary>
        /// DELETE: api/surgeries/{id}
        /// System/Admin only - not for regular user roles
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "System")] // Not accessible by Clinician/Receptionist/Patient
        public async Task<IActionResult> DeleteSurgery(int id)
        {
            var surgery = await _context.Surgeries.FindAsync(id);
            if (surgery == null)
                return NotFound(new { message = $"Surgery with ID {id} not found" });

            surgery.IsDeleted = true;
            surgery.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Surgery deleted successfully" });
        }
    }
}
