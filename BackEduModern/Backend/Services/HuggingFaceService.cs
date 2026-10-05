using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace WebApplication1.Services
{
    public class HuggingFaceService : IHuggingFaceService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public HuggingFaceService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _apiKey = config["HuggingFace:ApiKey"];

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> GenerateTranscriptAsync(byte[] audioBytes)
        {
            string modelUrl = "https://api-inference.huggingface.co/models/openai/whisper-small";

            using var request = new HttpRequestMessage(HttpMethod.Post, modelUrl);
            request.Content = new ByteArrayContent(audioBytes);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                return "Failed to generate transcript.";

            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            if (doc.RootElement.TryGetProperty("text", out JsonElement textElement))
            {
                return textElement.GetString() ?? "";
            }

            return "Transcript not found in response.";
        }

        public async Task<string> GetAnswerFromContextAsync(string context, string question)
        {
            string modelUrl = "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2";

            var requestBody = new
            {
                inputs = new
                {
                    question = question,
                    context = context
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(modelUrl, jsonContent);

            if (!response.IsSuccessStatusCode)
                return "Sorry, I couldn't process the answer at the moment.";

            var responseString = await response.Content.ReadAsStringAsync();

            try
            {
                using var doc = JsonDocument.Parse(responseString);
                if (doc.RootElement.TryGetProperty("answer", out JsonElement answerElement))
                {
                    return answerElement.GetString() ?? "";
                }
            }
            catch
            {
                return "AI Model is warming up, please try asking again in a few seconds.";
            }

            return "No answer found.";
        }
    }
}