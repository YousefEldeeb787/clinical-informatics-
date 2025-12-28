using ClinicSystemBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ClinicSystemBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Base authorization - specific endpoints have role restrictions
    public class ReportsController : ControllerBase
    {
        private readonly IReportingService _reportingService;
        private readonly ILogger<ReportsController> _logger;

        public ReportsController(IReportingService reportingService, ILogger<ReportsController> logger)
        {
            _reportingService = reportingService;
            _logger = logger;
        }

        /// <summary>
        /// Dashboard statistics - role-specific data
        /// Clinician: Clinical metrics
        /// Receptionist: Administrative metrics
        /// </summary>
        [HttpGet("dashboard")]
        [Authorize(Roles = "Clinician,Receptionist")]
        public async Task<IActionResult> GetDashboardStatistics()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var statistics = await _reportingService.GetDashboardStatisticsAsync();
            
            // Could filter data based on role here if needed
            return Ok(statistics);
        }

        /// <summary>
        /// Appointment statistics - accessible by Clinician and Receptionist
        /// </summary>
        [HttpGet("appointments")]
        [Authorize(Roles = "Clinician,Receptionist")]
        public async Task<IActionResult> GetAppointmentStatistics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var statistics = await _reportingService.GetAppointmentStatisticsAsync(startDate, endDate);
            return Ok(statistics);
        }

        /// <summary>
        /// Surgery statistics - clinical data, Clinician only
        /// </summary>
        [HttpGet("surgeries")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> GetSurgeryStatistics([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var statistics = await _reportingService.GetSurgeryStatisticsAsync(startDate, endDate);
            return Ok(statistics);
        }

        /// <summary>
        /// Revenue report - financial data, Receptionist only
        /// </summary>
        [HttpGet("revenue")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> GetRevenueReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var revenue = await _reportingService.GetRevenueReportAsync(startDate, endDate);
            return Ok(revenue);
        }

        /// <summary>
        /// Patient visits - accessible by Clinician
        /// </summary>
        [HttpGet("patient-visits/{patientId}")]
        [Authorize(Roles = "Clinician")]
        public async Task<IActionResult> GetPatientVisits(int patientId)
        {
            var visits = await _reportingService.GetPatientVisitsAsync(patientId);
            return Ok(visits);
        }

        /// <summary>
        /// Export patients - administrative function, Receptionist only
        /// </summary>
        [HttpGet("export/patients")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> ExportPatients()
        {
            var data = await _reportingService.ExportPatientsToExcelAsync();
            return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Patients_{DateTime.UtcNow:yyyyMMdd}.xlsx");
        }

        /// <summary>
        /// Export appointments - administrative function, Receptionist only
        /// </summary>
        [HttpGet("export/appointments")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> ExportAppointments([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var data = await _reportingService.ExportAppointmentsToExcelAsync(startDate, endDate);
            return File(data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", $"Appointments_{DateTime.UtcNow:yyyyMMdd}.xlsx");
        }
    }
}
