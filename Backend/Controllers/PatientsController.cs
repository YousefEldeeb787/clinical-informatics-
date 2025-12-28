using AutoMapper;
using ClinicSystemBackend.Authorization;
using ClinicSystemBackend.Data.DTOs.Patient;
using ClinicSystemBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;
        private readonly IMapper _mapper;

        public PatientsController(IPatientService patientService, IMapper mapper)
        {
            _patientService = patientService;
            _mapper = mapper;
        }

        /// <summary>
        /// GET: api/patients - List all patients with basic info
        /// ✅ Allowed: Admin, Clinician, Receptionist
        /// 🚫 Blocked: Patient (can only see own record)
        /// </summary>
        [HttpGet]
        [Authorize(Policy = nameof(RolePermissions.ViewPatients))]
        public async Task<ActionResult<IEnumerable<PatientSummaryDto>>> GetPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(patients);
        }

        /// <summary>
        /// GET: api/patients/{id} - Get patient by ID with full details
        /// ✅ Allowed: Admin, Clinician (full access), Patient (own record only)
        /// 🚫 Blocked: Receptionist (no medical history access)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize] // Custom logic inside to check own data access
        public async Task<ActionResult<PatientDto>> GetPatient(int id)
        {
            var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Get patient to check ownership
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound(new { message = $"Patient with ID {id} not found" });
            }

            // RBAC Check
            if (currentRole == "Patient")
            {
                // Patients can only view their own record
                if (patient.UserId != currentUserId)
                {
                    return Forbid(); // 403 - Not your data
                }
            }
            else if (currentRole == "Receptionist")
            {
                // Receptionist CANNOT view full medical history
                return Forbid(); // 403 - No clinical data access
            }
            else if (currentRole != "Clinician" && currentRole != "Admin")
            {
                return Forbid(); // 403 - Unauthorized role
            }

            return Ok(patient);
        }

        /// <summary>
        /// POST: api/patients - Create new patient
        /// ✅ Allowed: Admin, Receptionist, Clinician
        /// 🚫 Blocked: Patient (cannot register others)
        /// </summary>
        [HttpPost]
        [Authorize(Policy = nameof(RolePermissions.CreatePatient))]
        public async Task<ActionResult<PatientDto>> CreatePatient([FromBody] CreatePatientDto createPatientDto)
        {
            try
            {
                var newPatient = await _patientService.CreatePatientAsync(createPatientDto);
                return CreatedAtAction(nameof(GetPatient), new { id = newPatient.Id }, newPatient);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// PUT: api/patients/{id} - Update patient demographics
        /// ✅ Allowed: Admin (full), Clinician (medical), Receptionist (personal/insurance), Patient (own personal only)
        /// 🚫 Restrictions apply based on role
        /// </summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientDto updatePatientDto)
        {
            try
            {
                var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                // Get patient to check ownership
                var patient = await _patientService.GetPatientByIdAsync(id);
                if (patient == null)
                {
                    return NotFound(new { message = "Patient not found" });
                }

                // RBAC Check
                if (currentRole == "Patient")
                {
                    // Patients can only update their own personal info (NOT medical data)
                    if (patient.UserId != currentUserId)
                    {
                        return Forbid(); // 403 - Not your data
                    }
                    if (!RolePermissions.HasPermission("Patient", RolePermissions.UpdateOwnPersonalInfo))
                    {
                        return Forbid();
                    }
                }
                else if (currentRole == "Receptionist")
                {
                    // Receptionist can only update personal and insurance info (NOT medical data)
                    if (!RolePermissions.HasPermission("Receptionist", RolePermissions.UpdatePatientPersonalInfo))
                    {
                        return Forbid();
                    }
                }
                else if (currentRole == "Clinician")
                {
                    // Clinician can update medical info
                    if (!RolePermissions.HasPermission("Clinician", RolePermissions.UpdatePatient))
                    {
                        return Forbid();
                    }
                }
                else if (currentRole != "Admin")
                {
                    return Forbid();
                }

                await _patientService.UpdatePatientAsync(id, updatePatientDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// DELETE: api/patients/{id} - Soft delete patient
        /// ✅ Allowed: Admin ONLY
        /// 🚫 Blocked: All other roles
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = nameof(RolePermissions.DeletePatient))]
        public async Task<IActionResult> DeletePatient(int id)
        {
            try
            {
                await _patientService.DeletePatientAsync(id);
                return Ok(new { message = "Patient deactivated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}