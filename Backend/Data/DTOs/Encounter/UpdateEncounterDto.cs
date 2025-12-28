namespace ClinicSystemBackend.Data.DTOs.Encounter
{
    public class UpdateEncounterDto
    {
        public string ChiefComplaint { get; set; }
        public string HistoryOfPresentIllness { get; set; }
        public string PhysicalExamination { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
        public string ClinicalNotes { get; set; }
    }
}
