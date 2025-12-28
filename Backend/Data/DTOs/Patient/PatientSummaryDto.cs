using System;

namespace ClinicSystemBackend.Data.DTOs.Patient
{
    public class PatientSummaryDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string MRN { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string PrimaryClinicianName { get; set; }
    }
}

