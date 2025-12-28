using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClinicSystemBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddAIAssitant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalDocuments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UploadedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsProcessed = table.Column<bool>(type: "bit", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OcrText = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Metadata = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalDocuments_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalDocuments_Users_UploadedByUserId",
                        column: x => x.UploadedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "CDSSRecommendations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    EncounterId = table.Column<int>(type: "int", nullable: true),
                    DocumentId = table.Column<int>(type: "int", nullable: true),
                    RecommendationType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RecommendationText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ConfidenceScore = table.Column<double>(type: "float", nullable: true),
                    SupportingEvidence = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RulesApplied = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsReviewed = table.Column<bool>(type: "bit", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedByUserId = table.Column<int>(type: "int", nullable: true),
                    IsAccepted = table.Column<bool>(type: "bit", nullable: false),
                    ReviewNotes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CDSSRecommendations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CDSSRecommendations_Encounters_EncounterId",
                        column: x => x.EncounterId,
                        principalTable: "Encounters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CDSSRecommendations_MedicalDocuments_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "MedicalDocuments",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CDSSRecommendations_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CDSSRecommendations_Users_ReviewedByUserId",
                        column: x => x.ReviewedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "MedicalEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentId = table.Column<int>(type: "int", nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntityText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    NormalizedText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    OntologyCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OntologySystem = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OntologyDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ConfidenceScore = table.Column<double>(type: "float", nullable: true),
                    ExtractedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Metadata = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicalEntities_MedicalDocuments_DocumentId",
                        column: x => x.DocumentId,
                        principalTable: "MedicalDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CDSSRecommendations_DocumentId",
                table: "CDSSRecommendations",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_CDSSRecommendations_EncounterId",
                table: "CDSSRecommendations",
                column: "EncounterId");

            migrationBuilder.CreateIndex(
                name: "IX_CDSSRecommendations_PatientId",
                table: "CDSSRecommendations",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_CDSSRecommendations_ReviewedByUserId",
                table: "CDSSRecommendations",
                column: "ReviewedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalDocuments_PatientId",
                table: "MedicalDocuments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalDocuments_UploadedByUserId",
                table: "MedicalDocuments",
                column: "UploadedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalEntities_DocumentId",
                table: "MedicalEntities",
                column: "DocumentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CDSSRecommendations");

            migrationBuilder.DropTable(
                name: "MedicalEntities");

            migrationBuilder.DropTable(
                name: "MedicalDocuments");
        }
    }
}
