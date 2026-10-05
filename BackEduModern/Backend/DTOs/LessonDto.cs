using Microsoft.AspNetCore.Http;
namespace WebApplication1.DTOs
{
    public class LessonDto
    {
        public int Id { get; set; }
        public string? VideoUrl { get; set; }
        public string Title { get; set; }
        public string? Content { get; set; }
        public int OrderIndex { get; set; }
        public int CourseId { get; set; }

        public IFormFile? VideoFile { get; set; }
    }
}
