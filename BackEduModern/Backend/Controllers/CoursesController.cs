using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project1;
using System.Security.Claims;
using WebApplication1.DTOs;
namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbcontext _context;
        public CoursesController(AppDbcontext context)
        {
            _context = context;
        }
        [HttpGet("Test")]
        public IActionResult Test()
        {
            return Ok("Courses Controller is working!");
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Price = c.Price,
                    InstructorName = c.Instructor.FullName
                }).ToListAsync();

            return Ok(courses);
        }
        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .Include(c => c.Lessons.OrderBy(l => l.OrderIndex)) 
                .FirstOrDefaultAsync(c => c.Id == id);

            if (course == null)
            {
                return NotFound();
            }

            var courseDto = new CourseDto
            {
                Id = course.Id,
                Title = course.Title,
                Price = course.Price,
                InstructorName = course.Instructor.FullName,
                Lessons = course.Lessons.Select(l => new LessonDto
                {
                    Id = l.Id,
                    Title = l.Title,
                    Content = l.Content,
                    VideoUrl = l.VideoUrl,
                    OrderIndex = l.OrderIndex
                }).ToList()
            };

            return Ok(courseDto);
        }
        //[Authorize(Roles = "Admin, Instructor")]
        [Authorize]
        [HttpPost("AddCourse")]
        public async Task<IActionResult> AddCourse(CourseDto course)
        {
            var newCourse = new Course
            {
                Title = course.Title,
                Price = course.Price,
                InstructorId = 1
            };
            _context.Courses.AddAsync(newCourse);
            await _context.SaveChangesAsync();
            return Ok("Done adding course");
        }
        //[Authorize(Roles = "Admin, Instructor")]
        [HttpPut("Update/{id}")]
        public async Task<IActionResult> UpdateCourse(int id, CourseDto dto)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                return NotFound("Not found");

            course.Title = dto.Title;
            course.Price = dto.Price;

            await _context.SaveChangesAsync();

            return Ok("Updated");
        }
        //[Authorize(Roles = "Admin")]
        [Authorize]
        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                var course = await _context.Courses
                    .Include(c => c.Lessons)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (course == null)
                    return NotFound("Course not found");

                var userCourses = await _context.UserCourses
                    .Where(uc => uc.CourseId == id)
                    .ToListAsync();

                if (userCourses.Any())
                {
                    _context.UserCourses.RemoveRange(userCourses);
                }

                if (course.Lessons != null && course.Lessons.Any())
                {
                    var lessonIds = course.Lessons.Select(l => l.Id).ToList();
                    var resources = await _context.Resources
                        .Where(r => lessonIds.Contains(r.LessonId))
                        .ToListAsync();

                    if (resources.Any())
                    {
                        _context.Resources.RemoveRange(resources);
                    }

                    _context.Lessons.RemoveRange(course.Lessons);
                }

                _context.Courses.Remove(course);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Course and all related data deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        [Authorize(Roles = "Student")]
        [HttpPost("Enroll/{courseId}")]
        public async Task<IActionResult> EnrollCourse(int courseId)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null) return Unauthorized();

            int userId = int.Parse(userIdString);

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return NotFound("Course not found.");

            var alreadyEnrolled = await _context.UserCourses
                .AnyAsync(uc => uc.CourseId == courseId && uc.ID == userId);

            if (alreadyEnrolled)
                return BadRequest(new { message = "You are already enrolled in this course." });

            var enrollment = new UserCourse
            {
                CourseId = courseId,
                ID = userId,
                
            };

            _context.UserCourses.Add(enrollment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully enrolled!" });
        }

        [Authorize(Roles = "Student")]
        [HttpGet("MyCourses")]
        public async Task<IActionResult> GetMyCourses()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userIdString == null) return Unauthorized();

            int userId = int.Parse(userIdString);

            var myCourses = await _context.UserCourses
                .Where(uc => uc.ID == userId)
                .Include(uc => uc.Course)
                .Select(uc => new
                {
                    uc.Course.Id,
                    uc.Course.Title,
                    uc.Course.Price,
                })
                .ToListAsync();

            return Ok(myCourses);
        }

    }
}
