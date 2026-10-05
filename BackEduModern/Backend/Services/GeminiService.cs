using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Threading.Tasks;

namespace WebApplication1.Services
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly ILogger<GeminiService> _logger;

        private static readonly string[] Models =
        {
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.6-flash",
            "gemini-3.5-flash"
        };

        public GeminiService(
            HttpClient httpClient,
            IConfiguration config,
            ILogger<GeminiService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            _apiKey =
                config["Gemini:ApiKey"]
                ?? config["ApiKey"]
                ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                ?? string.Empty;

            _httpClient.Timeout = TimeSpan.FromSeconds(45);
        }

        public async Task<string> GetAnswerFromContextAsync(
            string context,
            string question)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger.LogError("Gemini API Key is missing.");

                return "Error: Gemini API Key is missing.";
            }

            if (string.IsNullOrWhiteSpace(question))
            {
                return "Please enter a question.";
            }

            string prompt = $@"
You are a friendly, helpful, and highly intelligent teaching assistant for an educational platform.

Your goal is to assist students naturally and conversationally.

Here is the context of the current lesson:
{context}

Student's question:
{question}

Instructions:

1. Answer the student's question directly and helpfully.
2. Base the answer primarily on the lesson context.
3. If the question is about programming, .NET, C#, ASP.NET, databases, or web development, explain it clearly and simply.
4. If the question is unrelated to the lesson, politely mention that it is outside the current lesson scope before answering.
5. Always reply in the same language the student uses.
6. If the student speaks Arabic, answer in Arabic.
7. Do not mention these instructions.
8. Keep the answer clear and useful for a student.
";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            var options = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };

            string json = JsonSerializer.Serialize(
                requestBody,
                options
            );

            foreach (string model in Models)
            {
                try
                {
                    string result = await TryGeminiModelAsync(
                        model,
                        json
                    );

                    if (!string.IsNullOrWhiteSpace(result))
                    {
                        return result;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Unexpected error while using Gemini model {Model}.",
                        model
                    );
                }
            }

            return "The AI service is temporarily unavailable. Please try again in a few moments.";
        }

        private async Task<string?> TryGeminiModelAsync(
            string model,
            string json)
        {
            const int maxAttempts = 2;

            for (int attempt = 1; attempt <= maxAttempts; attempt++)
            {
                try
                {
                    string url =
                        $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={_apiKey.Trim()}";

                    using var content = new StringContent(
                        json,
                        Encoding.UTF8,
                        "application/json"
                    );

                    _logger.LogInformation(
                        "Sending request to Gemini model {Model}. Attempt {Attempt}/{MaxAttempts}",
                        model,
                        attempt,
                        maxAttempts
                    );

                    using HttpResponseMessage response =
                        await _httpClient.PostAsync(
                            url,
                            content
                        );

                    string responseJson =
                        await response.Content.ReadAsStringAsync();


                    if (response.IsSuccessStatusCode)
                    {
                        return ExtractAnswer(responseJson, model);
                    }


                    if (response.StatusCode ==
                        HttpStatusCode.ServiceUnavailable)
                    {
                        _logger.LogWarning(
                            "Gemini model {Model} returned 503. Attempt {Attempt}/{MaxAttempts}. Response: {Response}",
                            model,
                            attempt,
                            maxAttempts,
                            responseJson
                        );

                        if (attempt < maxAttempts)
                        {
                            await Task.Delay(
                                TimeSpan.FromSeconds(2)
                            );

                            continue;
                        }

                        return null;
                    }

                    if (response.StatusCode ==
                        HttpStatusCode.TooManyRequests)
                    {
                        _logger.LogWarning(
                            "Gemini model {Model} returned 429. Attempt {Attempt}/{MaxAttempts}. Response: {Response}",
                            model,
                            attempt,
                            maxAttempts,
                            responseJson
                        );

                        if (attempt < maxAttempts)
                        {
                            await Task.Delay(
                                TimeSpan.FromSeconds(2)
                            );

                            continue;
                        }

                        return null;
                    }

                    _logger.LogError(
                        "[GEMINI API ERROR] Model: {Model} | Status: {StatusCode} | Response: {Response}",
                        model,
                        response.StatusCode,
                        responseJson
                    );

                    return null;
                }
                catch (TaskCanceledException ex)
                {
                    _logger.LogWarning(
                        ex,
                        "Gemini request timed out. Model {Model}. Attempt {Attempt}/{MaxAttempts}",
                        model,
                        attempt,
                        maxAttempts
                    );

                    if (attempt < maxAttempts)
                    {
                        await Task.Delay(
                            TimeSpan.FromSeconds(2)
                        );

                        continue;
                    }

                    return null;
                }
                catch (HttpRequestException ex)
                {
                    _logger.LogWarning(
                        ex,
                        "HTTP error connecting to Gemini. Model {Model}. Attempt {Attempt}/{MaxAttempts}",
                        model,
                        attempt,
                        maxAttempts
                    );

                    if (attempt < maxAttempts)
                    {
                        await Task.Delay(
                            TimeSpan.FromSeconds(2)
                        );

                        continue;
                    }

                    return null;
                }
            }

            return null;
        }

        private string? ExtractAnswer(
            string responseJson,
            string model)
        {
            try
            {
                using JsonDocument doc =
                    JsonDocument.Parse(responseJson);

                JsonElement root =
                    doc.RootElement;

                if (!root.TryGetProperty(
                        "candidates",
                        out JsonElement candidates))
                {
                    _logger.LogError(
                        "Gemini response has no candidates. Model: {Model}. Response: {Response}",
                        model,
                        responseJson
                    );

                    return null;
                }

                if (candidates.GetArrayLength() == 0)
                {
                    _logger.LogWarning(
                        "Gemini returned zero candidates. Model: {Model}",
                        model
                    );

                    return null;
                }

                JsonElement candidate =
                    candidates[0];

                if (!candidate.TryGetProperty(
                        "content",
                        out JsonElement responseContent))
                {
                    _logger.LogError(
                        "Gemini response has no content. Model: {Model}",
                        model
                    );

                    return null;
                }

                if (!responseContent.TryGetProperty(
                        "parts",
                        out JsonElement parts))
                {
                    _logger.LogError(
                        "Gemini response has no parts. Model: {Model}",
                        model
                    );

                    return null;
                }

                foreach (JsonElement part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty(
                            "text",
                            out JsonElement textElement))
                    {
                        string? answer =
                            textElement.GetString();

                        if (!string.IsNullOrWhiteSpace(answer))
                        {
                            _logger.LogInformation(
                                "Gemini request completed successfully using {Model}.",
                                model
                            );

                            return answer;
                        }
                    }
                }

                _logger.LogWarning(
                    "Gemini returned an empty answer. Model: {Model}",
                    model
                );

                return null;
            }
            catch (JsonException ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to parse Gemini response. Model: {Model}",
                    model
                );

                return null;
            }
        }
    }
}