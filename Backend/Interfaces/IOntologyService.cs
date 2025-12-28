namespace ClinicSystemBackend.Interfaces
{
    public class OntologyMapping
    {
        public string Code { get; set; } = string.Empty;
        public string System { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double ConfidenceScore { get; set; }
    }

    public interface IOntologyService
    {
        Task<OntologyMapping?> MapToSnomedCT(string symptom);
        Task<OntologyMapping?> MapToICD10(string diagnosis);
        Task<OntologyMapping?> MapToUMLS(string procedure);
        Task<List<OntologyMapping>> SearchOntology(string term, string ontologyType);
    }
}
