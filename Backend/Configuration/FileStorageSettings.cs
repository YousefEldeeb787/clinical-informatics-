namespace ClinicSystemBackend.Configuration
{
    public class FileStorageSettings
    {
        public string LocalPath { get; set; } = "uploads";
        public string BaseUrl { get; set; } = "/uploads";
        public long MaxFileSizeBytes { get; set; } = 10485760; // 10MB
        public string[] AllowedExtensions { get; set; } = { ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx" };
    }
}
