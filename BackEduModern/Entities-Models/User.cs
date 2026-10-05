using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace project1
{
    public enum UserRole
    {
        Admin,
        Instructor,
        Student
    }
    public class User :IdentityUser<int>
    {
        public string FullName { get; set; } 
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<Course> Courses { get; set; } = new List<Course>();
        public List<UserCourse> UserCourses { get; set; } = new List<UserCourse>();
    }
}
