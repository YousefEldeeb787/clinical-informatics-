namespace ClinicSystemBackend.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<bool> DeleteFileAsync(string filePath);
        Task<byte[]> DownloadFileAsync(string filePath);
        string GetFileUrl(string filePath);
    }
}
