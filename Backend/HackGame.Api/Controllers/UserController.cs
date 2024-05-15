using HackGame.Api.Data;
using HackGame.Api.Models;
using HackGame.Api.TokenAuthorization;
using HackGame.Api.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Text;
namespace HackGame.Api.Controllers
{
    [Route("User")]
    public class UserController : Controller
    {
        private MechanicDatabase _db;
        private IConfiguration _config;
        public UserController(IConfiguration config, MechanicDatabase db)
        {
            this._config = config;
            this._db = db;
        }

        [HttpPut("Login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            username = username.ToLower();
            try
            {
                var user = _db.Users.Where(i => i.Username == username).FirstOrDefault();
                if (user != null && user.Password == PasswordHasher.HashPassword(password + _config["Password:Seed"])){
                    var token = JwtAuthorization.GenerateJsonWebToken(user, _config, _db);
                    var json = Json(token).Value;
                    if(user.Role == Role.Admin)
                    {
                        Response.Headers.Add("AdminKey", "True");

                    }
                    Console.WriteLine(json);
                    if(Encrypter.Encrypt(json.ToString()!, out byte[] encryptedText, _config))
                    {
                        Console.WriteLine("ok");
                        var base64 = Convert.ToBase64String(encryptedText);
                        return Ok(base64);
                    }
                    return StatusCode(500, " Something went wrong");
                }
                return StatusCode(500, " Something went wrong");
            }
            catch {
                return StatusCode(500, " Something went wrong Error");
            }
        }


        [JwtRoleAuthorization(Role.Admin)]
        [HttpPut("Register")]
        public async Task<IActionResult> Register(string username, string email, string password, int role = 0)
        {
            try
            {
                username = username.ToLower();
                if(_db.Users.Where(i=>i.Username == username || i.Email == email).Any())
                {
                    return BadRequest("Username or email already in use");
                }
                var newUser = new User(username, password, email, (Role)role, _config);
                await _db.AddAsync(newUser);
                await _db.SaveChangesAsync();
                return Ok("Welcome " + username);
            }
            catch {
                return StatusCode(500, " Something went wrong");
            }
        }

#if DEBUG
        [HttpGet("decrypt")]
        public async Task<IActionResult> Decrypt(string encryptedtext)
        {
            Encrypter.Decrypt(Convert.FromBase64String(encryptedtext), out byte[] decrypt, _config);
            return Ok(Encoding.UTF8.GetString(decrypt));
        }

        [HttpPut("TestRegister")]
        public async Task<IActionResult> TestRegister()
        {
            try
            {
                var newUser = new User("admin", "admin", "admin@email.com", Role.Admin, _config);
                await _db.AddAsync(newUser);
                await _db.SaveChangesAsync();
                return Ok("Welcome " + "admin");
            }
            catch
            {
                return StatusCode(500, " Something went wrong");
            }
        }
#endif
    }
}
