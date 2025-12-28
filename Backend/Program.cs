using ClinicSystemBackend.Authorization;
using ClinicSystemBackend.Configuration;
using ClinicSystemBackend.Data;
using ClinicSystemBackend.Helpers;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Middleware;
using ClinicSystemBackend.Repositories;
using ClinicSystemBackend.Services;
using ClinicSystemBackend.Validators;

using FluentValidation;
using FluentValidation.AspNetCore;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Explicit URL Configuration
// Configure Kestrel to use specific ports and prevent conflicts
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenLocalhost(5000); // HTTP
    serverOptions.ListenLocalhost(5001, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});

// Alternative: Use URLs from configuration or default
// builder.WebHost.UseUrls("http://localhost:5000", "https://localhost:5001");
#endregion

#region Database Configuration
builder.Services.AddDbContext<ClinicDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));
#endregion

#region Configuration Settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.Configure<FileStorageSettings>(builder.Configuration.GetSection("FileStorage"));
#endregion

#region JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(secretKey)
        };
    });
#endregion

#region Authorization Policies & Permissions
// Register permission handler
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();

builder.Services.AddAuthorization(options =>
{
    // ==================== PATIENT PERMISSIONS ====================
    // Register with both the constant value and simple name for backward compatibility
    options.AddPolicy(RolePermissions.ViewOwnPatientDetails, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnPatientDetails)));
    options.AddPolicy(RolePermissions.UpdateOwnPersonalInfo, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateOwnPersonalInfo)));

    // ==================== PATIENT MANAGEMENT PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewPatients, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPatients)));
    options.AddPolicy("ViewPatients", // Simple name for controllers
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPatients)));
        
    options.AddPolicy(RolePermissions.ViewPatientDetails, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPatientDetails)));
    options.AddPolicy("ViewPatientDetails", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPatientDetails)));
        
    options.AddPolicy(RolePermissions.CreatePatient, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreatePatient)));
    options.AddPolicy("CreatePatient", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreatePatient)));
        
    options.AddPolicy(RolePermissions.UpdatePatient, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatient)));
    options.AddPolicy("UpdatePatient", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatient)));
        
    options.AddPolicy(RolePermissions.UpdatePatientPersonalInfo, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatientPersonalInfo)));
    options.AddPolicy("UpdatePatientPersonalInfo", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatientPersonalInfo)));
        
    options.AddPolicy(RolePermissions.UpdatePatientInsuranceInfo, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatientInsuranceInfo)));
    options.AddPolicy("UpdatePatientInsuranceInfo", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdatePatientInsuranceInfo)));
        
    options.AddPolicy(RolePermissions.DeletePatient, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.DeletePatient)));
    options.AddPolicy("DeletePatient", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.DeletePatient)));

    // ==================== MEDICAL HISTORY PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnMedicalHistory, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnMedicalHistory)));
    options.AddPolicy(RolePermissions.ViewMedicalHistory, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewMedicalHistory)));
    options.AddPolicy("ViewMedicalHistory", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewMedicalHistory)));
    options.AddPolicy(RolePermissions.CreateMedicalHistory, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateMedicalHistory)));
    options.AddPolicy("CreateMedicalHistory", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateMedicalHistory)));
    options.AddPolicy(RolePermissions.UpdateMedicalHistory, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateMedicalHistory)));
    options.AddPolicy("UpdateMedicalHistory", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateMedicalHistory)));

    // ==================== APPOINTMENTS PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnAppointments, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnAppointments)));
    options.AddPolicy(RolePermissions.ViewAppointments, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewAppointments)));
    options.AddPolicy("ViewAppointments", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewAppointments)));
    options.AddPolicy(RolePermissions.ViewAppointmentsSummary, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewAppointmentsSummary)));
    options.AddPolicy(RolePermissions.CreateAppointment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateAppointment)));
    options.AddPolicy("CreateAppointment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateAppointment)));
    options.AddPolicy(RolePermissions.UpdateAppointment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateAppointment)));
    options.AddPolicy("UpdateAppointment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateAppointment)));
    options.AddPolicy(RolePermissions.CancelAppointment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CancelAppointment)));
    options.AddPolicy("CancelAppointment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CancelAppointment)));
    options.AddPolicy(RolePermissions.CheckInAppointment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CheckInAppointment)));
    options.AddPolicy("CheckInAppointment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CheckInAppointment)));

    // ==================== PRESCRIPTIONS PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnPrescriptions, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnPrescriptions)));
    options.AddPolicy(RolePermissions.ViewPrescriptions, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPrescriptions)));
    options.AddPolicy("ViewPrescriptions", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewPrescriptions)));
    options.AddPolicy(RolePermissions.CreatePrescription, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreatePrescription)));
    options.AddPolicy("CreatePrescription", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreatePrescription)));
    options.AddPolicy(RolePermissions.ApprovePrescriptionRefill, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ApprovePrescriptionRefill)));
    options.AddPolicy("ApprovePrescriptionRefill", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ApprovePrescriptionRefill)));
    options.AddPolicy(RolePermissions.RequestPrescriptionRefill, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.RequestPrescriptionRefill)));

    // ==================== SURGERIES PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnSurgeries, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnSurgeries)));
    options.AddPolicy(RolePermissions.ViewSurgeries, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewSurgeries)));
    options.AddPolicy("ViewSurgeries", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewSurgeries)));
    options.AddPolicy(RolePermissions.ViewSurgeriesSummary, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewSurgeriesSummary)));
    options.AddPolicy(RolePermissions.CreateSurgery, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateSurgery)));
    options.AddPolicy("CreateSurgery", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateSurgery)));
    options.AddPolicy(RolePermissions.UpdateSurgery, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateSurgery)));
    options.AddPolicy("UpdateSurgery", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.UpdateSurgery)));
    options.AddPolicy(RolePermissions.PerformSurgery, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.PerformSurgery)));
    options.AddPolicy("PerformSurgery", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.PerformSurgery)));

    // ==================== LAB RESULTS PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnLabResults, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnLabResults)));
    options.AddPolicy(RolePermissions.ViewLabResults, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewLabResults)));
    options.AddPolicy("ViewLabResults", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewLabResults)));
    options.AddPolicy(RolePermissions.CreateLabResults, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateLabResults)));
    options.AddPolicy("CreateLabResults", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateLabResults)));

    // ==================== BILLING PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ViewOwnBilling, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOwnBilling)));
    options.AddPolicy(RolePermissions.ViewBilling, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewBilling)));
    options.AddPolicy("ViewBilling", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewBilling)));
    options.AddPolicy(RolePermissions.ViewBillingSummary, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewBillingSummary)));
    options.AddPolicy(RolePermissions.CreateInvoice, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateInvoice)));
    options.AddPolicy("CreateInvoice", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.CreateInvoice)));
    options.AddPolicy(RolePermissions.ProcessPayment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ProcessPayment)));
    options.AddPolicy("ProcessPayment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ProcessPayment)));
    options.AddPolicy(RolePermissions.ConfigureBillingPrices, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ConfigureBillingPrices)));
    options.AddPolicy(RolePermissions.ViewFinancialReports, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewFinancialReports)));
    options.AddPolicy("ViewFinancialReports", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewFinancialReports)));

    // ==================== ROOMS & EQUIPMENT PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ManageRooms, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageRooms)));
    options.AddPolicy("ManageRooms", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageRooms)));
    options.AddPolicy(RolePermissions.ViewRooms, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewRooms)));
    options.AddPolicy("ViewRooms", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewRooms)));
    options.AddPolicy(RolePermissions.ManageEquipment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageEquipment)));
    options.AddPolicy("ManageEquipment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageEquipment)));
    options.AddPolicy(RolePermissions.ViewEquipment, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewEquipment)));
    options.AddPolicy("ViewEquipment", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewEquipment)));

    // ==================== SYSTEM ADMINISTRATION PERMISSIONS ====================
    options.AddPolicy(RolePermissions.ManageUsers, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageUsers)));
    options.AddPolicy("ManageUsers", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageUsers)));
    options.AddPolicy(RolePermissions.ViewUsers, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewUsers)));
    options.AddPolicy("ViewUsers", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewUsers)));
    options.AddPolicy(RolePermissions.ViewUserActivity, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewUserActivity)));
    options.AddPolicy(RolePermissions.ResetPasswords, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ResetPasswords)));
    options.AddPolicy(RolePermissions.ManageRoles, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageRoles)));

    options.AddPolicy(RolePermissions.ViewAuditLogs, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewAuditLogs)));
    options.AddPolicy(RolePermissions.ExportAuditLogs, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ExportAuditLogs)));

    options.AddPolicy(RolePermissions.ViewReports, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewReports)));
    options.AddPolicy("ViewReports", 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewReports)));
    options.AddPolicy(RolePermissions.ViewSystemReports, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewSystemReports)));
    options.AddPolicy(RolePermissions.ViewOperationalReports, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewOperationalReports)));
    options.AddPolicy(RolePermissions.ExportReports, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ExportReports)));

    options.AddPolicy(RolePermissions.ConfigureSystem, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ConfigureSystem)));
    options.AddPolicy(RolePermissions.ConfigureSecurity, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ConfigureSecurity)));
    options.AddPolicy(RolePermissions.ConfigureEmailSettings, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ConfigureEmailSettings)));
    options.AddPolicy(RolePermissions.ManageBackups, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageBackups)));
    options.AddPolicy(RolePermissions.ViewSystemHealth, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ViewSystemHealth)));
    options.AddPolicy(RolePermissions.ManageMaintenanceMode, 
        policy => policy.Requirements.Add(new PermissionRequirement(RolePermissions.ManageMaintenanceMode)));

    // Legacy role-based policies (kept for compatibility)
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ClinicianOnly", policy => policy.RequireRole("Clinician", "Admin"));
    options.AddPolicy("ReceptionistOnly", policy => policy.RequireRole("Receptionist", "Admin"));
    options.AddPolicy("PatientAccess", policy => policy.RequireRole("Patient", "Clinician", "Admin"));
});
#endregion

#region CORS
var corsOrigins = builder.Configuration
    .GetSection("CorsOrigins")
    .Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
#endregion

#region Core Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

// Register all validators
builder.Services.AddValidatorsFromAssemblyContaining<CreateAppointmentValidator>();
#endregion

#region Dependency Injection

// Helpers
builder.Services.AddSingleton<JwtHelper>();

// Seeder
builder.Services.AddScoped<DbSeeder>();

// Generic Repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));

// Specific Repositories
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<ISurgeryService, SurgeryService>();
builder.Services.AddScoped<IEncounterService, EncounterService>();
builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
builder.Services.AddScoped<ILabResultService, LabResultService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
builder.Services.AddScoped<IReportingService, ReportingService>();

// AI Assistant Services
builder.Services.AddScoped<IOcrService, OcrService>();
builder.Services.AddScoped<INlpService, NlpService>();
builder.Services.AddScoped<IOntologyService, OntologyService>();
builder.Services.AddScoped<ICDSSService, CDSSService>();
builder.Services.AddHttpClient(); // For API calls in AI services

// Background Services
builder.Services.AddHostedService<AppointmentReminderBackgroundService>();

#endregion

#region Swagger Configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Surgery Clinic API",
        Version = "v1",
        Description = "API for Surgery Clinic Management System",
        Contact = new OpenApiContact
        {
            Name = "Surgery Clinic",
            Email = "contact@surgeryclinic.com"
        }
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter: Bearer {your JWT token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
#endregion

#region Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
#endregion

var app = builder.Build();

#region Middleware Pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ErrorHandlingMiddleware>();
app.UseMiddleware<AuditLoggingMiddleware>();

//app.UseHttpsRedirection();

// Serve static files from uploads folder
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint
app.MapHealthChecks("/health");

#endregion

#region Database Seeding
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
    await seeder.SeedAsync();
}
#endregion

app.Run();
