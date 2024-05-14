using HackGame.Api;
using Microsoft.AspNetCore.Mvc;

[Route("Video")]
public class VideoController : Controller{

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
            Console.WriteLine(len);
            while(len > 0 && (bytes = stream.Read(buffer, 0, buffer.Length))> 0 && !token.IsCancellationRequested) {
                await HttpContext.Response.BodyWriter.FlushAsync();
                await HttpContext.Response.BodyWriter.AsStream(false).WriteAsync(buffer, 0, bytes);
                len -= bytes;
            }
            Console.WriteLine(len);
        }
    }
}