namespace WebApplication1.Services
{
    public interface IGeminiService
    {
        Task<string> GetAnswerFromContextAsync(string context, string question);
    }
}