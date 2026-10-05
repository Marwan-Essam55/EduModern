namespace project1
{
    internal class Program
    {
        static void Main(string[] args)
        {
            using var db = new AppDbcontext();

            var instructor = new User
            {
                FullName = "Marwan", 
                Email = "marwan@test.com",
                PasswordHash = "123456",
                Role = UserRole.Instructor,
                CreatedAt = DateTime.UtcNow
            };

            var course = new Course
            {
                Title = "HTML Mastery",
                Price = 100,
                Description = "Comprehensive HTML course",
                CreatedAt = DateTime.UtcNow,
                Instructor = instructor, 
                Lessons = new List<Lesson>
                {
                    new Lesson
                    {
                        Title = "Introduction to HTML",
                        Content = "What is HTML?",
                        OrderIndex = 1
                    },
                    new Lesson
                    {
                        Title = "HTML Tags and Elements",
                        Content = "Learn basic tags",
                        OrderIndex = 2
                    }
                }
            };

            db.Courses.Add(course);

            db.SaveChanges();

            Console.WriteLine("done");
        }
    }
}