namespace ClinicSystemBackend.Data.DTOs.Billing
{
    public class RecordPaymentDto
    {
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}
