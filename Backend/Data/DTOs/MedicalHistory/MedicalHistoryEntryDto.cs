using System;

namespace ClinicSystemBackend.Data.DTOs.MedicalHistory
{
    public class MedicalHistoryEntryDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string EntryType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Severity { get; set; }
        public DateTime? OnsetDate { get; set; }
        public DateTime? ResolutionDate { get; set; }
        public string StructuredData { get; set; }
        public DateTime RecordedAt { get; set; }
        public bool IsVerified { get; set; }
        public DateTime? VerifiedAt { get; set; }
    }
}
