using ClinicSystemBackend.Interfaces;

namespace ClinicSystemBackend.Services
{
    /// <summary>
    /// Ontology Mapping Service
    /// Maps medical terms to standardized ontologies: SNOMED CT, ICD-10, UMLS
    /// For production: integrate with UMLS API, SNOMED CT terminology server, or BioPortal
    /// </summary>
    public class OntologyService : IOntologyService
    {
        private readonly ILogger<OntologyService> _logger;
        private readonly HttpClient _httpClient;

        // Mock ontology mappings for demonstration
        private readonly Dictionary<string, OntologyMapping> _snomedMappings = new()
        {
            { "headache", new OntologyMapping { Code = "25064002", System = "SNOMED CT", Description = "Headache (finding)", ConfidenceScore = 0.95 } },
            { "dizziness", new OntologyMapping { Code = "404640003", System = "SNOMED CT", Description = "Dizziness (finding)", ConfidenceScore = 0.93 } },
            { "nausea", new OntologyMapping { Code = "422587007", System = "SNOMED CT", Description = "Nausea (finding)", ConfidenceScore = 0.96 } },
            { "fever", new OntologyMapping { Code = "386661006", System = "SNOMED CT", Description = "Fever (finding)", ConfidenceScore = 0.98 } },
            { "cough", new OntologyMapping { Code = "49727002", System = "SNOMED CT", Description = "Cough (finding)", ConfidenceScore = 0.97 } },
            { "pain", new OntologyMapping { Code = "22253000", System = "SNOMED CT", Description = "Pain (finding)", ConfidenceScore = 0.90 } }
        };

        private readonly Dictionary<string, OntologyMapping> _icd10Mappings = new()
        {
            { "migraine", new OntologyMapping { Code = "G43.909", System = "ICD-10", Description = "Migraine, unspecified, not intractable, without status migrainosus", ConfidenceScore = 0.92 } },
            { "hypertension", new OntologyMapping { Code = "I10", System = "ICD-10", Description = "Essential (primary) hypertension", ConfidenceScore = 0.95 } },
            { "diabetes", new OntologyMapping { Code = "E11.9", System = "ICD-10", Description = "Type 2 diabetes mellitus without complications", ConfidenceScore = 0.90 } },
            { "infection", new OntologyMapping { Code = "A49.9", System = "ICD-10", Description = "Bacterial infection, unspecified", ConfidenceScore = 0.85 } }
        };

        private readonly Dictionary<string, OntologyMapping> _umlsMappings = new()
        {
            { "appendectomy", new OntologyMapping { Code = "C0003611", System = "UMLS", Description = "Appendectomy", ConfidenceScore = 0.96 } },
            { "cholecystectomy", new OntologyMapping { Code = "C0008320", System = "UMLS", Description = "Cholecystectomy", ConfidenceScore = 0.97 } },
            { "hernia repair", new OntologyMapping { Code = "C0019328", System = "UMLS", Description = "Hernia repair", ConfidenceScore = 0.94 } }
        };

        public OntologyService(ILogger<OntologyService> logger, IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task<OntologyMapping?> MapToSnomedCT(string symptom)
        {
            try
            {
                _logger.LogInformation($"Mapping symptom '{symptom}' to SNOMED CT");

                // TODO: In production, call SNOMED CT API
                // Example: https://browser.ihtsdotools.org/snowstorm/snomed-ct/
                
                await Task.Delay(50); // Simulate API call

                var normalizedSymptom = symptom.ToLower().Trim();
                if (_snomedMappings.TryGetValue(normalizedSymptom, out var mapping))
                {
                    return mapping;
                }

                // Return a generic mapping if exact match not found
                return new OntologyMapping
                {
                    Code = "404684003",
                    System = "SNOMED CT",
                    Description = "Clinical finding (finding)",
                    ConfidenceScore = 0.60
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error mapping symptom to SNOMED CT: {symptom}");
                return null;
            }
        }

        public async Task<OntologyMapping?> MapToICD10(string diagnosis)
        {
            try
            {
                _logger.LogInformation($"Mapping diagnosis '{diagnosis}' to ICD-10");

                // TODO: In production, call ICD-10 API
                // Example: https://icd.who.int/icdapi
                
                await Task.Delay(50); // Simulate API call

                var normalizedDiagnosis = diagnosis.ToLower().Trim();
                if (_icd10Mappings.TryGetValue(normalizedDiagnosis, out var mapping))
                {
                    return mapping;
                }

                // Return a generic mapping if exact match not found
                return new OntologyMapping
                {
                    Code = "R69",
                    System = "ICD-10",
                    Description = "Illness, unspecified",
                    ConfidenceScore = 0.50
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error mapping diagnosis to ICD-10: {diagnosis}");
                return null;
            }
        }

        public async Task<OntologyMapping?> MapToUMLS(string procedure)
        {
            try
            {
                _logger.LogInformation($"Mapping procedure '{procedure}' to UMLS");

                // TODO: In production, call UMLS API
                // Requires UMLS license: https://www.nlm.nih.gov/research/umls/
                
                await Task.Delay(50); // Simulate API call

                var normalizedProcedure = procedure.ToLower().Trim();
                if (_umlsMappings.TryGetValue(normalizedProcedure, out var mapping))
                {
                    return mapping;
                }

                // Return a generic mapping if exact match not found
                return new OntologyMapping
                {
                    Code = "C0184661",
                    System = "UMLS",
                    Description = "Procedure",
                    ConfidenceScore = 0.50
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error mapping procedure to UMLS: {procedure}");
                return null;
            }
        }

        public async Task<List<OntologyMapping>> SearchOntology(string term, string ontologyType)
        {
            try
            {
                _logger.LogInformation($"Searching {ontologyType} for term: {term}");

                var results = new List<OntologyMapping>();
                var normalizedTerm = term.ToLower().Trim();

                switch (ontologyType.ToUpper())
                {
                    case "SNOMED":
                    case "SNOMEDCT":
                        results.AddRange(_snomedMappings
                            .Where(m => m.Key.Contains(normalizedTerm) || m.Value.Description.ToLower().Contains(normalizedTerm))
                            .Select(m => m.Value));
                        break;

                    case "ICD10":
                    case "ICD-10":
                        results.AddRange(_icd10Mappings
                            .Where(m => m.Key.Contains(normalizedTerm) || m.Value.Description.ToLower().Contains(normalizedTerm))
                            .Select(m => m.Value));
                        break;

                    case "UMLS":
                        results.AddRange(_umlsMappings
                            .Where(m => m.Key.Contains(normalizedTerm) || m.Value.Description.ToLower().Contains(normalizedTerm))
                            .Select(m => m.Value));
                        break;
                }

                await Task.CompletedTask;
                return results;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching ontology: {ontologyType}");
                return new List<OntologyMapping>();
            }
        }
    }
}
