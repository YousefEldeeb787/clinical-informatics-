using AutoMapper;
using ClinicSystemBackend.Authorization;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Appointment;
using ClinicSystemBackend.Data.DTOs.Common;
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
    public class AppointmentsController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public AppointmentsController(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        /// <summary>
        /// GET: api/appointments - List appointments with filters
        /// ? Allowed: Admin, Clinician, Receptionist
        /// ?? Blocked: Patient (use own endpoint)
        /// </summary>
        [HttpGet]
        [Authorize(Policy = nameof(RolePermissions.ViewAppointments))]
        public async Task<ActionResult<PagedResultDto<AppointmentDto>>> GetAppointments(
            [FromQuery] int? patientId = null,
            [FromQuery] int? clinicianId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null,
            [FromQuery] string status = null,
            [FromQuery] string appointmentType = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 20)
        {
            var query = _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .AsQueryable();

            // Apply filters
            if (patientId.HasValue)
                query = query.Where(a => a.PatientId == patientId.Value);

            if (clinicianId.HasValue)
                query = query.Where(a => a.ClinicianId == clinicianId.Value);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(a => a.Status == status);

            if (!string.IsNullOrWhiteSpace(appointmentType))
                query = query.Where(a => a.AppointmentType == appointmentType);

            if (startDate.HasValue)
                query = query.Where(a => a.StartTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.StartTime <= endDate.Value);

            var totalCount = await query.CountAsync();

            var appointments = await query
                .OrderBy(a => a.StartTime)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);

            var result = new PagedResultDto<AppointmentDto>
            {
                Items = appointmentDtos,
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
        /// GET: api/appointments/my - Get own appointments (Patient only)
        /// ? Allowed: Patient (own only)
        /// </summary>
        [HttpGet("my")]
        [Authorize(Policy = nameof(RolePermissions.ViewOwnAppointments))]
        public async Task<ActionResult<List<AppointmentDto>>> GetMyAppointments()
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
            if (patient == null)
            {
                return NotFound(new { message = "Patient record not found" });
            }

            var appointments = await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .Where(a => a.PatientId == patient.Id)
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            return Ok(_mapper.Map<List<AppointmentDto>>(appointments));
        }

        /// <summary>
        /// GET: api/appointments/{id}
        /// ? Allowed: Admin, Clinician, Receptionist, Patient (own only)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<AppointmentDto>> GetAppointment(int id)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var appointment = await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            // RBAC Check
            if (currentRole == "Patient")
            {
                // Patient can only view own appointments
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || appointment.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Not your appointment
                }
            }
            else if (currentRole != "Clinician" && currentRole != "Receptionist" && currentRole != "Admin")
            {
                return Forbid();
            }

            var appointmentDto = _mapper.Map<AppointmentDto>(appointment);
            return Ok(appointmentDto);
        }

        /// <summary>
        /// POST: api/appointments - Book appointment
        /// ? Allowed: Admin, Clinician, Receptionist (schedule for others), Patient (request for self)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = nameof(RolePermissions.CreateAppointment))]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment([FromBody] CreateAppointmentDto createDto)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // RBAC Check for Patient
            if (currentRole == "Patient")
            {
                // Patient can only create appointments for themselves
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || createDto.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Can only book for yourself
                }
            }

            // Validate patient exists
            if (!await _context.Patients.AnyAsync(p => p.Id == createDto.PatientId))
                return BadRequest(new { message = "Patient not found" });

            // Validate clinician exists
            if (!await _context.Clinicians.AnyAsync(c => c.Id == createDto.ClinicianId))
                return BadRequest(new { message = "Clinician not found" });

            // Check for conflicts
            var hasConflict = await _context.Appointments
                .AnyAsync(a => a.ClinicianId == createDto.ClinicianId &&
                              a.Status != "Cancelled" &&
                              ((a.StartTime < createDto.EndTime && a.EndTime > createDto.StartTime)));

            if (hasConflict)
                return BadRequest(new { message = "Clinician has a conflicting appointment" });

            // Check room availability if specified
            if (createDto.RoomId.HasValue)
            {
                var roomConflict = await _context.Appointments
                    .AnyAsync(a => a.RoomId == createDto.RoomId &&
                                  a.Status != "Cancelled" &&
                                  ((a.StartTime < createDto.EndTime && a.EndTime > createDto.StartTime)));

                if (roomConflict)
                    return BadRequest(new { message = "Room is not available at the selected time" });
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int createdBy);

            var appointment = _mapper.Map<Appointment>(createDto);
            appointment.Status = "Scheduled";
            appointment.CreatedAt = DateTime.UtcNow;
            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Reload with includes
            appointment = await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .FirstOrDefaultAsync(a => a.Id == appointment.Id);

            var appointmentDto = _mapper.Map<AppointmentDto>(appointment);
            return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointmentDto);
        }

        /// <summary>
        /// PUT: api/appointments/{id}
        /// ? Allowed: Admin, Clinician, Receptionist
        /// ?? Blocked: Patient (can only cancel, not reschedule)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = nameof(RolePermissions.UpdateAppointment))]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateAppointmentDto updateDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            if (appointment.Status == "Completed" || appointment.Status == "Cancelled")
                return BadRequest(new { message = "Cannot update completed or cancelled appointments" });

            // Check for conflicts
            var hasConflict = await _context.Appointments
                .AnyAsync(a => a.Id != id &&
                              a.ClinicianId == appointment.ClinicianId &&
                              a.Status != "Cancelled" &&
                              ((a.StartTime < updateDto.EndTime && a.EndTime > updateDto.StartTime)));

            if (hasConflict)
                return BadRequest(new { message = "Clinician has a conflicting appointment" });

            appointment.StartTime = updateDto.StartTime;
            appointment.EndTime = updateDto.EndTime;
            appointment.Reason = updateDto.Reason;
            appointment.RoomId = updateDto.RoomId;
            appointment.Notes = updateDto.Notes;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        /// <summary>
        /// PATCH: api/appointments/{id}/status - Update appointment status
        /// </summary>
        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Admin,Clinician,Receptionist")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateAppointmentStatusDto statusDto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            appointment.Status = statusDto.Status;
            appointment.UpdatedAt = DateTime.UtcNow;

            if (statusDto.Status == "Cancelled" && !string.IsNullOrWhiteSpace(statusDto.CancellationReason))
                appointment.CancellationReason = statusDto.CancellationReason;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated successfully" });
        }

        /// <summary>
        /// POST: api/appointments/{id}/checkin - Check-in patient
        /// ? Allowed: Admin, Receptionist (front desk duty)
        /// ?? Blocked: Clinician, Patient
        /// </summary>
        [HttpPost("{id}/checkin")]
        [Authorize(Policy = nameof(RolePermissions.CheckInAppointment))]
        public async Task<IActionResult> CheckInAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            if (appointment.Status != "Scheduled")
                return BadRequest(new { message = "Only scheduled appointments can be checked in" });

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int.TryParse(userIdClaim, out int checkedInBy);

            appointment.Status = "CheckedIn";
            appointment.CheckedInAt = DateTime.UtcNow;
            appointment.CheckedInBy = checkedInBy;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient checked in successfully" });
        }

        /// <summary>
        /// POST: api/appointments/{id}/cancel - Cancel appointment
        /// ? Allowed: Admin, Clinician, Receptionist, Patient (own only)
        /// </summary>
        [HttpPost("{id}/cancel")]
        [Authorize(Policy = nameof(RolePermissions.CancelAppointment))]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] UpdateAppointmentStatusDto cancelDto)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            // RBAC Check for Patient
            if (currentRole == "Patient")
            {
                // Patient can only cancel own appointments
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
                if (patient == null || appointment.PatientId != patient.Id)
                {
                    return Forbid(); // 403 - Not your appointment
                }
            }

            if (appointment.Status == "Completed")
                return BadRequest(new { message = "Cannot cancel completed appointments" });

            appointment.Status = "Cancelled";
            appointment.CancellationReason = cancelDto.CancellationReason;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment cancelled successfully" });
        }

        /// <summary>
        /// GET: api/appointments/today - Today's appointments
        /// ? Allowed: Admin, Clinician, Receptionist
        /// ?? Blocked: Patient
        /// </summary>
        [HttpGet("today")]
        [Authorize(Policy = nameof(RolePermissions.ViewAppointments))]
        public async Task<ActionResult<List<AppointmentDto>>> GetTodayAppointments([FromQuery] int? clinicianId = null)
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var query = _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .Where(a => a.StartTime >= today && a.StartTime < tomorrow);

            if (clinicianId.HasValue)
                query = query.Where(a => a.ClinicianId == clinicianId.Value);

            var appointments = await query
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }

        /// <summary>
        /// GET: api/appointments/upcoming - Upcoming appointments
        /// </summary>
        [HttpGet("upcoming")]
        [Authorize(Roles = "Admin,Clinician,Receptionist,Patient")]
        public async Task<ActionResult<List<AppointmentDto>>> GetUpcomingAppointments(
            [FromQuery] int? patientId = null,
            [FromQuery] int? clinicianId = null,
            [FromQuery] int days = 7)
        {
            var now = DateTime.UtcNow;
            var endDate = now.AddDays(days);

            var query = _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .Include(a => a.Room)
                .Where(a => a.StartTime >= now && a.StartTime <= endDate && a.Status == "Scheduled");

            if (patientId.HasValue)
                query = query.Where(a => a.PatientId == patientId.Value);

            if (clinicianId.HasValue)
                query = query.Where(a => a.ClinicianId == clinicianId.Value);

            var appointments = await query
                .OrderBy(a => a.StartTime)
                .ToListAsync();

            var appointmentDtos = _mapper.Map<List<AppointmentDto>>(appointments);
            return Ok(appointmentDtos);
        }

        /// <summary>
        /// GET: api/appointments/statistics - Appointment statistics
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "Admin,Clinician")]
        public async Task<ActionResult> GetAppointmentStatistics([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Appointments.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(a => a.StartTime >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.StartTime <= endDate.Value);

            var stats = new
            {
                Total = await query.CountAsync(),
                Scheduled = await query.CountAsync(a => a.Status == "Scheduled"),
                CheckedIn = await query.CountAsync(a => a.Status == "CheckedIn"),
                Completed = await query.CountAsync(a => a.Status == "Completed"),
                Cancelled = await query.CountAsync(a => a.Status == "Cancelled"),
                NoShow = await query.CountAsync(a => a.Status == "NoShow"),
                ByType = await query.GroupBy(a => a.AppointmentType)
                    .Select(g => new { Type = g.Key, Count = g.Count() })
                    .ToListAsync()
            };

            return Ok(stats);
        }

        /// <summary>
        /// DELETE: api/appointments/{id} - Soft delete
        /// System/Admin only - not for regular user roles
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "System")] // Not accessible by Clinician/Receptionist/Patient
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = $"Appointment with ID {id} not found" });

            appointment.IsDeleted = true;
            appointment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment deleted successfully" });
        }
    }
}
