using Mechanic.Api.Data;
using Mechanic.Api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Mechanic.Api.TokenAuthorization
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
                new Claim(JwtRegisteredClaimNames.Aud, user.Role.ToString()),
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

        public static string RenewToken(ClaimsPrincipal claims, IConfiguration _config)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var newclaims = new[]
            {
                new Claim("username", claims.FindFirstValue("username")),
                new Claim(JwtRegisteredClaimNames.Aud, claims.FindFirstValue(JwtRegisteredClaimNames.Aud)),
                new Claim(JwtRegisteredClaimNames.Jti, claims.FindFirstValue(JwtRegisteredClaimNames.Jti)),
            };

            var token = new JwtSecurityToken(
                _config["JwtSettings:Issuer"],
                _config["JwtSettings:Issuer"],
                newclaims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: credentials
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public static Guid GetUserId(string encryptedBase64, IConfiguration config)
        {
            encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
            encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
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
#if DEBUG
                    ValidateLifetime = false,
#else
                    ValidateLifetime = true,
#endif
                    ValidateIssuerSigningKey = true,
                    ValidateActor = false,
                };
                var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
                if(Guid.TryParse(result.Claims.First(i => i.Type == JwtRegisteredClaimNames.Jti).Value, out Guid id))
                {
                    return id;
                }
            }
            return Guid.Empty;
        }

        public static Role GetUserRole(string encryptedBase64, IConfiguration config)
        {
            encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
            encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
            if (Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
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
#if DEBUG
                    ValidateLifetime = false,
#else
                    ValidateLifetime = true,
#endif
                    ValidateIssuerSigningKey = true,
                    ValidateActor = false,
                };
                var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
                string roleString = result.Claims.First(i => i.Type == JwtRegisteredClaimNames.Aud).Value;
                if(Enum.TryParse<Role>(roleString, out Role role))
                {
                    return role;
                }
                return Role.User;
                
            }
            return Role.User;
        }
    }
}
