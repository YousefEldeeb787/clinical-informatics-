using ClinicSystemBackend.Data.DTOs.Common;
using ClinicSystemBackend.Data.DTOs.Encounter;

namespace ClinicSystemBackend.Interfaces
{
    public interface IEncounterService
    {
        Task<EncounterDto> GetByIdAsync(int id);
        Task<IEnumerable<EncounterDto>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<EncounterDto>> GetByClinicianIdAsync(int clinicianId);
        Task<EncounterDto> CreateAsync(CreateEncounterDto dto);
        Task<EncounterDto> UpdateAsync(int id, UpdateEncounterDto dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResultDto<EncounterDto>> GetPagedAsync(int pageNumber, int pageSize);
    }
}
