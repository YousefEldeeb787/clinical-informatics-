using ClinicSystemBackend.Data.DTOs.Billing;

namespace ClinicSystemBackend.Interfaces
{
    public interface IBillingService
    {
        Task<BillingDto> GetByIdAsync(int id);
        Task<IEnumerable<BillingDto>> GetByPatientIdAsync(int patientId);
        Task<BillingDto> CreateAsync(CreateBillingDto dto);
        Task<BillingDto> RecordPaymentAsync(int id, RecordPaymentDto dto);
        Task<bool> DeleteAsync(int id);
        Task<decimal> GetOutstandingBalanceAsync(int patientId);
    }
}
