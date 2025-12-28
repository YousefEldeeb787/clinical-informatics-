using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Models
{
    public class Patient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string MRN { get; set; } // Medical Record Number

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [MaxLength(20)]
        public string Gender { get; set; }

        [MaxLength(20)]
        public string BloodType { get; set; }

        [MaxLength(255)]
        public string Address { get; set; }

        [MaxLength(100)]
        public string City { get; set; }

        [MaxLength(50)]
        public string State { get; set; }

        [MaxLength(20)]
        public string PostalCode { get; set; }

        [MaxLength(200)]
        public string EmergencyContactName { get; set; }

        [MaxLength(20)]
        public string EmergencyContactPhone { get; set; }

        [MaxLength(100)]
        public string EmergencyContactRelation { get; set; }

        public int? PrimaryClinicianId { get; set; }

        public int? InsuranceId { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; }
        public virtual Clinician PrimaryClinician { get; set; }
        public virtual Insurance Insurance { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<Encounter> Encounters { get; set; }
        public virtual ICollection<MedicalHistoryEntry> MedicalHistory { get; set; }
        public virtual ICollection<Surgery> Surgeries { get; set; }
        public virtual ICollection<Prescription> Prescriptions { get; set; }
        public virtual ICollection<LabResult> LabResults { get; set; }
        public virtual ICollection<Billing> BillingRecords { get; set; }
    }

}
