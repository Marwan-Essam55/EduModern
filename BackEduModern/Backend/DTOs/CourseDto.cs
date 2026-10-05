namespace WebApplication1.DTOs
{
    public class CourseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string? InstructorName { get; set; }
        public List<LessonDto> Lessons { get; set; } = new List<LessonDto>();
    }
}
