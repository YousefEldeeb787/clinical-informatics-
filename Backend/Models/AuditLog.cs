using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace ClinicSystemBackend.Models
{
    // Audit & Compliance

    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Action { get; set; } // Create, Read, Update, Delete

        [Required]
        [MaxLength(100)]
        public string EntityName { get; set; }

        [Required]
        public int EntityId { get; set; }

        public string OldValues { get; set; } // JSON

        public string NewValues { get; set; } // JSON

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string IpAddress { get; set; }

        // Navigation
        public virtual User User { get; set; }
    }
}
