using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection.Emit;
using System.Security.Claims;

using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Data
{
    public class ClinicDbContext : DbContext
    {
        public ClinicDbContext(DbContextOptions<ClinicDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Clinician> Clinicians { get; set; }
        public DbSet<Receptionist> Receptionists { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Equipment> Equipments { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Encounter> Encounters { get; set; }
        public DbSet<MedicalHistoryEntry> MedicalHistoryEntries { get; set; }
        public DbSet<Surgery> Surgeries { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<LabResult> LabResults { get; set; }
        public DbSet<Insurance> Insurances { get; set; }
        public DbSet<Billing> Billings { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        
        // AI Assistant DbSets
        public DbSet<MedicalDocument> MedicalDocuments { get; set; }
        public DbSet<MedicalEntity> MedicalEntities { get; set; }
        public DbSet<CDSSRecommendation> CDSSRecommendations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===== USER RELATIONSHIPS =====

            // User - Patient (One-to-One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Patient)
                .WithOne(p => p.User)
                .HasForeignKey<Patient>(p => p.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - Clinician (One-to-One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Clinician)
                .WithOne(c => c.User)
                .HasForeignKey<Clinician>(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // User - Receptionist (One-to-One)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Receptionist)
                .WithOne(r => r.User)
                .HasForeignKey<Receptionist>(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===== PATIENT RELATIONSHIPS =====

            // Patient - Primary Clinician
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.PrimaryClinician)
                .WithMany()
                .HasForeignKey(p => p.PrimaryClinicianId)
                .OnDelete(DeleteBehavior.SetNull);

            // Patient - Insurance
            modelBuilder.Entity<Patient>()
                .HasOne(p => p.Insurance)
                .WithMany()
                .HasForeignKey(p => p.InsuranceId)
                .OnDelete(DeleteBehavior.SetNull);
            
            // Insurance - Patient (inverse relationship)
            modelBuilder.Entity<Insurance>()
                .HasOne(i => i.Patient)
                .WithMany()
                .HasForeignKey(i => i.PatientId)
                .OnDelete(DeleteBehavior.Restrict); // Changed from Cascade to Restrict

            // Patient - Appointments
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Appointments)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient - Encounters
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Encounters)
                .WithOne(e => e.Patient)
                .HasForeignKey(e => e.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient - Medical History
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.MedicalHistory)
                .WithOne(mh => mh.Patient)
                .HasForeignKey(mh => mh.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // Patient - Surgeries
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Surgeries)
                .WithOne(s => s.Patient)
                .HasForeignKey(s => s.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient - Prescriptions
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.Prescriptions)
                .WithOne(pr => pr.Patient)
                .HasForeignKey(pr => pr.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient - Lab Results
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.LabResults)
                .WithOne(lr => lr.Patient)
                .HasForeignKey(lr => lr.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Patient - Billing
            modelBuilder.Entity<Patient>()
                .HasMany(p => p.BillingRecords)
                .WithOne(b => b.Patient)
                .HasForeignKey(b => b.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===== CLINICIAN RELATIONSHIPS =====

            // Clinician - Appointments
            modelBuilder.Entity<Clinician>()
                .HasMany(c => c.Appointments)
                .WithOne(a => a.Clinician)
                .HasForeignKey(a => a.ClinicianId)
                .OnDelete(DeleteBehavior.Restrict);

            // Clinician - Encounters
            modelBuilder.Entity<Clinician>()
                .HasMany(c => c.Encounters)
                .WithOne(e => e.Clinician)
                .HasForeignKey(e => e.ClinicianId)
                .OnDelete(DeleteBehavior.Restrict);

            // Clinician - Surgeries
            modelBuilder.Entity<Clinician>()
                .HasMany(c => c.SurgeriesPerformed)
                .WithOne(s => s.Surgeon)
                .HasForeignKey(s => s.SurgeonId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===== ROOM & EQUIPMENT RELATIONSHIPS =====

            // Room - Equipment
            modelBuilder.Entity<Room>()
                .HasMany(r => r.Equipments)
                .WithOne(e => e.Room)
                .HasForeignKey(e => e.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            // Room - Surgeries
            modelBuilder.Entity<Room>()
                .HasMany(r => r.Surgeries)
                .WithOne(s => s.Room)
                .HasForeignKey(s => s.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            // ===== APPOINTMENT & ENCOUNTER RELATIONSHIPS =====

            // Appointment - Encounter (One-to-One)
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Encounter)
                .WithOne(e => e.Appointment)
                .HasForeignKey<Encounter>(e => e.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // Appointment - Room
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Room)
                .WithMany()
                .HasForeignKey(a => a.RoomId)
                .OnDelete(DeleteBehavior.SetNull);

            // ===== PRESCRIPTION RELATIONSHIPS =====

            // Prescription - Clinician
            modelBuilder.Entity<Prescription>()
                .HasOne(pr => pr.PrescribedBy)
                .WithMany()
                .HasForeignKey(pr => pr.PrescribedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Prescription - Encounter
            modelBuilder.Entity<Prescription>()
                .HasOne(pr => pr.Encounter)
                .WithMany()
                .HasForeignKey(pr => pr.EncounterId)
                .OnDelete(DeleteBehavior.SetNull);

            // ===== LAB RESULT RELATIONSHIPS =====

            // Lab Result - Encounter
            modelBuilder.Entity<LabResult>()
                .HasOne(lr => lr.Encounter)
                .WithMany()
                .HasForeignKey(lr => lr.EncounterId)
                .OnDelete(DeleteBehavior.SetNull);

            // ===== BILLING RELATIONSHIPS =====

            // Billing - Encounter
            modelBuilder.Entity<Billing>()
                .HasOne(b => b.Encounter)
                .WithMany()
                .HasForeignKey(b => b.EncounterId)
                .OnDelete(DeleteBehavior.SetNull);

            // Billing - Surgery
            modelBuilder.Entity<Billing>()
                .HasOne(b => b.Surgery)
                .WithMany()
                .HasForeignKey(b => b.SurgeryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Billing - Insurance
            modelBuilder.Entity<Billing>()
                .HasOne(b => b.Insurance)
                .WithMany()
                .HasForeignKey(b => b.InsuranceId)
                .OnDelete(DeleteBehavior.SetNull);

            // ===== AUDIT LOG RELATIONSHIPS =====

            modelBuilder.Entity<AuditLog>()
                .HasOne(al => al.User)
                .WithMany()
                .HasForeignKey(al => al.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ===== INDEXES =====

            // User indexes
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Patient indexes
            modelBuilder.Entity<Patient>()
                .HasIndex(p => p.MRN)
                .IsUnique();

            // Room indexes
            modelBuilder.Entity<Room>()
                .HasIndex(r => r.RoomNumber)
                .IsUnique();

            // Equipment indexes
            modelBuilder.Entity<Equipment>()
                .HasIndex(e => e.SerialNumber)
                .IsUnique();

            // Billing indexes
            modelBuilder.Entity<Billing>()
                .HasIndex(b => b.InvoiceNumber)
                .IsUnique();

            // Appointment indexes
            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.PatientId, a.StartTime });

            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.ClinicianId, a.StartTime });

            // Encounter indexes
            modelBuilder.Entity<Encounter>()
                .HasIndex(e => new { e.PatientId, e.EncounterDate });

            // Medical History indexes
            modelBuilder.Entity<MedicalHistoryEntry>()
                .HasIndex(mh => new { mh.PatientId, mh.EntryType });

            // Surgery indexes
            modelBuilder.Entity<Surgery>()
                .HasIndex(s => new { s.PatientId, s.ScheduledDate });

            // ===== QUERY FILTERS (Soft Delete) =====

            modelBuilder.Entity<Appointment>()
                .HasQueryFilter(a => !a.IsDeleted);

            modelBuilder.Entity<Encounter>()
                .HasQueryFilter(e => !e.IsDeleted);

            modelBuilder.Entity<MedicalHistoryEntry>()
                .HasQueryFilter(mh => !mh.IsDeleted);

            modelBuilder.Entity<Surgery>()
                .HasQueryFilter(s => !s.IsDeleted);

            modelBuilder.Entity<Prescription>()
                .HasQueryFilter(p => !p.IsDeleted);

            modelBuilder.Entity<LabResult>()
                .HasQueryFilter(lr => !lr.IsDeleted);

            modelBuilder.Entity<Billing>()
                .HasQueryFilter(b => !b.IsDeleted);
        }
    }
}