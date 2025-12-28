using ClinicSystemBackend.Data.DTOs.Surgery;
using FluentValidation;

namespace ClinicSystemBackend.Validators
{
    public class CreateSurgeryValidator : AbstractValidator<CreateSurgeryDto>
    {
        public CreateSurgeryValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Patient ID is required");

            RuleFor(x => x.SurgeonId)
                .GreaterThan(0)
                .WithMessage("Surgeon ID is required");

            RuleFor(x => x.SurgeryName)
                .NotEmpty()
                .WithMessage("Surgery name is required")
                .MaximumLength(255)
                .WithMessage("Surgery name cannot exceed 255 characters");

            RuleFor(x => x.SurgeryType)
                .NotEmpty()
                .WithMessage("Surgery type is required")
                .Must(BeValidSurgeryType)
                .WithMessage("Invalid surgery type. Must be: Major, Minor, Emergency, or Elective");

            RuleFor(x => x.ScheduledDate)
                .GreaterThan(DateTime.UtcNow)
                .WithMessage("Surgery must be scheduled in the future");
        }

        private bool BeValidSurgeryType(string type)
        {
            var validTypes = new[] { "Major", "Minor", "Emergency", "Elective" };
            return validTypes.Contains(type);
        }
    }

    public class UpdateSurgeryValidator : AbstractValidator<UpdateSurgeryDto>
    {
        public UpdateSurgeryValidator()
        {
            RuleFor(x => x.EstimatedBloodLoss)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Estimated blood loss cannot be negative")
                .When(x => x.EstimatedBloodLoss.HasValue);

            RuleFor(x => x.ActualEndTime)
                .GreaterThan(x => x.ActualStartTime)
                .WithMessage("End time must be after start time")
                .When(x => x.ActualStartTime.HasValue && x.ActualEndTime.HasValue);
        }
    }
}
