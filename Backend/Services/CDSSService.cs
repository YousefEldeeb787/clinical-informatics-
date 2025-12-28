using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using System.Text.Json;

namespace ClinicSystemBackend.Services
{
    /// <summary>
    /// Clinical Decision Support System (CDSS) Service
    /// Provides rule-based recommendations for diagnosis, treatment, and alerts
    /// </summary>
    public class CDSSService : ICDSSService
    {
        private readonly ILogger<CDSSService> _logger;
        private readonly IOntologyService _ontologyService;

        public CDSSService(ILogger<CDSSService> logger, IOntologyService ontologyService)
        {
            _logger = logger;
            _ontologyService = ontologyService;
        }

        public async Task<List<CDSSRecommendationDto>> GenerateRecommendationsAsync(
            int patientId,
            List<MedicalEntity> entities,
            string? additionalContext = null)
        {
            try
            {
                _logger.LogInformation($"Generating CDSS recommendations for patient {patientId}");

                var recommendations = new List<CDSSRecommendationDto>();

                // Extract entity groups
                var symptoms = entities.Where(e => e.EntityType == "Symptom").ToList();
                var medications = entities.Where(e => e.EntityType == "Medication").ToList();
                var diagnoses = entities.Where(e => e.EntityType == "Diagnosis").ToList();
                var labValues = entities.Where(e => e.EntityType == "LabValue").ToList();
                var vitalSigns = entities.Where(e => e.EntityType == "VitalSign").ToList();

                // Rule 1: Analyze vital signs for abnormalities
                recommendations.AddRange(await AnalyzeVitalSignsAsync(vitalSigns));

                // Rule 2: Check for drug interactions
                if (medications.Count > 1)
                {
                    recommendations.AddRange(await CheckDrugInteractionsAsync(
                        medications.Select(m => m.EntityText).ToList()));
                }

                // Rule 3: Suggest diagnoses based on symptoms
                if (symptoms.Any())
                {
                    recommendations.AddRange(await SuggestDiagnosesAsync(
                        symptoms.Select(s => s.EntityText).ToList(),
                        diagnoses.Select(d => d.EntityText).ToList()));
                }

                // Rule 4: Analyze lab results
                if (labValues.Any())
                {
                    var labValueDict = new Dictionary<string, object>();
                    foreach (var lab in labValues)
                    {
                        labValueDict[lab.EntityText] = lab.Metadata ?? "";
                    }
                    recommendations.AddRange(await AnalyzeLabResultsAsync(patientId, labValueDict));
                }

                // Rule 5: First visit vs Follow-up recommendations
                if (additionalContext?.Contains("first visit", StringComparison.OrdinalIgnoreCase) == true)
                {
                    recommendations.Add(new CDSSRecommendationDto
                    {
                        RecommendationType = "FollowUp",
                        RecommendationText = "Schedule baseline laboratory tests and comprehensive health assessment",
                        Severity = "Info",
                        ConfidenceScore = 0.90,
                        RulesApplied = new List<string> { "RULE_FIRST_VISIT" }
                    });
                }

                _logger.LogInformation($"Generated {recommendations.Count} CDSS recommendations");

                return recommendations;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating CDSS recommendations for patient {patientId}");
                throw;
            }
        }

        public async Task<List<CDSSRecommendationDto>> AnalyzeLabResultsAsync(
            int patientId,
            Dictionary<string, object> labValues)
        {
            var recommendations = new List<CDSSRecommendationDto>();

            foreach (var lab in labValues)
            {
                // Blood Glucose analysis
                if (lab.Key.Contains("Blood Glucose", StringComparison.OrdinalIgnoreCase))
                {
                    var valueStr = lab.Value.ToString() ?? "";
                    if (double.TryParse(System.Text.RegularExpressions.Regex.Match(valueStr, @"\d+\.?\d*").Value, out double value))
                    {
                        if (value > 125)
                        {
                            recommendations.Add(new CDSSRecommendationDto
                            {
                                RecommendationType = "Alert",
                                RecommendationText = $"Elevated fasting blood glucose ({value} mg/dL). Consider diabetes screening and lifestyle modifications.",
                                Severity = "Warning",
                                ConfidenceScore = 0.92,
                                SupportingEvidence = new List<string> { $"Blood Glucose: {value} mg/dL (Normal: 70-100)" },
                                RulesApplied = new List<string> { "RULE_ELEVATED_GLUCOSE" }
                            });
                        }
                        else if (value < 70)
                        {
                            recommendations.Add(new CDSSRecommendationDto
                            {
                                RecommendationType = "Alert",
                                RecommendationText = $"Low blood glucose ({value} mg/dL). Monitor for hypoglycemia symptoms.",
                                Severity = "Warning",
                                ConfidenceScore = 0.95,
                                SupportingEvidence = new List<string> { $"Blood Glucose: {value} mg/dL (Normal: 70-100)" },
                                RulesApplied = new List<string> { "RULE_LOW_GLUCOSE" }
                            });
                        }
                    }
                }
            }

            await Task.CompletedTask;
            return recommendations;
        }

        public async Task<List<CDSSRecommendationDto>> SuggestDiagnosesAsync(
            List<string> symptoms,
            List<string> medicalHistory)
        {
            var recommendations = new List<CDSSRecommendationDto>();

            // Rule: Headache + Dizziness + Nausea = Migraine possibility
            if (symptoms.Any(s => s.Contains("headache", StringComparison.OrdinalIgnoreCase)) &&
                symptoms.Any(s => s.Contains("dizziness", StringComparison.OrdinalIgnoreCase)) &&
                symptoms.Any(s => s.Contains("nausea", StringComparison.OrdinalIgnoreCase)))
            {
                recommendations.Add(new CDSSRecommendationDto
                {
                    RecommendationType = "Diagnosis",
                    RecommendationText = "Consider migraine with aura. Evaluate trigger factors and consider preventive therapy.",
                    Severity = "Normal",
                    ConfidenceScore = 0.78,
                    SupportingEvidence = new List<string> { "Headache", "Dizziness", "Nausea" },
                    RulesApplied = new List<string> { "RULE_MIGRAINE_TRIAD" }
                });

                recommendations.Add(new CDSSRecommendationDto
                {
                    RecommendationType = "Treatment",
                    RecommendationText = "Consider prescribing triptans for acute migraine management. Recommend lifestyle modifications.",
                    Severity = "Info",
                    ConfidenceScore = 0.82,
                    RulesApplied = new List<string> { "RULE_MIGRAINE_TREATMENT" }
                });
            }

            // Rule: Fever + Cough = Possible respiratory infection
            if (symptoms.Any(s => s.Contains("fever", StringComparison.OrdinalIgnoreCase)) &&
                symptoms.Any(s => s.Contains("cough", StringComparison.OrdinalIgnoreCase)))
            {
                recommendations.Add(new CDSSRecommendationDto
                {
                    RecommendationType = "Diagnosis",
                    RecommendationText = "Possible respiratory infection. Consider ordering chest X-ray and complete blood count.",
                    Severity = "Warning",
                    ConfidenceScore = 0.75,
                    SupportingEvidence = new List<string> { "Fever", "Cough" },
                    RulesApplied = new List<string> { "RULE_RESPIRATORY_INFECTION" }
                });
            }

            await Task.CompletedTask;
            return recommendations;
        }

        public async Task<List<CDSSRecommendationDto>> CheckDrugInteractionsAsync(List<string> medications)
        {
            var recommendations = new List<CDSSRecommendationDto>();

            // Drug interaction rules (simplified)
            var interactions = new Dictionary<string, Dictionary<string, string>>
            {
                {
                    "lisinopril",
                    new Dictionary<string, string>
                    {
                        { "ibuprofen", "NSAIDs may reduce the antihypertensive effect of ACE inhibitors. Monitor blood pressure." }
                    }
                }
            };

            foreach (var med1 in medications)
            {
                foreach (var med2 in medications)
                {
                    if (med1 == med2) continue;

                    var med1Lower = med1.ToLower();
                    var med2Lower = med2.ToLower();

                    // Check for known interactions
                    if (interactions.ContainsKey(med1Lower) &&
                        interactions[med1Lower].Any(kv => med2Lower.Contains(kv.Key)))
                    {
                        var interactionKey = interactions[med1Lower].First(kv => med2Lower.Contains(kv.Key));
                        recommendations.Add(new CDSSRecommendationDto
                        {
                            RecommendationType = "Alert",
                            RecommendationText = $"Drug interaction alert: {med1} and {med2}. {interactionKey.Value}",
                            Severity = "Warning",
                            ConfidenceScore = 0.88,
                            SupportingEvidence = new List<string> { med1, med2 },
                            RulesApplied = new List<string> { "RULE_DRUG_INTERACTION" }
                        });
                    }
                }
            }

            await Task.CompletedTask;
            return recommendations;
        }

        private async Task<List<CDSSRecommendationDto>> AnalyzeVitalSignsAsync(List<MedicalEntity> vitalSigns)
        {
            var recommendations = new List<CDSSRecommendationDto>();

            foreach (var vital in vitalSigns)
            {
                if (vital.Metadata == null) continue;

                try
                {
                    var metadata = JsonSerializer.Deserialize<Dictionary<string, string>>(vital.Metadata);
                    if (metadata == null) continue;

                    var type = metadata.GetValueOrDefault("type", "");
                    var valueStr = metadata.GetValueOrDefault("value", "");

                    // Blood Pressure analysis
                    if (type == "blood_pressure")
                    {
                        var parts = valueStr.Split('/');
                        if (parts.Length == 2 &&
                            int.TryParse(parts[0], out int systolic) &&
                            int.TryParse(parts[1], out int diastolic))
                        {
                            if (systolic >= 140 || diastolic >= 90)
                            {
                                recommendations.Add(new CDSSRecommendationDto
                                {
                                    RecommendationType = "Alert",
                                    RecommendationText = $"Elevated blood pressure ({systolic}/{diastolic} mmHg). Consider hypertension management. Stage 2 hypertension requires immediate attention.",
                                    Severity = systolic >= 180 || diastolic >= 120 ? "Urgent" : "Warning",
                                    ConfidenceScore = 0.95,
                                    SupportingEvidence = new List<string> { $"Blood Pressure: {systolic}/{diastolic} mmHg" },
                                    RulesApplied = new List<string> { "RULE_HYPERTENSION" }
                                });
                            }
                        }
                    }

                    // Temperature analysis
                    if (type == "temperature" && double.TryParse(valueStr, out double temp))
                    {
                        if (temp >= 38.0)
                        {
                            recommendations.Add(new CDSSRecommendationDto
                            {
                                RecommendationType = "Alert",
                                RecommendationText = $"Fever detected ({temp}°C). Evaluate for infection source. Consider antipyretics.",
                                Severity = temp >= 39.0 ? "Warning" : "Info",
                                ConfidenceScore = 0.97,
                                SupportingEvidence = new List<string> { $"Temperature: {temp}°C" },
                                RulesApplied = new List<string> { "RULE_FEVER" }
                            });
                        }
                    }

                    // Heart Rate analysis
                    if (type == "heart_rate" && int.TryParse(valueStr, out int hr))
                    {
                        if (hr > 100)
                        {
                            recommendations.Add(new CDSSRecommendationDto
                            {
                                RecommendationType = "Alert",
                                RecommendationText = $"Tachycardia detected ({hr} bpm). Evaluate for underlying causes.",
                                Severity = hr > 120 ? "Warning" : "Info",
                                ConfidenceScore = 0.90,
                                SupportingEvidence = new List<string> { $"Heart Rate: {hr} bpm" },
                                RulesApplied = new List<string> { "RULE_TACHYCARDIA" }
                            });
                        }
                        else if (hr < 60)
                        {
                            recommendations.Add(new CDSSRecommendationDto
                            {
                                RecommendationType = "Alert",
                                RecommendationText = $"Bradycardia detected ({hr} bpm). Assess patient symptoms and medication list.",
                                Severity = "Info",
                                ConfidenceScore = 0.88,
                                SupportingEvidence = new List<string> { $"Heart Rate: {hr} bpm" },
                                RulesApplied = new List<string> { "RULE_BRADYCARDIA" }
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error analyzing vital sign metadata");
                }
            }

            await Task.CompletedTask;
            return recommendations;
        }
    }
}
