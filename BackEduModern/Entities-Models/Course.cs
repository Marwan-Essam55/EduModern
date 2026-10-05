using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace project1
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("Instructor")]
        public int InstructorId { get; set; }
        public User Instructor { get; set; }

        public List<Lesson> Lessons { get; set; } = new List<Lesson>();
        public List<UserCourse> UserCourses { get; set; } = new List<UserCourse>();
    }
}
