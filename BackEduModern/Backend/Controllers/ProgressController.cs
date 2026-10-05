using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project1;
using WebApplication1.DTOs;
using WebApplication1.Services;
namespace project1.Controllers
{
    [Route("api/[controller]")] 
    [ApiController]
    public class ProgressController : ControllerBase
    {
        private readonly AppDbcontext _context;

        public ProgressController(AppDbcontext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("Complete/{lessonId}")] 
        public async Task<IActionResult> MarkLessonAsComplete(int lessonId)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int studentId))
                return Unauthorized("User not found.");

            var lesson = await _context.Lessons.FindAsync(lessonId);
            if (lesson == null) return NotFound("Lesson not found.");

            var alreadyCompleted = await _context.LessonProgresses
                .AnyAsync(lp => lp.StudentId == studentId && lp.LessonId == lessonId);

            if (alreadyCompleted) return Ok(new { message = "Lesson already completed." });

            var progress = new LessonProgress
            {
                StudentId = studentId,
                LessonId = lessonId
            };
            await _context.LessonProgresses.AddAsync(progress);

            var totalLessonsInCourse = await _context.Lessons.CountAsync(l => l.CourseId == lesson.CourseId);
            var completedLessonsCount = await _context.LessonProgresses
                .Include(lp => lp.Lesson)
                .CountAsync(lp => lp.StudentId == studentId && lp.Lesson.CourseId == lesson.CourseId) + 1;

            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.StudentId == studentId && uc.CourseId == lesson.CourseId);

            if (userCourse != null)
            {
                userCourse.ProgressPercentage = Math.Round((decimal)completedLessonsCount / totalLessonsInCourse * 100, 2);

                if (userCourse.ProgressPercentage >= 100)
                    userCourse.IsCompleted = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Lesson completed successfully",
                newProgress = userCourse?.ProgressPercentage ?? 0
            });
        }
    }
}