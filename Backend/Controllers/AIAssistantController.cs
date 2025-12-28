using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClinicSystemBackend.Services;
using ClinicSystemBackend.Interfaces;
using ClinicSystemBackend.Models;
using ClinicSystemBackend.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ClinicSystemBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AIAssistantController : ControllerBase
    {
        private readonly IOcrService _ocrService;
        private readonly INlpService _nlpService;
        private readonly IOntologyService _ontologyService;
        private readonly ICDSSService _cdssService;
        private readonly ClinicDbContext _context;
        private readonly ILogger<AIAssistantController> _logger;

        public AIAssistantController(
            IOcrService ocrService,
            INlpService nlpService,
            IOntologyService ontologyService,
            ICDSSService cdssService,
            ClinicDbContext context,
            ILogger<AIAssistantController> logger)
        {
            _ocrService = ocrService;
            _nlpService = nlpService;
            _ontologyService = ontologyService;
            _cdssService = cdssService;
            _context = context;
            _logger = logger;
        }

        // Upload and OCR Process Document
        [HttpPost("upload-document")]
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file, [FromForm] int patientId, [FromForm] string documentType)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file uploaded");

                // Save file
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "medical-documents");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Create document record
                var document = new MedicalDocument
                {
                    PatientId = patientId,
                    FileName = file.FileName,
                    FilePath = filePath,
                    DocumentType = documentType,
                    UploadedAt = DateTime.UtcNow,
                    IsProcessed = false
                };

                _context.MedicalDocuments.Add(document);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Document uploaded successfully",
                    documentId = document.Id,
                    fileName = document.FileName
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document");
                return StatusCode(500, $"Error uploading document: {ex.Message}");
            }
        }

        // Process OCR on uploaded document
        [HttpPost("{documentId}/process-ocr")]
        public async Task<IActionResult> ProcessOCR(int documentId)
        {
            try
            {
                var document = await _context.MedicalDocuments.FindAsync(documentId);
                if (document == null)
                    return NotFound("Document not found");

                // Perform OCR
                using var fileStream = System.IO.File.OpenRead(document.FilePath);
                var extractedText = await _ocrService.ExtractTextFromImageAsync(fileStream, document.FileName);

                // Update document
                document.OcrText = extractedText;
                document.IsProcessed = true;
                document.ProcessedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    documentId = document.Id,
                    ocrText = extractedText,
                    message = "OCR processing completed"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error processing OCR for document {documentId}");
                return StatusCode(500, $"Error processing OCR: {ex.Message}");
            }
        }

        // Extract medical entities from OCR text
        [HttpPost("{documentId}/extract-entities")]
        public async Task<IActionResult> ExtractEntities(int documentId)
        {
            try
            {
                var document = await _context.MedicalDocuments.FindAsync(documentId);
                if (document == null)
                    return NotFound("Document not found");

                if (string.IsNullOrWhiteSpace(document.OcrText))
                    return BadRequest("Document has no OCR text. Please process OCR first.");

                // Extract entities
                var entities = await _nlpService.ExtractMedicalEntitiesAsync(document.OcrText);

                // Save entities to database
                foreach (var entityDto in entities)
                {
                    var entity = new MedicalEntity
                    {
                        DocumentId = documentId,
                        EntityType = entityDto.EntityType,
                        EntityText = entityDto.EntityText,
                        NormalizedText = entityDto.NormalizedText,
                        ConfidenceScore = entityDto.ConfidenceScore,
                        Metadata = entityDto.Metadata,
                        ExtractedAt = DateTime.UtcNow
                    };

                    _context.MedicalEntities.Add(entity);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    documentId = document.Id,
                    entitiesExtracted = entities.Count,
                    entities = entities
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error extracting entities for document {documentId}");
                return StatusCode(500, $"Error extracting entities: {ex.Message}");
            }
        }

        // Map entities to ontologies
        [HttpPost("{documentId}/map-ontologies")]
        public async Task<IActionResult> MapOntologies(int documentId)
        {
            try
            {
                var entities = await _context.MedicalEntities
                    .Where(e => e.DocumentId == documentId)
                    .ToListAsync();

                if (!entities.Any())
                    return BadRequest("No entities found. Please extract entities first.");

                var mappings = new List<object>();

                foreach (var entity in entities)
                {
                    OntologyMapping? mapping = null;

                    switch (entity.EntityType)
                    {
                        case "Symptom":
                            mapping = await _ontologyService.MapToSnomedCT(entity.EntityText);
                            break;
                        case "Diagnosis":
                            mapping = await _ontologyService.MapToICD10(entity.EntityText);
                            break;
                        case "Procedure":
                            mapping = await _ontologyService.MapToUMLS(entity.EntityText);
                            break;
                    }

                    if (mapping != null)
                    {
                        entity.OntologyCode = mapping.Code;
                        entity.OntologySystem = mapping.System;
                        entity.OntologyDescription = mapping.Description;
                        entity.ConfidenceScore = mapping.ConfidenceScore;

                        mappings.Add(new
                        {
                            entityText = entity.EntityText,
                            entityType = entity.EntityType,
                            ontologyCode = mapping.Code,
                            ontologySystem = mapping.System,
                            description = mapping.Description,
                            confidence = mapping.ConfidenceScore
                        });
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    documentId = documentId,
                    mappingsCreated = mappings.Count,
                    mappings = mappings
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error mapping ontologies for document {documentId}");
                return StatusCode(500, $"Error mapping ontologies: {ex.Message}");
            }
        }

        // Generate CDSS recommendations
        [HttpPost("{documentId}/generate-recommendations")]
        public async Task<IActionResult> GenerateRecommendations(int documentId, [FromBody] GenerateRecommendationsRequest? request = null)
        {
            try
            {
                var document = await _context.MedicalDocuments
                    .Include(d => d.Patient)
                    .FirstOrDefaultAsync(d => d.Id == documentId);

                if (document == null)
                    return NotFound("Document not found");

                var entities = await _context.MedicalEntities
                    .Where(e => e.DocumentId == documentId)
                    .ToListAsync();

                if (!entities.Any())
                    return BadRequest("No entities found. Please extract and map entities first.");

                // Generate recommendations
                var recommendations = await _cdssService.GenerateRecommendationsAsync(
                    document.PatientId,
                    entities,
                    request?.AdditionalContext);

                // Save recommendations to database
                foreach (var recDto in recommendations)
                {
                    var recommendation = new CDSSRecommendation
                    {
                        PatientId = document.PatientId,
                        DocumentId = documentId,
                        RecommendationType = recDto.RecommendationType,
                        RecommendationText = recDto.RecommendationText,
                        Severity = recDto.Severity,
                        ConfidenceScore = recDto.ConfidenceScore,
                        SupportingEvidence = recDto.SupportingEvidence != null
                            ? JsonSerializer.Serialize(recDto.SupportingEvidence)
                            : null,
                        RulesApplied = recDto.RulesApplied != null
                            ? JsonSerializer.Serialize(recDto.RulesApplied)
                            : null,
                        GeneratedAt = DateTime.UtcNow,
                        IsReviewed = false
                    };

                    _context.CDSSRecommendations.Add(recommendation);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    documentId = documentId,
                    patientId = document.PatientId,
                    recommendationsGenerated = recommendations.Count,
                    recommendations = recommendations
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating recommendations for document {documentId}");
                return StatusCode(500, $"Error generating recommendations: {ex.Message}");
            }
        }

        // Complete AI analysis workflow (OCR + NLP + Ontology + CDSS)
        [HttpPost("{documentId}/complete-analysis")]
        public async Task<IActionResult> CompleteAnalysis(int documentId, [FromBody] CompleteAnalysisRequest? request = null)
        {
            try
            {
                var document = await _context.MedicalDocuments
                    .Include(d => d.Patient)
                    .FirstOrDefaultAsync(d => d.Id == documentId);

                if (document == null)
                    return NotFound("Document not found");

                var result = new
                {
                    documentId = documentId,
                    patientId = document.PatientId,
                    steps = new List<object>()
                };

                // Step 1: OCR
                if (string.IsNullOrWhiteSpace(document.OcrText))
                {
                    using var fileStream = System.IO.File.OpenRead(document.FilePath);
                    document.OcrText = await _ocrService.ExtractTextFromImageAsync(fileStream, document.FileName);
                    document.IsProcessed = true;
                    document.ProcessedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                }

                // Step 2: NLP Entity Extraction
                var entities = await _nlpService.ExtractMedicalEntitiesAsync(document.OcrText);
                foreach (var entityDto in entities)
                {
                    var entity = new MedicalEntity
                    {
                        DocumentId = documentId,
                        EntityType = entityDto.EntityType,
                        EntityText = entityDto.EntityText,
                        NormalizedText = entityDto.NormalizedText,
                        ConfidenceScore = entityDto.ConfidenceScore,
                        Metadata = entityDto.Metadata,
                        ExtractedAt = DateTime.UtcNow
                    };
                    _context.MedicalEntities.Add(entity);
                }
                await _context.SaveChangesAsync();

                // Step 3: Ontology Mapping
                var savedEntities = await _context.MedicalEntities
                    .Where(e => e.DocumentId == documentId)
                    .ToListAsync();

                foreach (var entity in savedEntities)
                {
                    OntologyMapping? mapping = null;
                    switch (entity.EntityType)
                    {
                        case "Symptom":
                            mapping = await _ontologyService.MapToSnomedCT(entity.EntityText);
                            break;
                        case "Diagnosis":
                            mapping = await _ontologyService.MapToICD10(entity.EntityText);
                            break;
                        case "Procedure":
                            mapping = await _ontologyService.MapToUMLS(entity.EntityText);
                            break;
                    }

                    if (mapping != null)
                    {
                        entity.OntologyCode = mapping.Code;
                        entity.OntologySystem = mapping.System;
                        entity.OntologyDescription = mapping.Description;
                    }
                }
                await _context.SaveChangesAsync();

                // Step 4: CDSS Recommendations
                var recommendations = await _cdssService.GenerateRecommendationsAsync(
                    document.PatientId,
                    savedEntities,
                    request?.AdditionalContext);

                foreach (var recDto in recommendations)
                {
                    var recommendation = new CDSSRecommendation
                    {
                        PatientId = document.PatientId,
                        DocumentId = documentId,
                        RecommendationType = recDto.RecommendationType,
                        RecommendationText = recDto.RecommendationText,
                        Severity = recDto.Severity,
                        ConfidenceScore = recDto.ConfidenceScore,
                        SupportingEvidence = recDto.SupportingEvidence != null
                            ? JsonSerializer.Serialize(recDto.SupportingEvidence)
                            : null,
                        RulesApplied = recDto.RulesApplied != null
                            ? JsonSerializer.Serialize(recDto.RulesApplied)
                            : null,
                        GeneratedAt = DateTime.UtcNow
                    };
                    _context.CDSSRecommendations.Add(recommendation);
                }
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    documentId = documentId,
                    patientId = document.PatientId,
                    ocrText = document.OcrText,
                    entitiesExtracted = savedEntities.Count,
                    entities = savedEntities.Select(e => new
                    {
                        e.EntityType,
                        e.EntityText,
                        e.OntologyCode,
                        e.OntologySystem,
                        e.OntologyDescription
                    }),
                    recommendationsGenerated = recommendations.Count,
                    recommendations = recommendations
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error performing complete analysis for document {documentId}");
                return StatusCode(500, $"Error performing complete analysis: {ex.Message}");
            }
        }

        // Get AI analysis summary for a patient
        [HttpGet("patient/{patientId}/summary")]
        public async Task<IActionResult> GetPatientAISummary(int patientId)
        {
            try
            {
                var documents = await _context.MedicalDocuments
                    .Where(d => d.PatientId == patientId)
                    .OrderByDescending(d => d.UploadedAt)
                    .ToListAsync();

                var entities = await _context.MedicalEntities
                    .Where(e => e.Document!.PatientId == patientId)
                    .ToListAsync();

                var recommendations = await _context.CDSSRecommendations
                    .Where(r => r.PatientId == patientId)
                    .OrderByDescending(r => r.GeneratedAt)
                    .ToListAsync();

                return Ok(new
                {
                    patientId = patientId,
                    totalDocuments = documents.Count,
                    processedDocuments = documents.Count(d => d.IsProcessed),
                    totalEntities = entities.Count,
                    entityBreakdown = entities.GroupBy(e => e.EntityType)
                        .Select(g => new { entityType = g.Key, count = g.Count() }),
                    totalRecommendations = recommendations.Count,
                    urgentAlerts = recommendations.Count(r => r.Severity == "Urgent"),
                    warnings = recommendations.Count(r => r.Severity == "Warning"),
                    recentRecommendations = recommendations.Take(10).Select(r => new
                    {
                        r.Id,
                        r.RecommendationType,
                        r.RecommendationText,
                        r.Severity,
                        r.GeneratedAt,
                        r.IsReviewed
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting AI summary for patient {patientId}");
                return StatusCode(500, $"Error getting AI summary: {ex.Message}");
            }
        }

        // Review and accept/reject recommendations
        [HttpPost("recommendations/{recommendationId}/review")]
        public async Task<IActionResult> ReviewRecommendation(int recommendationId, [FromBody] ReviewRecommendationRequest request)
        {
            try
            {
                var recommendation = await _context.CDSSRecommendations.FindAsync(recommendationId);
                if (recommendation == null)
                    return NotFound("Recommendation not found");

                recommendation.IsReviewed = true;
                recommendation.ReviewedAt = DateTime.UtcNow;
                recommendation.IsAccepted = request.IsAccepted;
                recommendation.ReviewNotes = request.ReviewNotes;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Recommendation reviewed successfully",
                    recommendationId = recommendation.Id,
                    isAccepted = recommendation.IsAccepted
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error reviewing recommendation {recommendationId}");
                return StatusCode(500, $"Error reviewing recommendation: {ex.Message}");
            }
        }
    }

    // Request DTOs
    public class GenerateRecommendationsRequest
    {
        public string? AdditionalContext { get; set; }
    }

    public class CompleteAnalysisRequest
    {
        public string? AdditionalContext { get; set; }
    }

    public class ReviewRecommendationRequest
    {
        public bool IsAccepted { get; set; }
        public string? ReviewNotes { get; set; }
    }
}
