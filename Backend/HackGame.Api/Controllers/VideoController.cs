using Mechanic.Api;
using Microsoft.AspNetCore.Mvc;
using Mechanic.Api.Filters;
using Mechanic.Api.Models;
using Mechanic.Api.Data;
using Microsoft.EntityFrameworkCore;
[Route("Video")]
public class VideoController : Controller
{

    private MechanicDatabase _db;
    private IConfiguration _config;
    // Local upload destination
    private readonly string _uploadFolder;

    public VideoController(MechanicDatabase db, IConfiguration config)
    {
        _db = db;
        _config = config;
        _uploadFolder = _config["Videos:FolderPath"];
    }
    [HttpGet("Stream")]
    public async Task StreamVideo(CancellationToken token, string filePath)
    {
        HttpContext.Response.ContentType = "Video/Webm";
        // string filepath = @"C:\Users\zbcwise\Desktop\Angular Videoplayer\1 hour timer.mp4";
        FileInfo fileInfo = new FileInfo(filePath);
        int len = (int)fileInfo.Length, bytes;
        HttpContext.Response.ContentLength = len;
        byte[] buffer = new byte[256];
        Console.WriteLine("stream begin");
        Response.Cookies.Append("Cookie", "Fuck you");
        using (Stream stream = System.IO.File.OpenRead(filePath))
        {
            while (len > 0 && (bytes = stream.Read(buffer, 0, buffer.Length)) > 0 && !token.IsCancellationRequested)
            {
                await HttpContext.Response.BodyWriter.FlushAsync();
                await HttpContext.Response.BodyWriter.AsStream(false).WriteAsync(buffer, 0, bytes);
                len -= bytes;
            }
        }

    }

    [JwtTokenAuthorization]
    [HttpGet("StreamVideo")]
    public async Task<IResult> Stream(Guid videoId)
    {
        Video video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == videoId);

        if (video == null)
        {
            return Results.NotFound();
        }
        try
        {
            var fileName = "video.mp4";
            string path = Path.Combine(_uploadFolder, video.VideoPath);  // the video file is in the wwwroot/files folder

            var filestream = System.IO.File.OpenRead(path);
            return Results.File(filestream, contentType: "video/mp4", fileDownloadName: fileName, enableRangeProcessing: true);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message, $"Something Went Wrong in the {nameof(Stream)}");
            return Results.BadRequest();
        }
    }
    [JwtTokenAuthorization]
    [HttpGet("GetVideoIssue")]
    public async Task<IActionResult> GetVideoIssue(Guid issueId)
    {
        try
        {
            CarIssue carIssue = await _db.CarIssues.FirstOrDefaultAsync(c => c.Id == issueId);

            if (carIssue == null)
            {
                return NotFound("Car issue not found");
            }
            var videoIssues = await _db.Videos.Where(x => x.Issue == carIssue)
            .Include(x => x.Issue.Creator)
            .Include(x => x.Issue.Car)
            .ToListAsync();
            return Ok(videoIssues);
        }
        catch (System.Exception ex)
        {

            Console.WriteLine(ex);
            return StatusCode(500, Json("Something went wrong"));
        }
    }

    [JwtTokenAuthorization]
    [HttpPut("Upload")]
    [RequestSizeLimit(524288000)] // 500 MB
    public async Task<IActionResult> UploadVideo(Guid issueId)
    {
        try
        {
            CarIssue carIssue = await _db.CarIssues.FirstOrDefaultAsync(c => c.Id == issueId);

            if (carIssue == null)
            {
                return NotFound("Car issue not found");
            }
            var file = Request.Form.Files[0];
            string fileName = $"{DateTime.Now:yyyyMMddHHmmss}-video.mp4";
            var filePath = Path.Combine(_uploadFolder, fileName);

            bool isUploadedToServer = await UploadVideoFile(file, filePath);
            bool isVideoDetailsUploadedToDb = await UploadVideoDetailsToDb(carIssue, file, fileName);

            if (isUploadedToServer && isVideoDetailsUploadedToDb)
            {
                return Ok(new { message = "File uploaded", fileData = new { SavedAs = fileName, SavedTo = filePath, Size = file.Length } });
            }
            else
            {
                return BadRequest("No file was received.");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    [HttpDelete("Delete")]
    public async Task<IActionResult> DeleteVideo(Guid videoId) {

        try
        {
            Video video = await _db.Videos.FirstOrDefaultAsync(x => x.Id == videoId);

            if (video == null)
                return NotFound("Video not found");
            
            _db.Videos.Remove(video);
            _db.SaveChangesAsync();

            string fileLocation = Path.Combine(_uploadFolder, video.VideoPath);
            if (System.IO.File.Exists(fileLocation))
            {
                System.IO.File.Delete(fileLocation);
            }

            return Ok("Video Deleted");
        }
        catch (System.Exception ex)
        {
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }

    private async Task<bool> UploadVideoDetailsToDb(CarIssue carIssue, IFormFile file, string fileName)
    {
        try
        {
            float fileSize = file.Length;
            Video video = new(carIssue, fileName, fileSize);
            await _db.AddAsync(video);
            await _db.SaveChangesAsync();
            return true;
        }
        catch (System.Exception ex)
        {
            System.Console.WriteLine(ex.Message);
            return false;
        }
    }

    private async Task<bool> UploadVideoFile(IFormFile file, string filePath)
    {
        try
        {
            if (!Directory.Exists(_uploadFolder))
                Directory.CreateDirectory(_uploadFolder);

            if (file.Length > 0)
            {
                // Saves files locally. Eventually saved to a remote file server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return true;
            }
            else
            {
                return false;
            }
        }
        catch (Exception ex)
        {
            System.Console.WriteLine(ex.Message);
            return false;
        }
    }
}