using System;

namespace ClinicSystemBackend.Data.DTOs.Appointment
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public int ClinicianId { get; set; }
        public string ClinicianName { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }
        public string AppointmentType { get; set; }
        public string Reason { get; set; }
        public int? RoomId { get; set; }
        public string RoomNumber { get; set; }
        public string Notes { get; set; }
        public DateTime? CheckedInAt { get; set; }
    }
}
