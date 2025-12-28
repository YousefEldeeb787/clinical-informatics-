using System;

namespace ClinicSystemBackend.Data.DTOs.LabResult
{
    public class LabResultDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public string TestName { get; set; }
        public string TestCode { get; set; }
        public string Result { get; set; }
        public string Unit { get; set; }
        public string ReferenceRange { get; set; }
        public string Status { get; set; }
        public DateTime? TestDate { get; set; }
        public DateTime? ResultDate { get; set; }
        public string Notes { get; set; }
        public string AttachmentUrl { get; set; }
    }
}
