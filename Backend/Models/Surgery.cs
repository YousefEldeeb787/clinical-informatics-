using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Surgery
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        [Required]
        public int SurgeonId { get; set; }

        public int? AnesthesiologistId { get; set; }

        public int? NurseId { get; set; }

        public int? RoomId { get; set; }

        [Required]
        [MaxLength(255)]
        public string SurgeryName { get; set; }

        [Required]
        [MaxLength(100)]
        public string SurgeryType { get; set; } // Major, Minor, Emergency, Elective

        [MaxLength(50)]
        public string SurgeryCPTCode { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        public DateTime? ActualStartTime { get; set; }

        public DateTime? ActualEndTime { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Scheduled, InProgress, Completed, Cancelled, Postponed

        // Pre-Op
        public string PreOpDiagnosis { get; set; }

        public string PreOpNotes { get; set; }

        [MaxLength(100)]
        public string AnesthesiaType { get; set; }

        // Intra-Op
        public string OperativeFindings { get; set; }

        public string ProcedureDetails { get; set; }

        public string Complications { get; set; }

        public int? EstimatedBloodLoss { get; set; }

        // Post-Op
        public string PostOpDiagnosis { get; set; }

        public string PostOpInstructions { get; set; }

        public string PostOpNotes { get; set; }

        public DateTime? DischargeDate { get; set; }

        public string SurgicalTeamNotes { get; set; } // JSON

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Clinician Surgeon { get; set; }
        public virtual Room Room { get; set; }
    }
}
