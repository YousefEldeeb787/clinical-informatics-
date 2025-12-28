using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Prescription;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public PrescriptionService(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<PrescriptionDto> GetByIdAsync(int id)
        {
            var prescription = await _context.Prescriptions
                .Include(p => p.Patient)
                .Include(p => p.PrescribedBy)
                .FirstOrDefaultAsync(p => p.Id == id);

            return _mapper.Map<PrescriptionDto>(prescription);
        }

        public async Task<IEnumerable<PrescriptionDto>> GetByPatientIdAsync(int patientId)
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Patient)
                .Include(p => p.PrescribedBy)
                .Where(p => p.PatientId == patientId)
                .OrderByDescending(p => p.PrescribedDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<PrescriptionDto>>(prescriptions);
        }

        public async Task<PrescriptionDto> CreateAsync(CreatePrescriptionDto dto)
        {
            var prescription = _mapper.Map<Prescription>(dto);
            prescription.CreatedAt = DateTime.UtcNow;
            prescription.PrescribedDate = DateTime.UtcNow;
            prescription.Status = "Active";

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(prescription.Id);
        }

        public async Task<PrescriptionDto> UpdateStatusAsync(int id, UpdatePrescriptionStatusDto dto)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return null;

            prescription.Status = dto.Status;
            if (dto.Status == "Filled")
            {
                prescription.FilledDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return false;

            prescription.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PrescriptionDto>> GetActivePrescriptionsAsync(int patientId)
        {
            var prescriptions = await _context.Prescriptions
                .Include(p => p.Patient)
                .Include(p => p.PrescribedBy)
                .Where(p => p.PatientId == patientId && p.Status == "Active")
                .ToListAsync();

            return _mapper.Map<IEnumerable<PrescriptionDto>>(prescriptions);
        }
    }
}
