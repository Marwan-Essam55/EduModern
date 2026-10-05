using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using project1;

namespace WebApplication1.Controllers
{
    [Route("GET/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbcontext _context;
        public StudentsController(AppDbcontext contexet)
        {
            _context = contexet;
        }
        [HttpGet("AllStudentsById")]
        public IActionResult GetStudents(int id)
        {
            var student = _context.Users.FirstOrDefault(x => x.Id == id && x.Role == UserRole.Student);
            return Ok(student);
        }
        [HttpGet("AllStudentsByRole")]
        public IActionResult GetStudentsByRole(UserRole userRole)
        {
            var students = _context.Users.Where(x => x.Role == userRole).ToList();
            return Ok(students);
        }
    }
}
