using System.Web.Http;

namespace HackGame.Api.Controllers
{

    public class ApiVideoController : ApiController
    {
        [Route("GetVideo")]
        [HttpGet]
        public async void GetVideo(CancellationToken token)
        {
            string filepath = @"C:\Users\zbcwise\Desktop\Angular Videoplayer\Olsen-banden i Jylland (1971) - Vi skal ikke hjem, vi skal videre!.mp4";
            var respose = Request.CreateResponse();
            var stream = new VideoStream(filepath);
            respose.Content = new PushStreamContent(stream.WriteToSteam);
        }
    }
}
