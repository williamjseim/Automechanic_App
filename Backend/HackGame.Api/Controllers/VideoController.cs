using Mechanic.Api;
using Microsoft.AspNetCore.Mvc;

[Route("Video")]
public class VideoController : Controller{

    private readonly string _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "UploadedVideos");

    [HttpGet("Stream")]
    public async Task StreamVideo(CancellationToken token)
    {
        HttpContext.Response.ContentType = "Video/Webm";
        string filepath = @"C:\Users\zbcwise\Desktop\Angular Videoplayer\1 hour timer.mp4";
        FileInfo fileInfo = new FileInfo(filepath);
        int len = (int)fileInfo.Length, bytes;
        HttpContext.Response.ContentLength = len;
        byte[] buffer = new byte[256];
        Console.WriteLine("stream begin");
        Response.Cookies.Append("Cookie", "Fuck you");
        using (Stream stream = System.IO.File.OpenRead(filepath))
        {
            while(len > 0 && (bytes = stream.Read(buffer, 0, buffer.Length))> 0 && !token.IsCancellationRequested) {
                await HttpContext.Response.BodyWriter.FlushAsync();
                await HttpContext.Response.BodyWriter.AsStream(false).WriteAsync(buffer, 0, bytes);
                len -= bytes;
            }
        }
    }

    [Route("Upload")]
    [HttpPost]
    public async Task<IActionResult> UploadVideo()
    {
        try
        {
            if (!Directory.Exists(_uploadFolder))
                Directory.CreateDirectory(_uploadFolder);

            var file = Request.Form.Files[0];

            if (file.Length > 0)
            {
                // Saves files locally. Eventually saved to a remote file server
                string fileName = $"{DateTime.Now:yyyyMMddHHmmss}-video.mp4";
                var filePath = Path.Combine(_uploadFolder, fileName);
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