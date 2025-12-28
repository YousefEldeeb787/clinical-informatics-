using AutoMapper;
using ClinicSystemBackend.Data.DTOs.Appointment;
using ClinicSystemBackend.Data.DTOs.Billing;
using ClinicSystemBackend.Data.DTOs.Clinician;
using ClinicSystemBackend.Data.DTOs.Encounter;
using ClinicSystemBackend.Data.DTOs.Equipment;
using ClinicSystemBackend.Data.DTOs.Insurance;
using ClinicSystemBackend.Data.DTOs.LabResult;
using ClinicSystemBackend.Data.DTOs.MedicalHistory;
using ClinicSystemBackend.Data.DTOs.Patient;
using ClinicSystemBackend.Data.DTOs.Prescription;
using ClinicSystemBackend.Data.DTOs.Room;
using ClinicSystemBackend.Data.DTOs.Surgery;
using ClinicSystemBackend.Data.DTOs.User;
using ClinicSystemBackend.Models;
using System.Text.Json;

namespace ClinicSystemBackend.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // ===== USER MAPPINGS =====
            CreateMap<User, UserDto>();
            CreateMap<CreateUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<UpdateUserDto, User>();

            // ===== PATIENT MAPPINGS =====
            CreateMap<Patient, PatientDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.PrimaryClinicianName, opt => opt.MapFrom(src =>
                    src.PrimaryClinician != null
                    ? $"{src.PrimaryClinician.User.FirstName} {src.PrimaryClinician.User.LastName}"
                    : null));

            CreateMap<Patient, PatientSummaryDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => CalculateAge(src.DateOfBirth)))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.PrimaryClinicianName, opt => opt.MapFrom(src =>
                    src.PrimaryClinician != null
                    ? $"{src.PrimaryClinician.User.FirstName} {src.PrimaryClinician.User.LastName}"
                    : null));

            CreateMap<CreatePatientDto, Patient>();
            CreateMap<UpdatePatientDto, Patient>();

            // ===== CLINICIAN MAPPINGS =====
            CreateMap<Clinician, ClinicianDto>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.User.Phone));

            CreateMap<CreateClinicianDto, Clinician>();

            // ===== APPOINTMENT MAPPINGS =====
            CreateMap<Appointment, AppointmentDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"))
                .ForMember(dest => dest.ClinicianName, opt => opt.MapFrom(src =>
                    $"{src.Clinician.User.FirstName} {src.Clinician.User.LastName}"))
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.Room != null ? src.Room.RoomNumber : null));

            CreateMap<CreateAppointmentDto, Appointment>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Scheduled"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateAppointmentDto, Appointment>();

            // ===== ENCOUNTER MAPPINGS =====
            CreateMap<Encounter, EncounterDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"))
                .ForMember(dest => dest.ClinicianName, opt => opt.MapFrom(src =>
                    $"{src.Clinician.User.FirstName} {src.Clinician.User.LastName}"));

            CreateMap<CreateEncounterDto, Encounter>()
                .ForMember(dest => dest.EncounterDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "InProgress"));

            CreateMap<UpdateEncounterDto, Encounter>();

            // ===== MEDICAL HISTORY MAPPINGS =====
            CreateMap<MedicalHistoryEntry, MedicalHistoryEntryDto>();
            CreateMap<CreateMedicalHistoryEntryDto, MedicalHistoryEntry>()
                .ForMember(dest => dest.RecordedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.IsVerified, opt => opt.MapFrom(src => false));

            CreateMap<UpdateMedicalHistoryEntryDto, MedicalHistoryEntry>();

            // ===== SURGERY MAPPINGS =====
            CreateMap<Surgery, SurgeryDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"))
                .ForMember(dest => dest.SurgeonName, opt => opt.MapFrom(src =>
                    $"{src.Surgeon.User.FirstName} {src.Surgeon.User.LastName}"))
                .ForMember(dest => dest.AnesthesiologistName, opt => opt.MapFrom(src =>
                    src.AnesthesiologistId != null ? "Anesthesiologist Assigned" : null))
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.Room != null ? src.Room.RoomNumber : null));

            CreateMap<CreateSurgeryDto, Surgery>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Scheduled"))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UpdateSurgeryDto, Surgery>();

            // ===== PRESCRIPTION MAPPINGS =====
            CreateMap<Prescription, PrescriptionDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"))
                .ForMember(dest => dest.PrescribedByName, opt => opt.MapFrom(src =>
                    $"{src.PrescribedBy.User.FirstName} {src.PrescribedBy.User.LastName}"));

            CreateMap<CreatePrescriptionDto, Prescription>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Active"))
                .ForMember(dest => dest.PrescribedDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ===== LAB RESULT MAPPINGS =====
            CreateMap<LabResult, LabResultDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"));

            CreateMap<CreateLabResultDto, LabResult>()
                .ForMember(dest => dest.ResultDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            // ===== INSURANCE MAPPINGS =====
            CreateMap<Insurance, InsuranceDto>();
            CreateMap<CreateInsuranceDto, Insurance>()
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            // ===== BILLING MAPPINGS =====
            CreateMap<Billing, BillingDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src =>
                    $"{src.Patient.User.FirstName} {src.Patient.User.LastName}"))
                .ForMember(dest => dest.LineItems, opt => opt.MapFrom(src =>
                    DeserializeLineItems(src.LineItems)));

            CreateMap<CreateBillingDto, Billing>()
                .ForMember(dest => dest.InvoiceNumber, opt => opt.Ignore())
                .ForMember(dest => dest.InvoiceDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
                .ForMember(dest => dest.LineItems, opt => opt.MapFrom(src => SerializeLineItems(src.LineItems)))
                .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src => src.LineItems.Sum(x => x.Amount)))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src =>
                    src.LineItems.Sum(x => x.Amount) + src.Tax - src.Discount))
                .ForMember(dest => dest.AmountDue, opt => opt.MapFrom(src =>
                    src.LineItems.Sum(x => x.Amount) + src.Tax - src.Discount));

            // ===== ROOM MAPPINGS =====
            CreateMap<Room, RoomDto>();
            CreateMap<CreateRoomDto, Room>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Available"));

            // ===== EQUIPMENT MAPPINGS =====
            CreateMap<Equipment, EquipmentDto>()
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src => src.Room != null ? src.Room.RoomNumber : null));

            CreateMap<CreateEquipmentDto, Equipment>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Available"));
        }

        private static int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }

        private static string SerializeLineItems(List<LineItemDto> lineItems)
        {
            return JsonSerializer.Serialize(lineItems);
        }

        private static List<LineItemDto> DeserializeLineItems(string lineItemsJson)
        {
            return JsonSerializer.Deserialize<List<LineItemDto>>(lineItemsJson);
        }
    }
}