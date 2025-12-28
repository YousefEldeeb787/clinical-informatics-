using AutoMapper;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Data.DTOs.Common;
using ClinicSystemBackend.Data.DTOs.Encounter;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class EncounterService : IEncounterService
    {
        private readonly ClinicDbContext _context;
        private readonly IMapper _mapper;

        public EncounterService(ClinicDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<EncounterDto> GetByIdAsync(int id)
        {
            var encounter = await _context.Encounters
                .Include(e => e.Patient)
                .Include(e => e.Clinician)
                .FirstOrDefaultAsync(e => e.Id == id);

            return _mapper.Map<EncounterDto>(encounter);
        }

        public async Task<IEnumerable<EncounterDto>> GetByPatientIdAsync(int patientId)
        {
            var encounters = await _context.Encounters
                .Include(e => e.Patient)
                .Include(e => e.Clinician)
                .Where(e => e.PatientId == patientId)
                .OrderByDescending(e => e.EncounterDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EncounterDto>>(encounters);
        }

        public async Task<IEnumerable<EncounterDto>> GetByClinicianIdAsync(int clinicianId)
        {
            var encounters = await _context.Encounters
                .Include(e => e.Patient)
                .Include(e => e.Clinician)
                .Where(e => e.ClinicianId == clinicianId)
                .OrderByDescending(e => e.EncounterDate)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EncounterDto>>(encounters);
        }

        public async Task<EncounterDto> CreateAsync(CreateEncounterDto dto)
        {
            var encounter = _mapper.Map<Encounter>(dto);
            encounter.CreatedAt = DateTime.UtcNow;
            encounter.UpdatedAt = DateTime.UtcNow;

            _context.Encounters.Add(encounter);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(encounter.Id);
        }

        public async Task<EncounterDto> UpdateAsync(int id, UpdateEncounterDto dto)
        {
            var encounter = await _context.Encounters.FindAsync(id);
            if (encounter == null) return null;

            _mapper.Map(dto, encounter);
            encounter.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var encounter = await _context.Encounters.FindAsync(id);
            if (encounter == null) return false;

            encounter.IsDeleted = true;
            encounter.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResultDto<EncounterDto>> GetPagedAsync(int pageNumber, int pageSize)
        {
            var query = _context.Encounters
                .Include(e => e.Patient)
                .Include(e => e.Clinician)
                .OrderByDescending(e => e.EncounterDate);

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<EncounterDto>
            {
                Items = _mapper.Map<List<EncounterDto>>(items),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
