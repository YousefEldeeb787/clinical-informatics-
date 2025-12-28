namespace ClinicSystemBackend.Services
{
    public interface IOcrService
    {
        Task<string> ExtractTextFromImageAsync(Stream imageStream, string fileName);
        Task<string> ExtractTextFromPdfAsync(Stream pdfStream);
    }
}
