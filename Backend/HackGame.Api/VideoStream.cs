using System.Net;

namespace HackGame.Api
{
    public class VideoStream
    {
        private readonly string _filename;

        public VideoStream(string filename)
        {
            _filename = filename;
        }

        public async Task WriteToSteam(Stream outputStream, HttpContent content, TransportContext context)
        {
            try
            {
                Console.WriteLine(outputStream.GetType());
                var buffer = new byte[65536];
                using ( var video = File.Open(_filename, FileMode.Open, FileAccess.Read))
                {
                    var length = (int)video.Length;
                    var bytesRead = 1;

                    while (length > 0 && bytesRead > 1)
                    {
                        bytesRead = video.Read(buffer, 0, Math.Min(length, buffer.Length));
                        await outputStream.WriteAsync(buffer, 0, bytesRead);
                        length -= bytesRead;
                        await content.CopyToAsync(outputStream);
                    }
                }
            }
            catch (Exception ex)
            {
                return;
            }
            finally
            {
                outputStream.Close();
            }
        }


    }
}
