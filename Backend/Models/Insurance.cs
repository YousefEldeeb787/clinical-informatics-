using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Insurance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        [MaxLength(255)]
        public string ProviderName { get; set; }

        [Required]
        [MaxLength(100)]
        public string PolicyNumber { get; set; }

        [MaxLength(100)]
        public string GroupNumber { get; set; }

        [MaxLength(200)]
        public string PolicyHolderName { get; set; }

        [MaxLength(100)]
        public string PolicyHolderRelation { get; set; }

        public DateTime? CoverageStartDate { get; set; }

        public DateTime? CoverageEndDate { get; set; }

        [MaxLength(20)]
        public string ContactPhone { get; set; }

        public bool IsPrimary { get; set; } = true;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual Patient Patient { get; set; }
    }
}
