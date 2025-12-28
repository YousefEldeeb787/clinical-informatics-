using System;

namespace ClinicSystemBackend.Data.DTOs.Appointment
{
    public class UpdateAppointmentDto
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Reason { get; set; }
        public int? RoomId { get; set; }
        public string Notes { get; set; }
    }
}
