    using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
    namespace WebApplication1.Services
{
    public class FileUploadService: IFileUploadService
    {
        private readonly Cloudinary _cloudinary;
        public FileUploadService(IConfiguration config)
        {
            var account = new Account(
                config["CloudinarySettings:CloudName"],
                config["CloudinarySettings:ApiKey"],
                config["CloudinarySettings:ApiSecret"]
            );

            _cloudinary = new Cloudinary(account);
        }
        public async Task<string> UploadVideoAsync(IFormFile file)
        {
            if(file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty or null");
            }
            using var stradm=file.OpenReadStream();
            var uploadParams=new VideoUploadParams
            {
                File=new FileDescription(file.FileName, stradm),
                Folder = "EduModern/Lessons" 
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            return uploadResult.SecureUrl.ToString();
        }
        };
}
