using System;

namespace ClinicSystemBackend.Data.DTOs.Surgery
{
    public class UpdateSurgeryDto
    {
        public DateTime? ActualStartTime { get; set; }
        public DateTime? ActualEndTime { get; set; }
        public string OperativeFindings { get; set; }
        public string ProcedureDetails { get; set; }
        public string Complications { get; set; }
        public int? EstimatedBloodLoss { get; set; }
        public string PostOpDiagnosis { get; set; }
        public string PostOpInstructions { get; set; }
        public string PostOpNotes { get; set; }
    }
}
