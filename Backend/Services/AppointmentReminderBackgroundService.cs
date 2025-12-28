using ClinicSystemBackend.Data;
using ClinicSystemBackend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Services
{
    public class AppointmentReminderBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<AppointmentReminderBackgroundService> _logger;

        public AppointmentReminderBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<AppointmentReminderBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Appointment Reminder Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await SendReminders();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while sending appointment reminders");
                }

                // Run every hour
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }

        private async Task SendReminders()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ClinicDbContext>();
            var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

            var tomorrow = DateTime.UtcNow.AddDays(1);
            var dayAfterTomorrow = DateTime.UtcNow.AddDays(2);

            // Get appointments for tomorrow
            var upcomingAppointments = await context.Appointments
                .Where(a => a.StartTime.Date == tomorrow.Date && a.Status == "Scheduled")
                .ToListAsync();

            foreach (var appointment in upcomingAppointments)
            {
                try
                {
                    await notificationService.SendAppointmentReminderAsync(appointment.Id);
                    _logger.LogInformation("Reminder sent for appointment ID: {AppointmentId}", appointment.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send reminder for appointment ID: {AppointmentId}", appointment.Id);
                }
            }

            // Get surgeries for next 3 days
            var upcomingSurgeries = await context.Surgeries
                .Where(s => s.ScheduledDate.Date >= tomorrow.Date && 
                           s.ScheduledDate.Date <= dayAfterTomorrow.Date && 
                           s.Status == "Scheduled")
                .ToListAsync();

            foreach (var surgery in upcomingSurgeries)
            {
                try
                {
                    await notificationService.SendSurgeryReminderAsync(surgery.Id);
                    _logger.LogInformation("Surgery reminder sent for ID: {SurgeryId}", surgery.Id);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to send surgery reminder for ID: {SurgeryId}", surgery.Id);
                }
            }
        }
    }
}
