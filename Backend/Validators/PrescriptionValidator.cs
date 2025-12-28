using ClinicSystemBackend.Data.DTOs.Prescription;
using FluentValidation;

namespace ClinicSystemBackend.Validators
{
    public class CreatePrescriptionValidator : AbstractValidator<CreatePrescriptionDto>
    {
        public CreatePrescriptionValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Patient ID is required");

            RuleFor(x => x.MedicationName)
                .NotEmpty()
                .WithMessage("Medication name is required")
                .MaximumLength(200)
                .WithMessage("Medication name cannot exceed 200 characters");

            RuleFor(x => x.Dosage)
                .NotEmpty()
                .WithMessage("Dosage is required")
                .MaximumLength(100)
                .WithMessage("Dosage cannot exceed 100 characters");

            RuleFor(x => x.Frequency)
                .NotEmpty()
                .WithMessage("Frequency is required")
                .MaximumLength(100)
                .WithMessage("Frequency cannot exceed 100 characters");

            RuleFor(x => x.Quantity)
                .GreaterThan(0)
                .WithMessage("Quantity must be greater than 0");

            RuleFor(x => x.Instructions)
                .MaximumLength(1000)
                .WithMessage("Instructions cannot exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Instructions));
        }
    }
}
