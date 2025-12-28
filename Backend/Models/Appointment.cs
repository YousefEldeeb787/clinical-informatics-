using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int ClinicianId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Scheduled, CheckedIn, InProgress, Completed, Cancelled, NoShow

        [Required]
        [MaxLength(100)]
        public string AppointmentType { get; set; } // Consultation, PreOpAssessment, PostOpFollowup, Surgery

        [MaxLength(500)]
        public string Reason { get; set; }

        public int? RoomId { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; }

        [MaxLength(500)]
        public string CancellationReason { get; set; }

        public DateTime? CheckedInAt { get; set; }

        public int? CheckedInBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Clinician Clinician { get; set; }
        public virtual Room Room { get; set; }
        public virtual Encounter Encounter { get; set; }
    }
}
