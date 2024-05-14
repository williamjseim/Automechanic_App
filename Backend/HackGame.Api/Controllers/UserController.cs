using HackGame.Api.Data;
using HackGame.Api.TokenAuthorization;
using Microsoft.AspNetCore.Mvc;

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
            try
            {
                var user = _db.Users.Where(i => i.Username == username).FirstOrDefault();
                if (user != null && user.Password == PasswordHasher.HashPassword(password + _config["Password:Seed"])){
                    var token = JwtAuthorization.GenerateJsonWebToken(user, _config, _db);
                    var json = Json(token);
                    if(Encrypter.Encrypt(json.ToString(), out string encryptedText))
                    {
                        return Ok(encryptedText);
                    }
                    return BadRequest();
                }
                return BadRequest();
            }
            catch (Exception ex) {
                return BadRequest("Something went wrong");
            }
            finally
            {
            }
        }
    }
}
