using System;

namespace ClinicSystemBackend.Data.DTOs.MedicalHistory
{
    public class UpdateMedicalHistoryEntryDto
    {
        public string Status { get; set; }
        public string Description { get; set; }
        public DateTime? ResolutionDate { get; set; }
    }
}
