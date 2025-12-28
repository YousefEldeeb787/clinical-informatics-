using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Encounter
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int ClinicianId { get; set; }

        public int? AppointmentId { get; set; }

        [Required]
        public DateTime EncounterDate { get; set; }

        [Required]
        [MaxLength(100)]
        public string EncounterType { get; set; } // InitialConsultation, PreOp, PostOp, FollowUp

        public string ChiefComplaint { get; set; }

        public string HistoryOfPresentIllness { get; set; }

        public string PhysicalExamination { get; set; }

        public string Assessment { get; set; }

        public string Plan { get; set; }

        public string ClinicalNotes { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } // InProgress, Signed, Amended

        public DateTime? SignedAt { get; set; }

        public int? SignedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Clinician Clinician { get; set; }
        public virtual Appointment Appointment { get; set; }
    }

}
