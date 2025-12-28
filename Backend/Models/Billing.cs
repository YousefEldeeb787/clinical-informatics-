using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace ClinicSystemBackend.Models
{
    public class Billing
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PatientId { get; set; }

        public int? EncounterId { get; set; }

        public int? SurgeryId { get; set; }

        [Required]
        [MaxLength(50)]
        public string InvoiceNumber { get; set; }

        [Required]
        public DateTime InvoiceDate { get; set; }

        [Required]
        public string LineItems { get; set; } // JSON array

        [Required]
        public decimal SubTotal { get; set; }

        public decimal Tax { get; set; }

        public decimal Discount { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public decimal AmountPaid { get; set; } = 0;

        public decimal AmountDue { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } // Pending, Paid, PartiallyPaid, Overdue, Cancelled

        public DateTime? DueDate { get; set; }

        public DateTime? PaidDate { get; set; }

        [MaxLength(100)]
        public string PaymentMethod { get; set; }

        public int? InsuranceId { get; set; }

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;

        // Navigation
        public virtual Patient Patient { get; set; }
        public virtual Encounter Encounter { get; set; }
        public virtual Surgery Surgery { get; set; }
        public virtual Insurance Insurance { get; set; }
    }
}
