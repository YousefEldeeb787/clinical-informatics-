using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace ClinicSystemBackend.Models
{
    public class Clinician
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Specialization { get; set; }

        [Required]
        [MaxLength(100)]
        public string LicenseNumber { get; set; }

        [MaxLength(255)]
        public string Qualifications { get; set; }

        public int YearsOfExperience { get; set; }

        public bool IsAvailableForSurgery { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual User User { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
        public virtual ICollection<Encounter> Encounters { get; set; }
        public virtual ICollection<Surgery> SurgeriesPerformed { get; set; }
    }
}
