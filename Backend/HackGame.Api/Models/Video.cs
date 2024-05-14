using System.ComponentModel.DataAnnotations.Schema;

namespace HackGame.Api.Models
{
    [Table("Video_data")]
    public partial class Video
    {
        public Video()
        {
            
        }
        public Video(CarIssue issue, string videoPath, float FileSize)
        {
            Id = Guid.NewGuid();
            UploadTime = DateTime.Now;
            this.Issue = issue;
            this.VideoPath = videoPath;
            this.FileSize = FileSize;
        }
        public Guid Id { get; set; }
        public CarIssue Issue { get; set; }
        public string VideoPath { get; set; }
        public float FileSize { get; set; }
        public DateTime UploadTime { get; set; }
    }
}
