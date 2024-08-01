using Mechanic.Api.Data;
using Mechanic.Api.Filters;
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
        /// <summary>
        /// takes the user infomation and makes a personalized jwt token so the user can be identified later
        /// </summary>
        /// <param name="user"></param>
        /// <param name="_config"></param>
        /// <returns>unencrypted jwt token</returns>
        public static string GenerateJsonWebToken(User user, IConfiguration _config)
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
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: credentials
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public static string GenerateRefreshToken(User user, IConfiguration config)
        {
            string secret = config["Secret:ClientKey"]!;
            RefreshToken refreshToken = new(user.Id, secret);
            return refreshToken.WriteToken();
        }

/// <summary>
/// use to check if refresh token is still valid 
/// </summary>
/// <param name="encryptedbase64"></param>
/// <param name="id"></param>
/// <param name="config"></param>
/// <returns>true or false based on if its valid</returns>
        public static bool ValidateRefreshToken(string encryptedbase64, Guid id, IConfiguration config)
        {
            if(encryptedbase64 != string.Empty)
            if(Encrypter.Decrypt(Convert.FromBase64String(encryptedbase64), out byte[] cipherText, config))
            {
                string refreshTokenJson = Encoding.UTF8.GetString(cipherText);
                var refresh = RefreshToken.RecreateToken(refreshTokenJson);
                if(refresh.ClientId == id && refresh.ClientSecret == config["Secret:ClientKey"]! && refresh.ExpireTimeUtc > DateTime.UtcNow)
                {
                    return true;
                }
            }
            return false;
        }

        public static bool CanRenewToken(string encryptedBase64, IConfiguration config, out string refreshedToken)
        {

            encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
            encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
            if (Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
            {
                string token = Encoding.UTF8.GetString(cipher);
                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                var validatedToken = handler.ReadJwtToken(token);
                if(validatedToken.ValidTo > DateTime.UtcNow)
                {
                    TimeSpan timeElapsed = DateTime.UtcNow.Subtract(validatedToken.ValidFrom);
                    TimeSpan timeRemaining = validatedToken.ValidTo.Subtract(DateTime.UtcNow);
                    Console.WriteLine(timeRemaining.ToString()+ " remaining");
                    Console.WriteLine(timeElapsed.ToString()+ " Elapsed");
                    if(timeRemaining < timeElapsed)
                    {
                        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!));
                        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                        var securityToken = new JwtSecurityToken(
                            config["JwtSettings:Issuer"],
                            config["JwtSettings:Issuer"],
                            validatedToken.Claims,
                            expires: DateTime.UtcNow.AddMinutes(20),
                            signingCredentials: credentials
                        );
                        var newToken = handler.WriteToken(securityToken);
                        if(Encrypter.Encrypt(newToken, out byte[] cipherText, config))
                        {
                            refreshedToken = Convert.ToBase64String(cipherText);
                            return true;
                        }
                    }
                }

            }
            refreshedToken = "";
            return false;
        }

/// <summary>
/// decrypts jwt token so it can be read
/// </summary>
/// <param name="encryptedBase64"></param>
/// <param name="config"></param>
/// <returns>user id if jwt is valid</returns>
        public static Guid GetUserId(string encryptedBase64, IConfiguration config)
        {
            encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
            encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
            if(Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
            {
                string token = Encoding.UTF8.GetString(cipher);
                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                var readToken = handler.ReadJwtToken(token);
                if(Guid.TryParse(readToken.Claims.First(i=>i.Type == JwtRegisteredClaimNames.Jti).Value, out Guid id))
                {
                    return id;
                }
            }
            return Guid.Empty;
        }

/// <summary>
/// decrypts jwt token so role can be read
/// </summary>
/// <param name="encryptedBase64"></param>
/// <param name="config"></param>
/// <returns>user role</returns>
        public static Role GetUserRole(string encryptedBase64, IConfiguration config)
        {
            encryptedBase64 = encryptedBase64.Replace("Bearer ", string.Empty);
            encryptedBase64 = encryptedBase64.Replace("\"", string.Empty);
            if (Encrypter.Decrypt(Convert.FromBase64String(encryptedBase64), out byte[] cipher, config))
            {
                string token = Encoding.UTF8.GetString(cipher);
                JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                var result = handler.ReadJwtToken(token);
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
