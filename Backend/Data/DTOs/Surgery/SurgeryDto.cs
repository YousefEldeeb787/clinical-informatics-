using System;

namespace ClinicSystemBackend.Data.DTOs.Surgery
{
    public class SurgeryDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int SurgeonId { get; set; }
        public string SurgeonName { get; set; }
        public int? AnesthesiologistId { get; set; }
        public string AnesthesiologistName { get; set; }
        public int? RoomId { get; set; }
        public string RoomNumber { get; set; }
        public string SurgeryName { get; set; }
        public string SurgeryType { get; set; }
        public string SurgeryCPTCode { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime? ActualStartTime { get; set; }
        public DateTime? ActualEndTime { get; set; }
        public string Status { get; set; }
        public string PreOpDiagnosis { get; set; }
        public string PreOpNotes { get; set; }
        public string AnesthesiaType { get; set; }
        public string OperativeFindings { get; set; }
        public string ProcedureDetails { get; set; }
        public string Complications { get; set; }
        public int? EstimatedBloodLoss { get; set; }
        public string PostOpDiagnosis { get; set; }
        public string PostOpInstructions { get; set; }
        public string PostOpNotes { get; set; }
        public DateTime? DischargeDate { get; set; }
    }
}
