using ClinicSystemBackend.Data.DTOs.Prescription;

namespace ClinicSystemBackend.Interfaces
{
    public interface IPrescriptionService
    {
        Task<PrescriptionDto> GetByIdAsync(int id);
        Task<IEnumerable<PrescriptionDto>> GetByPatientIdAsync(int patientId);
        Task<PrescriptionDto> CreateAsync(CreatePrescriptionDto dto);
        Task<PrescriptionDto> UpdateStatusAsync(int id, UpdatePrescriptionStatusDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<PrescriptionDto>> GetActivePrescriptionsAsync(int patientId);
    }
}
