using ClinicSystemBackend.Models;

namespace ClinicSystemBackend.Interfaces
{
    public class CDSSRecommendationDto
    {
        public string RecommendationType { get; set; } = string.Empty;
        public string RecommendationText { get; set; } = string.Empty;
        public string Severity { get; set; } = "Normal";
        public double? ConfidenceScore { get; set; }
        public List<string>? SupportingEvidence { get; set; }
        public List<string>? RulesApplied { get; set; }
    }

    public interface ICDSSService
    {
        Task<List<CDSSRecommendationDto>> GenerateRecommendationsAsync(
            int patientId, 
            List<MedicalEntity> entities, 
            string? additionalContext = null);
        
        Task<List<CDSSRecommendationDto>> AnalyzeLabResultsAsync(
            int patientId, 
            Dictionary<string, object> labValues);
        
        Task<List<CDSSRecommendationDto>> SuggestDiagnosesAsync(
            List<string> symptoms, 
            List<string> medicalHistory);
        
        Task<List<CDSSRecommendationDto>> CheckDrugInteractionsAsync(
            List<string> medications);
    }
}
