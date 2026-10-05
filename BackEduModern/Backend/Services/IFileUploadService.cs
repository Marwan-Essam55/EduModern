using Microsoft.AspNetCore.Http;

namespace WebApplication1.Services
{
    public interface IFileUploadService
    {
        Task<string> UploadVideoAsync(IFormFile file);
    }
}