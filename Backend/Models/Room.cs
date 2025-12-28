using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Room
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string RoomNumber { get; set; }

        [Required]
        [MaxLength(100)]
        public string RoomType { get; set; } // OperatingRoom, RecoveryRoom, ConsultationRoom, PreOp

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Available, Occupied, Maintenance, Cleaning

        [MaxLength(50)]
        public string Floor { get; set; }

        public int? Capacity { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual ICollection<Surgery> Surgeries { get; set; }
        public virtual ICollection<Equipment> Equipments { get; set; }
    }
}
