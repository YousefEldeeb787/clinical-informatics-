using ClinicSystemBackend.Models;

namespace ClinicSystemBackend.Interfaces
{
    public interface IPatientRepository : IRepository<Patient>
    {
        Task<Patient> GetPatientWithDetailsAsync(int id);
    }
}
