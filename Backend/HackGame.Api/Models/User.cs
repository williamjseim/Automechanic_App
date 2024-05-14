using System.ComponentModel.DataAnnotations.Schema;

namespace HackGame.Api.Models
{
    [Table("Us3r_Data")]
    public partial class User
    {
        public User()
        {
            
        }
        public User(string username, string password, string email, IConfiguration config)
        {
            Id = Guid.NewGuid();
            this.CreationDate = DateTime.Now;
            this.Email = email;
            this.Username = username;
            this.Password = PasswordHasher.HashPassword(password + config["Password:Seed"]);
        }
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
