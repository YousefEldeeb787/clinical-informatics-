using ClinicSystemBackend.Data.DTOs.Common;

namespace ClinicSystemBackend.Interfaces
{
    public interface IReportingService
    {
        Task<object> GetDashboardStatisticsAsync();
        Task<IEnumerable<object>> GetAppointmentStatisticsAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<object>> GetSurgeryStatisticsAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<object>> GetRevenueReportAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<object>> GetPatientVisitsAsync(int patientId);
        Task<byte[]> ExportPatientsToExcelAsync();
        Task<byte[]> ExportAppointmentsToExcelAsync(DateTime startDate, DateTime endDate);
    }
}
