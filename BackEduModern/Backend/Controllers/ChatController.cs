using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project1;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbcontext _context;
        private readonly IGeminiService _geminiService;

        public ChatController(AppDbcontext context, IGeminiService geminiService)
        {
            _context = context;
            _geminiService = geminiService;
        }

        public class ChatRequest
        {
            public int LessonId { get; set; }
            public string Question { get; set; }
        }
        [AllowAnonymous]
        [HttpPost("Ask")]
        public async Task<IActionResult> AskQuestion([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Question))
                return BadRequest("Question cannot be empty.");

            var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.Id == request.LessonId);

            if (lesson == null)
                return NotFound("Lesson not found.");

            if (string.IsNullOrWhiteSpace(lesson.Content))
                return BadRequest("This lesson does not have a transcript yet.");

            var answer = await _geminiService.GetAnswerFromContextAsync(lesson.Content, request.Question);

            return Ok(new { answer = answer });
        }
    }
}