using ClinicSystemBackend.Data.DTOs.Billing;
using FluentValidation;

namespace ClinicSystemBackend.Validators
{
    public class CreateBillingValidator : AbstractValidator<CreateBillingDto>
    {
        public CreateBillingValidator()
        {
            RuleFor(x => x.PatientId)
                .GreaterThan(0)
                .WithMessage("Patient ID is required");

            RuleFor(x => x.LineItems)
                .NotEmpty()
                .WithMessage("At least one line item is required");

            RuleFor(x => x.Tax)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Tax cannot be negative");

            RuleFor(x => x.Discount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Discount cannot be negative");
        }
    }

    public class RecordPaymentValidator : AbstractValidator<RecordPaymentDto>
    {
        public RecordPaymentValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThan(0)
                .WithMessage("Payment amount must be greater than 0");

            RuleFor(x => x.PaymentMethod)
                .NotEmpty()
                .WithMessage("Payment method is required")
                .Must(BeValidPaymentMethod)
                .WithMessage("Invalid payment method. Must be: Cash, Card, Insurance, Check, BankTransfer, or Other");

            RuleFor(x => x.PaymentDate)
                .NotEmpty()
                .WithMessage("Payment date is required");
        }

        private bool BeValidPaymentMethod(string method)
        {
            var validMethods = new[] { "Cash", "Card", "Insurance", "Check", "BankTransfer", "Other" };
            return validMethods.Contains(method);
        }
    }
}
