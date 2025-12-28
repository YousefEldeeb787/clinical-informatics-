using ClinicSystemBackend.Data.DTOs.Patient;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ClinicSystemBackend.Interfaces
{
    public interface IPatientService
    {
        Task<IEnumerable<PatientSummaryDto>> GetAllPatientsAsync();
        Task<PatientDto> GetPatientByIdAsync(int id);
        Task<PatientDto> CreatePatientAsync(CreatePatientDto createPatientDto);
        Task UpdatePatientAsync(int id, UpdatePatientDto updatePatientDto);
        Task DeletePatientAsync(int id);
    }
}
