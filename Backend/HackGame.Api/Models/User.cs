using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
            this.Role = role;
        }
        public Guid Id { get; set; }
        public Role Role { get; set; }
        public string Username { get; set; }
        [JsonIgnore]
        public string Password { get; set; }
        [JsonIgnore]
        public string Email { get; set; }
        public DateTime CreationDate { get; set; }
        [NotMapped]
        public string Rolename { get { return Role.ToString(); } }
    }
}
