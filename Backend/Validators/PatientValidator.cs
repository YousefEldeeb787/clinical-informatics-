using ClinicSystemBackend.Data.DTOs.Auth;
using FluentValidation;

namespace ClinicSystemBackend.Validators
{
    public class RegisterPatientDtoValidator : AbstractValidator<RegisterPatientDto>
    {
        public RegisterPatientDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(8)
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least one number");
            RuleFor(x => x.Phone).Matches(@"^\d{3}-\d{4}$").When(x => !string.IsNullOrEmpty(x.Phone))
                .WithMessage("Phone must be in format XXX-XXXX");
            RuleFor(x => x.DateOfBirth).NotEmpty().LessThan(DateTime.Today);
            RuleFor(x => x.Gender).NotEmpty().Must(g => g == "Male" || g == "Female" || g == "Other");
        }
    }
}
