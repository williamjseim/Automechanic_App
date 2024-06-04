using Mechanic.Api.Data;
using Mechanic.Api.Models;
using Mechanic.Api.TokenAuthorization;
using Mechanic.Api.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.EntityFrameworkCore;
namespace Mechanic.Api.Controllers
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

        [HttpPost("Login")]
        public async Task<IActionResult> Login(string username, string password)
        {
            username = username.ToLower();
            try
            {
                var user = await _db.Users.Where(i => i.Username == username).FirstOrDefaultAsync();
                if (user != null && user.Password == PasswordHasher.HashPassword(password + _config["Password:Seed"])){
                    var token = JwtAuthorization.GenerateJsonWebToken(user, _config, _db);
                    if(user.Role == Role.Admin)
                    {
                        Response.Headers.Add("AdminKey", "True");
                    }
                    if(Encrypter.Encrypt(token, out byte[] encryptedText, _config))
                    {
                        var base64 = Convert.ToBase64String(encryptedText);
                        Console.WriteLine(base64);
                        return Ok(base64);
                    }
                    return NotFound(Json("username or password is wrong"));
                }
                return NotFound(Json("username or password is wrong"));
            }
            catch {
                return StatusCode(500, " Something went really wrong Error"+ username + password);
            }
        }

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

        [JwtTokenAuthorization]
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var token = this.HttpContext.Request.Headers.Authorization.ToString();
                Guid id = JwtAuthorization.GetUserId(token, _config);
                var user = await _db.Users.FirstOrDefaultAsync(i => i.Id == id);
                if (user == null)
                {
                    return NotFound("no user found");
                }
                return Ok(user);
            }
            catch {
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            throw new NotImplementedException();
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpPut("Delete")]
        public async Task<IActionResult> Delete(Guid userId)
        {
            try
            {
                await _db.Users.Where(i => i.Id == userId).ExecuteDeleteAsync();
                await _db.SaveChangesAsync();
                return Ok("User deleted");
            }
            catch
            {
                return StatusCode(500, " Something went wrong");
            }
        }

        [HttpGet("IsAdmin")]
        [JwtRoleAuthorization(Role.Admin)]
        public async Task<IActionResult> IsUserAdmin()
        {
            return Ok(true);
        }

#if DEBUG
        [HttpGet("decrypt")]
        public ActionResult Decrypt(string encryptedtext)
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
