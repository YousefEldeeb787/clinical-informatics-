using System;

namespace ClinicSystemBackend.Data.DTOs.Patient
{
    public class PatientDto
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Added for RBAC checks
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string MRN { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string BloodType { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhone { get; set; }
        public string EmergencyContactRelation { get; set; }
        public int? PrimaryClinicianId { get; set; }
        public string PrimaryClinicianName { get; set; }
        public int? InsuranceId { get; set; }
        public bool IsActive { get; set; }
    }
}
