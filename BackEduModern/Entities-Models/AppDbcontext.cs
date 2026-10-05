using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace project1
{
    public class AppDbcontext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        // ده اللي الـ Web API بيستخدمه
        public AppDbcontext(DbContextOptions<AppDbcontext> options)
            : base(options)
        {
        }

        // ده عشان مشروع الـ Console القديم يقدر يعمل new AppDbcontext()
        public AppDbcontext()
        {
        }

        // ده للـ Console project فقط لما ميبقاش فيه Options متحقنة
        protected override void OnConfiguring(DbContextOptionsBuilder builder)
        {
            if (!builder.IsConfigured)
            {
                builder.UseSqlServer(Connection.ConnectionString);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<IdentityRole<int>>().ToTable("Roles");

            foreach (var foreignKey in modelBuilder.Model
                .GetEntityTypes()
                .SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<Course>()
                .Property(c => c.Title)
                .HasColumnType("nvarchar(200)");

            modelBuilder.Entity<Course>()
                .Property(c => c.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<UserCourse>()
                .HasIndex(uc => new { uc.StudentId, uc.CourseId })
                .IsUnique();
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<UserCourse> UserCourses { get; set; }
        public DbSet<LessonProgress> LessonProgresses { get; set; }
        public DbSet<Resource> Resources { get; set; }
    }
}