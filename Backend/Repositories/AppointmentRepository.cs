using ClinicSystemBackend.Data;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;

namespace ClinicSystemBackend.Repositories
{
    public class AppointmentRepository : GenericRepository<Appointment>, IAppointmentRepository
    {
        public AppointmentRepository(ClinicDbContext context) : base(context)
        {
        }

        // Custom appointment-related method implementations here
    }
}
