using System;

namespace ClinicSystemBackend.Data.DTOs.Prescription
{
    public class PrescriptionDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int PrescribedById { get; set; }
        public string PrescribedByName { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public string Route { get; set; }
        public int Quantity { get; set; }
        public int? Refills { get; set; }
        public string Instructions { get; set; }
        public string Indication { get; set; }
        public string Status { get; set; }
        public DateTime PrescribedDate { get; set; }
        public DateTime? FilledDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}
