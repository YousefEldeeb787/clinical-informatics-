using System;

namespace ClinicSystemBackend.Data.DTOs.Appointment
{
    public class CreateAppointmentDto
    {
        public int PatientId { get; set; }
        public int ClinicianId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string AppointmentType { get; set; }
        public string Reason { get; set; }
        public int? RoomId { get; set; }
        public string Notes { get; set; }
    }
}
