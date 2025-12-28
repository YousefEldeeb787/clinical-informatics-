using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicSystemBackend.Models
{
    public class CDSSRecommendation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        public int? EncounterId { get; set; }

        [ForeignKey("EncounterId")]
        public Encounter? Encounter { get; set; }

        public int? DocumentId { get; set; }

        [ForeignKey("DocumentId")]
        public MedicalDocument? Document { get; set; }

        [Required]
        [MaxLength(50)]
        public string RecommendationType { get; set; } = string.Empty; // Diagnosis, Treatment, Alert, FollowUp

        [Required]
        public string RecommendationText { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Severity { get; set; } = "Normal"; // Urgent, Warning, Normal, Info

        public double? ConfidenceScore { get; set; }

        // Supporting Evidence
        public string? SupportingEvidence { get; set; } // JSON array of entity IDs or text

        // Decision Rules Applied
        public string? RulesApplied { get; set; } // JSON array of rule IDs

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        public bool IsReviewed { get; set; } = false;

        public DateTime? ReviewedAt { get; set; }

        public int? ReviewedByUserId { get; set; }

        [ForeignKey("ReviewedByUserId")]
        public User? ReviewedBy { get; set; }

        public bool IsAccepted { get; set; } = false;

        public string? ReviewNotes { get; set; }
    }
}
