using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinicSystemBackend.Models
{
    public class MedicalDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        [Required]
        [MaxLength(200)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string DocumentType { get; set; } = string.Empty; // Prescription, LabResult, ImagingReport, etc.

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public int? UploadedByUserId { get; set; }

        [ForeignKey("UploadedByUserId")]
        public User? UploadedBy { get; set; }

        public bool IsProcessed { get; set; } = false;

        public DateTime? ProcessedAt { get; set; }

        // OCR Results
        public string? OcrText { get; set; }

        // Metadata
        public string? Metadata { get; set; } // JSON format
    }
}
