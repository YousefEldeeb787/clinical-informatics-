using System;

namespace ClinicSystemBackend.Data.DTOs.Prescription
{
    public class UpdatePrescriptionStatusDto
    {
        public string Status { get; set; }
        public DateTime? FilledDate { get; set; }
    }
}
