namespace ClinicSystemBackend.Data.DTOs.Billing
{
    public class LineItemDto
    {
        public string Description { get; set; }
        public string Code { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
    }
}
