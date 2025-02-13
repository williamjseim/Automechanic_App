﻿using Mechanic.Api.Data;
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
                    var token = JwtAuthorization.GenerateJsonWebToken(user, _config);
                    if(user.Role == Role.Admin)
                    {
                        Response.Headers.Add("AdminKey", "True");
                    }
                    if(Encrypter.Encrypt(token, out byte[] encryptedText, _config))
                    {
                        if(Encrypter.Encrypt(JwtAuthorization.GenerateRefreshToken(user, _config), out byte[] encryptedRefresh, _config)){

                            string refreshtokenEncryption = Convert.ToBase64String(encryptedRefresh);
                            this.Response.Headers.Add("refreshtoken", refreshtokenEncryption);
                        }
                        var base64 = Convert.ToBase64String(encryptedText);
                        this.Response.Headers.Add("permission", (user.Role == Role.Admin).ToString());
                        return Ok(base64);
                    }
                }
                return NotFound("username or password is wrong");
            }
            catch {
                return StatusCode(501, " Something went really wrong Error"+ username + password);
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpPost("Register")]
        public async Task<IActionResult> Register(string username, string email = "", string password = "Kode1234!", int role = 0)
        {
            try
            {
                username = username.ToLower();
                if(_db.Users.Where(i=>i.Username == username || i.Email == email).Any())
                {
                    return BadRequest("Username or email already in use");
                }
                var newUser = new User(username, password, "", email, (Role)role, _config);
                await _db.AddAsync(newUser);
                await _db.SaveChangesAsync();
                return Ok("Welcome " + username);
            }
            catch {
                return StatusCode(500, " Something went wrong");
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("isUserSetup")]
        public async Task<IActionResult> IsUserSetup()
        {
            try
            {
                Guid id = JwtAuthorization.GetUserId(Request.Headers.Authorization!, _config);
                User user = await _db.Users.FirstOrDefaultAsync(i => i.Id == id);
                if(user == null)
                {
                    return BadRequest("User doesnt exist");
                }
                if(user.FullName != "" && user.Email != "")
                {
                    return Ok(true);
                }
                return Ok(false);
            }
            catch
            {
                return StatusCode(500, " Something went wrong");
            }
        }

        [JwtTokenAuthorization]
        [HttpPost("SetupUser")]
        public async Task<IActionResult> SetupUser(string fullname, string email, string password)
        {
            try
            {
                if (!email.Contains('@'))
                {
                    return BadRequest("not valid email");
                }
                if(password == "Kode1234!")
                {
                    return BadRequest("Cant use that password");
                }
                Guid id = JwtAuthorization.GetUserId(Request.Headers.Authorization!, _config);
                User user = await _db.Users.FirstOrDefaultAsync(i => i.Id == id);
                if(user == null)
                {
                    return BadRequest("id doesnt exist");
                }
                user.FullName = fullname;
                user.Email = email;
                user.Password = PasswordHasher.HashPassword(password + _config["Password:Seed"]);
                _db.Users.Update(user);
                await _db.SaveChangesAsync();
                return Ok("Welcome " + user.Username);
            }
            catch
            {
                return StatusCode(500, " Something went wrong");
            }
        }

        [JwtTokenAuthorization]
        [HttpGet("DiscoverUser")]
        public async Task<IActionResult> DiscoverUser(string username) {

            try
            {
                User user = await _db.Users.FirstOrDefaultAsync(i => i.Username == username);
                if(user == null) {
                    return NotFound();
                }
                return Ok();
            }
            catch (System.Exception)
            {
                return StatusCode(500, " Something went wrong");
                throw;
            }

        }
        [JwtTokenAuthorization]
        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser(Guid? userId)
        {
            try
            {
                Role userRole = JwtAuthorization.GetUserRole(Request.Headers.Authorization!, _config);

                // Only admin can request other user profiles.
                // If role type == user. Then own profile is returned

                if (userId != null && userRole == Role.Admin)
                {
                    var viewUser = await _db.Users.FirstOrDefaultAsync(i => i.Id == userId);
                    return viewUser != null ? Ok(viewUser) : NotFound("no user found");
                }

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
        public async Task<IActionResult> GetAllUsers(int startingIndex, int amount, string username = "")
        {
            try
            {
                var users = await _db.Users.Where(i => i.Username.Contains(username ?? "")).Skip(startingIndex * amount).Take(amount).ToListAsync();

                return Ok(users);
            }
            catch 
            {
                return StatusCode(500, " Something went wrong");
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpGet("UserPages")]
        public async Task<IActionResult> UserPages(int amountPrPage, string username = "")
        {
            try
            {
                float pages = (float)_db.Users.Where(i => i.Username.Contains(username.ToLower())).Count() / (float)amountPrPage;

                int amount = (int)MathF.Ceiling(pages);
                return Ok(amount);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, Json("Something went wrong"));
            }
        }

        [JwtRoleAuthorization(Role.Admin)]
        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(Guid userId)
        {
            try
            {
                await _db.Users.Where(i => i.Id == userId).ExecuteDeleteAsync();
                await _db.SaveChangesAsync();
                return Ok(Json("Deletion successful"));
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
                var newUser = new User("admin", "admin", "", "admin@email.com", Role.Admin, _config);
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
        [HttpGet("Unauthorized")]
        public async Task<IActionResult> UnauthorizedTest()
        {
            return Unauthorized();
        }
    }
}
