using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int PrescribedById { get; set; }

        public int? EncounterId { get; set; }

        [Required]
        [MaxLength(255)]
        public string MedicationName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Dosage { get; set; }

        [Required]
        [MaxLength(100)]
        public string Frequency { get; set; }

        [MaxLength(100)]
        public string Route { get; set; } // Oral, IV, IM, Topical

        public int Quantity { get; set; }

        public int? Refills { get; set; }

        public string Instructions { get; set; }

        [MaxLength(100)]
        public string Indication { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Active, Filled, Cancelled, Expired

        public DateTime PrescribedDate { get; set; } = DateTime.UtcNow;

        public DateTime? FilledDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Clinician PrescribedBy { get; set; }
        public virtual Encounter Encounter { get; set; }
    }
}
