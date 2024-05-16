using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanic.Api.Models
{
    public enum Role
    {
        User = 0,
        Admin = 1,
    }

    [Table("Us3r_Data")]
    public partial class User
    {
        public User()
        {
            
        }
        public User(string username, string password, string email, Role role, IConfiguration config)
        {
            Id = Guid.NewGuid();
            this.CreationDate = DateTime.Now;
            this.Email = email;
            this.Username = username;
            this.Password = PasswordHasher.HashPassword(password + config["Password:Seed"]);
        }
        public Guid Id { get; set; }
        public Role Role { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
