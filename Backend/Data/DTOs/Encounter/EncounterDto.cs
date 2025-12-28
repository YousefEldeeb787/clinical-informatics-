using System;

namespace ClinicSystemBackend.Data.DTOs.Encounter
{
    public class EncounterDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int ClinicianId { get; set; }
        public string ClinicianName { get; set; }
        public DateTime EncounterDate { get; set; }
        public string EncounterType { get; set; }
        public string ChiefComplaint { get; set; }
        public string HistoryOfPresentIllness { get; set; }
        public string PhysicalExamination { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
        public string ClinicalNotes { get; set; }
        public string Status { get; set; }
        public DateTime? SignedAt { get; set; }
    }
}
