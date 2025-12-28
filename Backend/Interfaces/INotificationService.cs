namespace ClinicSystemBackend.Interfaces
{
    public interface INotificationService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendSmsAsync(string phoneNumber, string message);
        Task SendAppointmentReminderAsync(int appointmentId);
        Task SendSurgeryReminderAsync(int surgeryId);
        Task SendPasswordResetEmailAsync(string email, string resetToken);
        Task SendWelcomeEmailAsync(string email, string firstName);
    }
}
