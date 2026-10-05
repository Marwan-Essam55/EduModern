namespace WebApplication1.Services
{
    public interface IAssemblyAIService
    {
        Task<string> GenerateTranscriptAsync(string fileUrl);
    }
}