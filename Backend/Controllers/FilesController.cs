using ClinicSystemBackend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClinicSystemBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _fileStorageService;
        private readonly ILogger<FilesController> _logger;

        public FilesController(IFileStorageService fileStorageService, ILogger<FilesController> logger)
        {
            _fileStorageService = fileStorageService;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromQuery] string folder = "general")
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest("No file provided");

                var filePath = await _fileStorageService.UploadFileAsync(file, folder);
                var fileUrl = _fileStorageService.GetFileUrl(filePath);

                return Ok(new
                {
                    fileName = file.FileName,
                    filePath,
                    fileUrl,
                    size = file.Length
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return StatusCode(500, "Error uploading file");
            }
        }

        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadMultipleFiles([FromForm] List<IFormFile> files, [FromQuery] string folder = "general")
        {
            try
            {
                if (files == null || files.Count == 0)
                    return BadRequest("No files provided");

                var uploadedFiles = new List<object>();

                foreach (var file in files)
                {
                    var filePath = await _fileStorageService.UploadFileAsync(file, folder);
                    var fileUrl = _fileStorageService.GetFileUrl(filePath);

                    uploadedFiles.Add(new
                    {
                        fileName = file.FileName,
                        filePath,
                        fileUrl,
                        size = file.Length
                    });
                }

                return Ok(uploadedFiles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading files");
                return StatusCode(500, "Error uploading files");
            }
        }

        [HttpGet("download")]
        public async Task<IActionResult> DownloadFile([FromQuery] string filePath)
        {
            try
            {
                var fileBytes = await _fileStorageService.DownloadFileAsync(filePath);
                var fileName = Path.GetFileName(filePath);
                var contentType = GetContentType(fileName);

                return File(fileBytes, contentType, fileName);
            }
            catch (FileNotFoundException)
            {
                return NotFound("File not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading file");
                return StatusCode(500, "Error downloading file");
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromQuery] string filePath)
        {
            try
            {
                var result = await _fileStorageService.DeleteFileAsync(filePath);
                
                if (result)
                    return Ok("File deleted successfully");
                else
                    return NotFound("File not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, "Error deleting file");
            }
        }

        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".doc" => "application/msword",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };
        }
    }
}
