using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicSystemBackend.Models
{
    public class MedicalEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DocumentId { get; set; }

        [ForeignKey("DocumentId")]
        public MedicalDocument? Document { get; set; }

        [Required]
        [MaxLength(100)]
        public string EntityType { get; set; } = string.Empty; // Symptom, Medication, Diagnosis, Procedure, LabValue

        [Required]
        [MaxLength(500)]
        public string EntityText { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? NormalizedText { get; set; }

        // Ontology Mapping
        [MaxLength(100)]
        public string? OntologyCode { get; set; } // SNOMED CT, ICD-10, UMLS code

        [MaxLength(100)]
        public string? OntologySystem { get; set; } // SNOMED, ICD10, UMLS

        [MaxLength(500)]
        public string? OntologyDescription { get; set; }

        public double? ConfidenceScore { get; set; }

        public DateTime ExtractedAt { get; set; } = DateTime.UtcNow;

        // Additional metadata
        public string? Metadata { get; set; } // JSON format for dosage, units, ranges, etc.
    }
}
