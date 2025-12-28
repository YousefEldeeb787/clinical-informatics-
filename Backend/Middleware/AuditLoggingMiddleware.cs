using ClinicSystemBackend.Data;
using ClinicSystemBackend.Models;
using System.Security.Claims;

namespace ClinicSystemBackend.Middleware
{
    public class AuditLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, ClinicDbContext dbContext)
        {
            // Only log POST, PUT, PATCH, DELETE
            if (context.Request.Method != "GET" && context.Request.Method != "OPTIONS")
            {
                var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    var auditLog = new AuditLog
                    {
                        UserId = userId,
                        Action = context.Request.Method,
                        EntityName = context.Request.Path.Value.Split('/')[2], // Extract entity from path
                        EntityId = 0, // This would need to be extracted from response
                        IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                        Timestamp = DateTime.UtcNow
                    };

                    dbContext.AuditLogs.Add(auditLog);
                    await dbContext.SaveChangesAsync();
                }
            }

            await _next(context);
        }
    }
}