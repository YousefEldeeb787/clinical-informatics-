using ClinicSystemBackend.Data;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ClinicSystemBackend.Repositories
{
    public class PatientRepository : GenericRepository<Patient>, IPatientRepository
    {
        public PatientRepository(ClinicDbContext context) : base(context)
        {
        }

        public async Task<Patient> GetPatientWithDetailsAsync(int id)
        {
            return await _context.Patients
                .Include(p => p.User)
                .Include(p => p.PrimaryClinician)
                .ThenInclude(c => c.User)
                .Include(p => p.Insurance)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
