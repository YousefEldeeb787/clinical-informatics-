using System;

namespace ClinicSystemBackend.Data.DTOs.MedicalHistory
{
    public class CreateMedicalHistoryEntryDto
    {
        public int PatientId { get; set; }
        public string EntryType { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string Severity { get; set; }
        public DateTime? OnsetDate { get; set; }
        public string StructuredData { get; set; }
    }
}
