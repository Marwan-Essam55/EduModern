using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project1;

[Route("api/[controller]")]
[ApiController]
public class ResourcesController : ControllerBase
{
    private readonly AppDbcontext _context;
   

    public ResourcesController(AppDbcontext context /*, ICloudinaryService cloudinaryService*/)
    {
        _context = context;
    }

    [HttpGet("{lessonId}")]
    [Authorize] 
    public async Task<IActionResult> GetResources(int lessonId)
    {
        var resources = await _context.Resources
            .Where(r => r.LessonId == lessonId)
            .Select(r => new { r.Id, r.Title, r.FileUrl })
            .ToListAsync();

        return Ok(resources);
    }

    [HttpPost("Upload")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<IActionResult> UploadResource([FromForm] int lessonId, [FromForm] string title, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Please select a valid file.");

        

        var fileUrl = "https://example.com/dummy-file.pdf";

        var resource = new Resource
        {
            Title = title,
            FileUrl = fileUrl,
            LessonId = lessonId
        };

        _context.Resources.Add(resource);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Resource added successfully!", resource });
    }
}