using ClinicSystemBackend.Data;
using ClinicSystemBackend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class ReportingService : IReportingService
    {
        private readonly ClinicDbContext _context;
        private readonly ILogger<ReportingService> _logger;

        public ReportingService(ClinicDbContext context, ILogger<ReportingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<object> GetDashboardStatisticsAsync()
        {
            var today = DateTime.UtcNow.Date;
            var thisMonth = new DateTime(today.Year, today.Month, 1);

            var statistics = new
            {
                TotalPatients = await _context.Patients.CountAsync(p => p.IsActive),
                TotalClinicians = await _context.Clinicians.CountAsync(),
                TodayAppointments = await _context.Appointments
                    .CountAsync(a => a.StartTime.Date == today && a.Status == "Scheduled"),
                ThisMonthAppointments = await _context.Appointments
                    .CountAsync(a => a.StartTime >= thisMonth && a.Status == "Scheduled"),
                UpcomingSurgeries = await _context.Surgeries
                    .CountAsync(s => s.ScheduledDate >= today && s.Status == "Scheduled"),
                PendingBills = await _context.Billings
                    .CountAsync(b => b.Status != "Paid"),
                TotalRevenue = await _context.Billings
                    .Where(b => b.InvoiceDate >= thisMonth)
                    .SumAsync(b => b.AmountPaid),
                OutstandingAmount = await _context.Billings
                    .Where(b => b.Status != "Paid")
                    .SumAsync(b => b.AmountDue)
            };

            return statistics;
        }

        public async Task<IEnumerable<object>> GetAppointmentStatisticsAsync(DateTime startDate, DateTime endDate)
        {
            var appointments = await _context.Appointments
                .Where(a => a.StartTime >= startDate && a.StartTime <= endDate)
                .GroupBy(a => a.StartTime.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Total = g.Count(),
                    Completed = g.Count(a => a.Status == "Completed"),
                    Cancelled = g.Count(a => a.Status == "Cancelled"),
                    NoShow = g.Count(a => a.Status == "NoShow")
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return appointments;
        }

        public async Task<IEnumerable<object>> GetSurgeryStatisticsAsync(DateTime startDate, DateTime endDate)
        {
            var surgeries = await _context.Surgeries
                .Where(s => s.ScheduledDate >= startDate && s.ScheduledDate <= endDate)
                .GroupBy(s => new { s.SurgeryType, Month = s.ScheduledDate.Month })
                .Select(g => new
                {
                    Type = g.Key.SurgeryType,
                    Month = g.Key.Month,
                    Count = g.Count(),
                    Completed = g.Count(s => s.Status == "Completed"),
                    Cancelled = g.Count(s => s.Status == "Cancelled")
                })
                .ToListAsync();

            return surgeries;
        }

        public async Task<IEnumerable<object>> GetRevenueReportAsync(DateTime startDate, DateTime endDate)
        {
            var revenue = await _context.Billings
                .Where(b => b.InvoiceDate >= startDate && b.InvoiceDate <= endDate)
                .GroupBy(b => b.InvoiceDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalBilled = g.Sum(b => b.TotalAmount),
                    TotalPaid = g.Sum(b => b.AmountPaid),
                    Outstanding = g.Sum(b => b.AmountDue),
                    InvoiceCount = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return revenue;
        }

        public async Task<IEnumerable<object>> GetPatientVisitsAsync(int patientId)
        {
            var visits = await _context.Encounters
                .Where(e => e.PatientId == patientId)
                .Include(e => e.Clinician).ThenInclude(c => c.User)
                .OrderByDescending(e => e.EncounterDate)
                .Select(e => new
                {
                    e.Id,
                    e.EncounterDate,
                    e.EncounterType,
                    e.ChiefComplaint,
                    Clinician = e.Clinician.User.FirstName + " " + e.Clinician.User.LastName,
                    e.Assessment
                })
                .ToListAsync();

            return visits;
        }

        public async Task<byte[]> ExportPatientsToExcelAsync()
        {
            // TODO: Implement Excel export using EPPlus or ClosedXML
            _logger.LogInformation("Patient export requested");
            await Task.CompletedTask;
            return Array.Empty<byte>();
        }

        public async Task<byte[]> ExportAppointmentsToExcelAsync(DateTime startDate, DateTime endDate)
        {
            // TODO: Implement Excel export using EPPlus or ClosedXML
            _logger.LogInformation("Appointment export requested for {StartDate} to {EndDate}", startDate, endDate);
            await Task.CompletedTask;
            return Array.Empty<byte>();
        }
    }
}
