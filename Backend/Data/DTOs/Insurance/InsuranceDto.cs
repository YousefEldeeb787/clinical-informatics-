namespace ClinicSystemBackend.Data.DTOs.Insurance
{
    public class InsuranceDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string ProviderName { get; set; }
        public string PolicyNumber { get; set; }
        public string GroupNumber { get; set; }
        public string PolicyHolderName { get; set; }
        public string PolicyHolderRelation { get; set; }
        public DateTime? CoverageStartDate { get; set; }
        public DateTime? CoverageEndDate { get; set; }
        public string ContactPhone { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsActive { get; set; }
    }
}
