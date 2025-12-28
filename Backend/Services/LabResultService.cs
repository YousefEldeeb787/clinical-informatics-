using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.LabResult;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class LabResultService : ILabResultService
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public LabResultService(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<LabResultDto> GetByIdAsync(int id)
        {
            var labResult = await _context.LabResults
                .Include(l => l.Patient)
                .FirstOrDefaultAsync(l => l.Id == id);

            return _mapper.Map<LabResultDto>(labResult);
        }

        public async Task<IEnumerable<LabResultDto>> GetByPatientIdAsync(int patientId)
        {
            var labResults = await _context.LabResults
                .Include(l => l.Patient)
                .Where(l => l.PatientId == patientId)
                .OrderByDescending(l => l.TestDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<LabResultDto>>(labResults);
        }

        public async Task<LabResultDto> CreateAsync(CreateLabResultDto dto)
        {
            var labResult = _mapper.Map<LabResult>(dto);
            labResult.CreatedAt = DateTime.UtcNow;

            _context.LabResults.Add(labResult);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(labResult.Id);
        }

        public async Task<LabResultDto> UpdateAsync(int id, CreateLabResultDto dto)
        {
            var labResult = await _context.LabResults.FindAsync(id);
            if (labResult == null) return null;

            _mapper.Map(dto, labResult);

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var labResult = await _context.LabResults.FindAsync(id);
            if (labResult == null) return false;

            labResult.IsDeleted = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
