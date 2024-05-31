using Mechanic.Api;
using Microsoft.AspNetCore.Mvc;
using Mechanic.Api.Filters;
using Mechanic.Api.Data;
using Mechanic.Api.TokenAuthorization;
[Route("Video")]
public class VideoController : Controller{
    IConfiguration _config;
    private MechanicDatabase _db;

    public VideoController(IConfiguration config, MechanicDatabase db)
    {
        _config = config;
        _db = db;
    }

    [HttpGet("Stream")]
    public async Task StreamVideo(CancellationToken token)
    {
        HttpContext.Response.ContentType = "Video/Webm";
        string filepath = @"C:\Users\zbcwise\Desktop\Angular Videoplayer\1 hour timer.mp4";
        FileInfo fileInfo = new FileInfo(filepath);
        int len = (int)fileInfo.Length, bytes;
        HttpContext.Response.ContentLength = len;
        byte[] buffer = new byte[256];
        using (Stream stream = System.IO.File.OpenRead(filepath))
        {
            while(len > 0 && (bytes = stream.Read(buffer, 0, buffer.Length))> 0 && !token.IsCancellationRequested) {
                await HttpContext.Response.BodyWriter.FlushAsync();
                await HttpContext.Response.BodyWriter.AsStream(false).WriteAsync(buffer, 0, bytes);
                len -= bytes;
            }
        }
    }
    
    [JwtTokenAuthorization]
    [HttpPost("Upload")]
    public async Task<IActionResult> UploadVideo()
    {
        try
        {
            Guid username = JwtAuthorization.GetUserId(this.Request.Headers.Authorization!, _config);
            string basefolder = _config["Videos:FolderPath"]!;
            if (!Directory.Exists(basefolder))
                Directory.CreateDirectory(basefolder);

            var file = Request.Form.Files[0];

            if (file.Length > 0)
            {
                // Saves files locally. Eventually saved to a remote file server
                string fileName = $"{DateTime.Now:yyyyMMddHHmmss}-video.mp4";
                var filePath = Path.Combine(basefolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

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
}