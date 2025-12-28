using ClinicSystemBackend.Interfaces;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ClinicSystemBackend.Services
{
    /// <summary>
    /// NLP Service for medical entity extraction
    /// For production: integrate with spaCy (via API), Med7, or Azure Text Analytics for Health
    /// This is a mock implementation demonstrating the structure
    /// </summary>
    public class NlpService : INlpService
    {
        private readonly ILogger<NlpService> _logger;
        private readonly IConfiguration _configuration;

        // Medical terms dictionaries for pattern matching
        private readonly Dictionary<string, string> _symptomPatterns = new()
        {
            { "headache", "Symptom" },
            { "dizziness", "Symptom" },
            { "nausea", "Symptom" },
            { "fever", "Symptom" },
            { "pain", "Symptom" },
            { "cough", "Symptom" },
            { "fatigue", "Symptom" },
            { "shortness of breath", "Symptom" }
        };

        private readonly Dictionary<string, string> _medicationPatterns = new()
        {
            { "sumatriptan", "Medication" },
            { "lisinopril", "Medication" },
            { "ibuprofen", "Medication" },
            { "aspirin", "Medication" },
            { "metformin", "Medication" },
            { "amoxicillin", "Medication" }
        };

        private readonly Dictionary<string, string> _diagnosisPatterns = new()
        {
            { "migraine", "Diagnosis" },
            { "hypertension", "Diagnosis" },
            { "diabetes", "Diagnosis" },
            { "infection", "Diagnosis" }
        };

        public NlpService(ILogger<NlpService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<List<MedicalEntityDto>> ExtractMedicalEntitiesAsync(string text)
        {
            try
            {
                _logger.LogInformation("Starting medical entity extraction");

                var entities = new List<MedicalEntityDto>();

                // TODO: In production, call spaCy API or Azure Text Analytics for Health
                // For now, use pattern matching

                await Task.Delay(100); // Simulate API call

                // Extract symptoms
                entities.AddRange(ExtractEntitiesByPattern(text, _symptomPatterns));

                // Extract medications with dosages
                entities.AddRange(await ExtractMedicationsWithDosageAsync(text));

                // Extract diagnoses
                entities.AddRange(ExtractEntitiesByPattern(text, _diagnosisPatterns));

                // Extract lab values
                entities.AddRange(await ExtractLabValuesAsync(text));

                // Extract vital signs
                entities.AddRange(ExtractVitalSigns(text));

                _logger.LogInformation($"Extracted {entities.Count} medical entities");

                return entities;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error extracting medical entities");
                throw;
            }
        }

        public async Task<Dictionary<string, object>> AnalyzeSymptoms(string text)
        {
            var symptoms = new List<string>();
            var result = new Dictionary<string, object>();

            foreach (var pattern in _symptomPatterns)
            {
                if (text.ToLower().Contains(pattern.Key))
                {
                    symptoms.Add(pattern.Key);
                }
            }

            result["symptoms"] = symptoms;
            result["count"] = symptoms.Count;
            result["severity"] = symptoms.Count > 3 ? "High" : symptoms.Count > 1 ? "Moderate" : "Low";

            await Task.CompletedTask;
            return result;
        }

        public async Task<Dictionary<string, object>> ExtractMedications(string text)
        {
            var medications = await ExtractMedicationsWithDosageAsync(text);
            
            var result = new Dictionary<string, object>
            {
                ["medications"] = medications,
                ["count"] = medications.Count
            };

            return result;
        }

        public async Task<Dictionary<string, object>> ExtractLabValues(string text)
        {
            var labValues = await ExtractLabValuesAsync(text);
            
            var result = new Dictionary<string, object>
            {
                ["labValues"] = labValues,
                ["count"] = labValues.Count
            };

            return result;
        }

        private List<MedicalEntityDto> ExtractEntitiesByPattern(
            string text, 
            Dictionary<string, string> patterns)
        {
            var entities = new List<MedicalEntityDto>();
            text = text.ToLower();

            foreach (var pattern in patterns)
            {
                if (text.Contains(pattern.Key))
                {
                    entities.Add(new MedicalEntityDto
                    {
                        EntityType = pattern.Value,
                        EntityText = pattern.Key,
                        NormalizedText = pattern.Key.ToUpper(),
                        ConfidenceScore = 0.85
                    });
                }
            }

            return entities;
        }

        private async Task<List<MedicalEntityDto>> ExtractMedicationsWithDosageAsync(string text)
        {
            var medications = new List<MedicalEntityDto>();

            // Pattern: Medication name followed by dosage
            var medicationPattern = @"(\w+)\s+(\d+\s*mg)";
            var matches = Regex.Matches(text, medicationPattern, RegexOptions.IgnoreCase);

            foreach (Match match in matches)
            {
                var medName = match.Groups[1].Value;
                var dosage = match.Groups[2].Value;

                if (_medicationPatterns.ContainsKey(medName.ToLower()))
                {
                    medications.Add(new MedicalEntityDto
                    {
                        EntityType = "Medication",
                        EntityText = $"{medName} {dosage}",
                        NormalizedText = medName.ToUpper(),
                        ConfidenceScore = 0.90,
                        Metadata = JsonSerializer.Serialize(new { dosage = dosage })
                    });
                }
            }

            await Task.CompletedTask;
            return medications;
        }

        private async Task<List<MedicalEntityDto>> ExtractLabValuesAsync(string text)
        {
            var labValues = new List<MedicalEntityDto>();

            // Pattern: Lab name: value unit
            var labPatterns = new[]
            {
                @"Blood\s+Glucose:\s*(\d+\.?\d*)\s*mg/dL",
                @"Hemoglobin:\s*(\d+\.?\d*)\s*g/dL",
                @"WBC\s+Count:\s*(\d+,?\d*)\s*/µL"
            };

            foreach (var pattern in labPatterns)
            {
                var match = Regex.Match(text, pattern, RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    labValues.Add(new MedicalEntityDto
                    {
                        EntityType = "LabValue",
                        EntityText = match.Value,
                        ConfidenceScore = 0.95,
                        Metadata = JsonSerializer.Serialize(new { value = match.Groups[1].Value })
                    });
                }
            }

            await Task.CompletedTask;
            return labValues;
        }

        private List<MedicalEntityDto> ExtractVitalSigns(string text)
        {
            var vitalSigns = new List<MedicalEntityDto>();

            // Blood Pressure
            var bpMatch = Regex.Match(text, @"Blood\s+Pressure:\s*(\d+/\d+)\s*mmHg", RegexOptions.IgnoreCase);
            if (bpMatch.Success)
            {
                vitalSigns.Add(new MedicalEntityDto
                {
                    EntityType = "VitalSign",
                    EntityText = $"Blood Pressure: {bpMatch.Groups[1].Value} mmHg",
                    NormalizedText = "BLOOD_PRESSURE",
                    ConfidenceScore = 0.95,
                    Metadata = JsonSerializer.Serialize(new { type = "blood_pressure", value = bpMatch.Groups[1].Value })
                });
            }

            // Heart Rate
            var hrMatch = Regex.Match(text, @"Heart\s+Rate:\s*(\d+)\s*bpm", RegexOptions.IgnoreCase);
            if (hrMatch.Success)
            {
                vitalSigns.Add(new MedicalEntityDto
                {
                    EntityType = "VitalSign",
                    EntityText = $"Heart Rate: {hrMatch.Groups[1].Value} bpm",
                    NormalizedText = "HEART_RATE",
                    ConfidenceScore = 0.95,
                    Metadata = JsonSerializer.Serialize(new { type = "heart_rate", value = hrMatch.Groups[1].Value })
                });
            }

            // Temperature
            var tempMatch = Regex.Match(text, @"Temperature:\s*(\d+\.?\d*)\s*°C", RegexOptions.IgnoreCase);
            if (tempMatch.Success)
            {
                vitalSigns.Add(new MedicalEntityDto
                {
                    EntityType = "VitalSign",
                    EntityText = $"Temperature: {tempMatch.Groups[1].Value}°C",
                    NormalizedText = "TEMPERATURE",
                    ConfidenceScore = 0.95,
                    Metadata = JsonSerializer.Serialize(new { type = "temperature", value = tempMatch.Groups[1].Value })
                });
            }

            return vitalSigns;
        }
    }
}
