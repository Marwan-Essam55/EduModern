namespace WebApplication1.Services
{
    public interface IHuggingFaceService
    {
        Task<string> GenerateTranscriptAsync(byte[] audioBytes);
        Task<string> GetAnswerFromContextAsync(string context, string question);
    }
}
