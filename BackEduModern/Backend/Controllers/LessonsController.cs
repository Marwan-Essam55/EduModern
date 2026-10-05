using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project1;
using WebApplication1.DTOs;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Admin, Instructor")]
    [Authorize]
    public class LessonsController : ControllerBase
    {
        private readonly AppDbcontext _context;
        private readonly IFileUploadService _fileUploadService;

        private readonly IAssemblyAIService _assemblyAIService;

        public LessonsController(AppDbcontext appDbcontext, IFileUploadService fileUploadService, IAssemblyAIService assemblyAIService)
        {
            _context = appDbcontext;
            _fileUploadService = fileUploadService;
            _assemblyAIService = assemblyAIService;
        }
        [HttpGet("Course/{courseId}")]
        [Authorize]
        public async Task<IActionResult> GetLessonsByCourse(int courseId)
        {
            var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.OrderIndex)
                .Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.Content,
                    l.VideoUrl
                })
                .ToListAsync();

            return Ok(lessons);
        }

        [HttpPost("AddLesson")]
        public async Task<IActionResult> AddLesson([FromForm] LessonDto lessonDto)
        {
            if (lessonDto.VideoFile == null || lessonDto.VideoFile.Length == 0)
                return BadRequest("Please upload a valid video file.");

            var videoUrl = await _fileUploadService.UploadVideoAsync(lessonDto.VideoFile);
            if (string.IsNullOrEmpty(videoUrl))
                return BadRequest("Failed to upload video.");

            string transcript = "";

            try
            {
                var audioUrl = videoUrl.Substring(0, videoUrl.LastIndexOf('.')) + ".mp3";

                
                transcript = await _assemblyAIService.GenerateTranscriptAsync(audioUrl);
            }
            catch (Exception ex)
            {
                transcript = $"[Transcript generation failed: {ex.Message}]";
            }

            var lesson = new Lesson
            {
                Title = lessonDto.Title,
                CourseId = lessonDto.CourseId,
                OrderIndex = lessonDto.OrderIndex,
                VideoUrl = videoUrl,
                Content = transcript
            };

            await _context.Lessons.AddAsync(lesson);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Lesson added successfully with AI transcript.", lesson });
        }
    }
}