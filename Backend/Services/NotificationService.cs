using ClinicSystemBackend.Data;
using ClinicSystemBackend.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;

namespace ClinicSystemBackend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ClinicDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<NotificationService> _logger;

        public NotificationService(ClinicDbContext context, IConfiguration configuration, ILogger<NotificationService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                var port = int.Parse(smtpSettings["Port"] ?? "587");
                var username = smtpSettings["Username"];
                var password = smtpSettings["Password"];
                var fromEmail = smtpSettings["FromEmail"];

                if (string.IsNullOrEmpty(host))
                {
                    _logger.LogWarning("SMTP not configured. Email would be sent to {To}: {Subject}", to, subject);
                    return;
                }

                using var client = new SmtpClient(host, port)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(username, password)
                };

                var message = new MailMessage(fromEmail, to, subject, body)
                {
                    IsBodyHtml = true
                };

                await client.SendMailAsync(message);
                _logger.LogInformation("Email sent to {To} with subject: {Subject}", to, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To}", to);
            }
        }

        public async Task SendSmsAsync(string phoneNumber, string message)
        {
            // TODO: Integrate with Twilio, AWS SNS, or other SMS provider
            _logger.LogInformation("SMS would be sent to {PhoneNumber}: {Message}", phoneNumber, message);
            await Task.CompletedTask;
        }

        public async Task SendAppointmentReminderAsync(int appointmentId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Include(a => a.Clinician).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null) return;

            var subject = "Appointment Reminder - Surgery Clinic";
            var body = $@"
                <h3>Appointment Reminder</h3>
                <p>Dear {appointment.Patient.User.FirstName},</p>
                <p>This is a reminder for your upcoming appointment:</p>
                <ul>
                    <li><strong>Date:</strong> {appointment.StartTime:MMMM dd, yyyy}</li>
                    <li><strong>Time:</strong> {appointment.StartTime:hh:mm tt}</li>
                    <li><strong>Doctor:</strong> Dr. {appointment.Clinician.User.LastName}</li>
                    <li><strong>Reason:</strong> {appointment.Reason}</li>
                </ul>
                <p>Please arrive 15 minutes early.</p>
                <p>If you need to reschedule, please contact us as soon as possible.</p>
            ";

            await SendEmailAsync(appointment.Patient.User.Email, subject, body);

            if (!string.IsNullOrEmpty(appointment.Patient.User.Phone))
            {
                var smsMessage = $"Reminder: Your appointment with Dr. {appointment.Clinician.User.LastName} is on {appointment.StartTime:MMM dd} at {appointment.StartTime:hh:mm tt}";
                await SendSmsAsync(appointment.Patient.User.Phone, smsMessage);
            }
        }

        public async Task SendSurgeryReminderAsync(int surgeryId)
        {
            var surgery = await _context.Surgeries
                .Include(s => s.Patient).ThenInclude(p => p.User)
                .Include(s => s.Surgeon).ThenInclude(c => c.User)
                .FirstOrDefaultAsync(s => s.Id == surgeryId);

            if (surgery == null) return;

            var subject = "Surgery Reminder - Important";
            var body = $@"
                <h3>Surgery Reminder</h3>
                <p>Dear {surgery.Patient.User.FirstName},</p>
                <p>This is a reminder for your scheduled surgery:</p>
                <ul>
                    <li><strong>Procedure:</strong> {surgery.SurgeryName}</li>
                    <li><strong>Date:</strong> {surgery.ScheduledDate:MMMM dd, yyyy}</li>
                    <li><strong>Time:</strong> {surgery.ScheduledDate:hh:mm tt}</li>
                    <li><strong>Surgeon:</strong> Dr. {surgery.Surgeon.User.LastName}</li>
                </ul>
                <p><strong>Pre-Op Instructions:</strong></p>
                <p>{surgery.PreOpNotes ?? "Please follow the pre-operative instructions provided to you."}</p>
                <p style='color: red;'><strong>Important:</strong> Do not eat or drink anything after midnight before your surgery.</p>
            ";

            await SendEmailAsync(surgery.Patient.User.Email, subject, body);
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var resetLink = $"{_configuration["AppUrl"]}/reset-password?token={resetToken}";
            var subject = "Password Reset Request";
            var body = $@"
                <h3>Password Reset</h3>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <p><a href='{resetLink}' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            ";

            await SendEmailAsync(email, subject, body);
        }

        public async Task SendWelcomeEmailAsync(string email, string firstName)
        {
            var subject = "Welcome to Surgery Clinic";
            var body = $@"
                <h3>Welcome to Our Clinic!</h3>
                <p>Dear {firstName},</p>
                <p>Thank you for registering with Surgery Clinic. We're excited to have you as a patient.</p>
                <p>You can now:</p>
                <ul>
                    <li>Book appointments online</li>
                    <li>View your medical history</li>
                    <li>Access lab results</li>
                    <li>Manage prescriptions</li>
                </ul>
                <p>If you have any questions, please don't hesitate to contact us.</p>
                <p>Best regards,<br/>Surgery Clinic Team</p>
            ";

            await SendEmailAsync(email, subject, body);
        }
    }
}
