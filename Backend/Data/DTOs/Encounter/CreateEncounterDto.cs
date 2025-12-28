namespace ClinicSystemBackend.Data.DTOs.Encounter
{
    public class CreateEncounterDto
    {
        public int PatientId { get; set; }
        public int ClinicianId { get; set; }
        public int? AppointmentId { get; set; }
        public string EncounterType { get; set; }
        public string ChiefComplaint { get; set; }
        public string HistoryOfPresentIllness { get; set; }
        public string PhysicalExamination { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
        public string ClinicalNotes { get; set; }
    }
}
