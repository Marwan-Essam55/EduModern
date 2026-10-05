using System.Text;
using System.Text.Json;

namespace WebApplication1.Services
{
    public class AssemblyAIService : IAssemblyAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AssemblyAIService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["AssemblyAI:ApiKey"];

            _httpClient.DefaultRequestHeaders.Add("Authorization", _apiKey);
        }

        public async Task<string> GenerateTranscriptAsync(string audioUrl)
        {
            var requestBody = new
            {
                audio_url = audioUrl,
                language_detection = true
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.assemblyai.com/v2/transcript", content);
            var responseJson = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseJson);
            string transcriptId = doc.RootElement.GetProperty("id").GetString();

            string status = "queued";
            while (status != "completed" && status != "error")
            {
                await Task.Delay(3000); 

                var pollResponse = await _httpClient.GetAsync($"https://api.assemblyai.com/v2/transcript/{transcriptId}");
                var pollJson = await pollResponse.Content.ReadAsStringAsync();
                using var pollDoc = JsonDocument.Parse(pollJson);

                status = pollDoc.RootElement.GetProperty("status").GetString();

                if (status == "completed")
                {
                    return pollDoc.RootElement.GetProperty("text").GetString();
                }
            }

            return "Failed to generate transcript.";
        }
    }
}