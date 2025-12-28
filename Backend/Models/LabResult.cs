using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class LabResult
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        public int? OrderedById { get; set; }

        public int? EncounterId { get; set; }

        [Required]
        [MaxLength(255)]
        public string TestName { get; set; }

        [MaxLength(50)]
        public string TestCode { get; set; } // LOINC code

        [Required]
        public string Result { get; set; }

        [MaxLength(50)]
        public string Unit { get; set; }

        [MaxLength(100)]
        public string ReferenceRange { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } // Normal, Abnormal, Critical, Pending

        public DateTime? TestDate { get; set; }

        public DateTime? ResultDate { get; set; }

        public string Notes { get; set; }

        public string AttachmentUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Encounter Encounter { get; set; }
    }
}
