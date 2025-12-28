namespace ClinicSystemBackend.Data.DTOs.Appointment
{
    public class UpdateAppointmentStatusDto
    {
        public string Status { get; set; }
        public string CancellationReason { get; set; }
    }
}
