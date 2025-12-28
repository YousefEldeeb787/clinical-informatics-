using System;

namespace ClinicSystemBackend.Data.DTOs.Surgery
{
    public class CreateSurgeryDto
    {
        public int PatientId { get; set; }
        public int SurgeonId { get; set; }
        public int? RoomId { get; set; }
        public string SurgeryName { get; set; }
        public string SurgeryType { get; set; }
        public string SurgeryCPTCode { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string PreOpDiagnosis { get; set; }
        public string PreOpNotes { get; set; }
        public string AnesthesiaType { get; set; }
    }
}
