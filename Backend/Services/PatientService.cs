using AutoMapper;
using ClinicSystemBackend.Data.DTOs.Patient;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ClinicSystemBackend.Services
{
    public class PatientService : IPatientService
    {
        private readonly IRepository<Patient> _patientRepository;
        private readonly IRepository<User> _userRepository;
        private readonly IPatientRepository _patientRepositoryWithDetails;
        private readonly IMapper _mapper;

        public PatientService(IRepository<Patient> patientRepository, IRepository<User> userRepository, IPatientRepository patientRepositoryWithDetails, IMapper mapper)
        {
            _patientRepository = patientRepository;
            _userRepository = userRepository;
            _patientRepositoryWithDetails = patientRepositoryWithDetails;
            _mapper = mapper;
        }

        public async Task<PatientDto> CreatePatientAsync(CreatePatientDto createPatientDto)
        {
            var existingUser = (await _userRepository.FindAsync(u => u.Email == createPatientDto.Email)).FirstOrDefault();
            if (existingUser != null)
            {
                throw new ArgumentException("Email already registered");
            }

            var user = new User
            {
                FirstName = createPatientDto.FirstName,
                LastName = createPatientDto.LastName,
                Email = createPatientDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPassword123!"), // Default password
                Role = "Patient",
                Phone = createPatientDto.Phone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();

            var mrn = $"MRN{DateTime.Now.Year}{user.Id:D6}";

            var patient = _mapper.Map<Patient>(createPatientDto);
            patient.UserId = user.Id;
            patient.MRN = mrn;
            patient.IsActive = true;
            patient.CreatedAt = DateTime.UtcNow;
            patient.UpdatedAt = DateTime.UtcNow;

            await _patientRepository.AddAsync(patient);
            await _patientRepository.SaveChangesAsync();

            var createdPatient = await _patientRepositoryWithDetails.GetPatientWithDetailsAsync(patient.Id);
            return _mapper.Map<PatientDto>(createdPatient);
        }

        public async Task DeletePatientAsync(int id)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Patient with ID {id} not found");
            }

            var user = await _userRepository.GetByIdAsync(patient.UserId);

            patient.IsActive = false;
            patient.UpdatedAt = DateTime.UtcNow;

            if (user != null)
            {
                user.IsActive = false;
                user.UpdatedAt = DateTime.UtcNow;
            }

            await _patientRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<PatientSummaryDto>> GetAllPatientsAsync()
        {
            var patients = await _patientRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PatientSummaryDto>>(patients);
        }

        public async Task<PatientDto> GetPatientByIdAsync(int id)
        {
            var patient = await _patientRepositoryWithDetails.GetPatientWithDetailsAsync(id);
            if (patient == null)
            {
                return null;
            }
            return _mapper.Map<PatientDto>(patient);
        }

        public async Task UpdatePatientAsync(int id, UpdatePatientDto updatePatientDto)
        {
            var patient = await _patientRepository.GetByIdAsync(id);
            if (patient == null)
            {
                throw new KeyNotFoundException($"Patient with ID {id} not found");
            }

            var user = await _userRepository.GetByIdAsync(patient.UserId);

            if (user != null && !string.IsNullOrWhiteSpace(updatePatientDto.Email) && user.Email != updatePatientDto.Email)
            {
                var existingUser = (await _userRepository.FindAsync(u => u.Email == updatePatientDto.Email && u.Id != user.Id)).FirstOrDefault();
                if (existingUser != null)
                {
                    throw new ArgumentException("Email already in use");
                }
                user.Email = updatePatientDto.Email;
            }

            if (user != null)
            {
                user.Phone = updatePatientDto.Phone;
                user.UpdatedAt = DateTime.UtcNow;
            }

            _mapper.Map(updatePatientDto, patient);
            patient.UpdatedAt = DateTime.UtcNow;

            await _patientRepository.SaveChangesAsync();
        }
    }
}
