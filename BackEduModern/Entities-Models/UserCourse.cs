using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace project1
{
    public class UserCourse
    {
        public int ID { get; set; }
        [ForeignKey("Student")]
        public int StudentId { get; set; }
        public User Student { get; set; }
        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public Course Course { get; set; }
        public DateTime EnrollmentDate { get; set; } = DateTime.UtcNow;
        public decimal ProgressPercentage { get; set; } = 0;
        public bool IsCompleted { get; set; } = false;
    }
}
