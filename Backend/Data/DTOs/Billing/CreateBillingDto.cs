namespace ClinicSystemBackend.Data.DTOs.Billing
{
    public class CreateBillingDto
    {
        public int PatientId { get; set; }
        public int? EncounterId { get; set; }
        public int? SurgeryId { get; set; }
        public List<LineItemDto> LineItems { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public DateTime? DueDate { get; set; }
        public int? InsuranceId { get; set; }
    }
}
