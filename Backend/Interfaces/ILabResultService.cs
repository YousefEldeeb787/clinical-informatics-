using ClinicSystemBackend.Data.DTOs.LabResult;

namespace ClinicSystemBackend.Interfaces
{
    public interface ILabResultService
    {
        Task<LabResultDto> GetByIdAsync(int id);
        Task<IEnumerable<LabResultDto>> GetByPatientIdAsync(int patientId);
        Task<LabResultDto> CreateAsync(CreateLabResultDto dto);
        Task<LabResultDto> UpdateAsync(int id, CreateLabResultDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
