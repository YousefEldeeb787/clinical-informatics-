using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class MedicalHistoryEntry
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        [MaxLength(100)]
        public string EntryType { get; set; } // Problem, Allergy, PastSurgery, Immunization, FamilyHistory, SocialHistory, Note

        [Required]
        [MaxLength(255)]
        public string Title { get; set; }

        public string Description { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } // Active, Resolved, Inactive

        [MaxLength(50)]
        public string Severity { get; set; } // Mild, Moderate, Severe, Critical (for allergies/problems)

        public DateTime? OnsetDate { get; set; }

        public DateTime? ResolutionDate { get; set; }

        public string StructuredData { get; set; } // JSON for type-specific fields

        public int RecordedBy { get; set; }

        public DateTime RecordedAt { get; set; } = DateTime.UtcNow;

        public bool IsVerified { get; set; } = false;

        public int? VerifiedBy { get; set; }

        public DateTime? VerifiedAt { get; set; }

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
    }
}
