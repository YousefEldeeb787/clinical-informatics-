using ClinicSystemBackend.Data.DTOs.Encounter;
using FluentValidation;

namespace ClinicSystemBackend.Validators
{
    public class CreateEncounterValidator : AbstractValidator<CreateEncounterDto>
    {
        public CreateEncounterValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Patient ID is required");

            RuleFor(x => x.ClinicianId)
                .GreaterThan(0)
                .WithMessage("Clinician ID is required");

            RuleFor(x => x.EncounterType)
                .NotEmpty()
                .WithMessage("Encounter type is required")
                .MaximumLength(50)
                .WithMessage("Encounter type cannot exceed 50 characters");

            RuleFor(x => x.ChiefComplaint)
                .NotEmpty()
                .WithMessage("Chief complaint is required")
                .MaximumLength(500)
                .WithMessage("Chief complaint cannot exceed 500 characters");
        }
    }
}
