using ClinicSystemBackend.Models;

namespace ClinicSystemBackend.Interfaces
{
    public class MedicalEntityDto
    {
        public string EntityType { get; set; } = string.Empty;
        public string EntityText { get; set; } = string.Empty;
        public string? NormalizedText { get; set; }
        public double? ConfidenceScore { get; set; }
        public string? Metadata { get; set; }
    }

    public interface INlpService
    {
        Task<List<MedicalEntityDto>> ExtractMedicalEntitiesAsync(string text);
        Task<Dictionary<string, object>> AnalyzeSymptoms(string text);
        Task<Dictionary<string, object>> ExtractMedications(string text);
        Task<Dictionary<string, object>> ExtractLabValues(string text);
    }
}
