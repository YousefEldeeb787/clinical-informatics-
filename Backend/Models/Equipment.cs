using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Equipment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Category { get; set; } // SurgicalInstrument, AnesthesiaMachine, Monitor, etc.

        [MaxLength(100)]
        public string SerialNumber { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Available, InUse, Maintenance, OutOfService

        public int? RoomId { get; set; }

        public DateTime? LastMaintenanceDate { get; set; }

        public DateTime? NextMaintenanceDate { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual Room Room { get; set; }
    }
}
