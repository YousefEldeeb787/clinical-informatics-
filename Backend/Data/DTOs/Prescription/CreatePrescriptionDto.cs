using System;

namespace ClinicSystemBackend.Data.DTOs.Prescription
{
    public class CreatePrescriptionDto
    {
        public int PatientId { get; set; }
        public int? EncounterId { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public string Route { get; set; }
        public int Quantity { get; set; }
        public int? Refills { get; set; }
        public string Instructions { get; set; }
        public string Indication { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
