using HackGame.Api.Data;
using HackGame.Api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HackGame.Api.TokenAuthorization
{
    public static class JwtAuthorization
    {
        public static string GenerateJsonWebToken(User user, IConfiguration _config, MechanicDatabase _db)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("username", user.Username),
                new Claim("role", user.Role.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()),
            };

            var token = new JwtSecurityToken(
                _config["JwtSettings:Issuer"],
                _config["JwtSettings:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: credentials
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public static Guid GetUserId(string encryptedBase64, IConfiguration config)
        {
            if(Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
            {
                string token = Encoding.UTF8.GetString(cipher);
                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                TokenValidationParameters parameters = new TokenValidationParameters
                {
                    ValidIssuer = config["JwtSettings:Issuer"],
                    ValidAudience = config["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidateActor = false,
                };

                var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
            }
            return Guid.Empty;
        }
    }
}
