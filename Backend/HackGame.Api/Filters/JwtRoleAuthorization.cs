using Mechanic.Api.Models;
using Mechanic.Api.TokenAuthorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.Formats.Asn1;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Mechanic.Api.Filters
{
    public enum Role
    {
        User = 0,
        Admin = 1,
    }

    /// <summary>
    /// only allows in roles added in the constructor parameters
    /// </summary>
    public class JwtRoleAuthorization : Attribute, IAuthorizationFilter
    {
        //array of roles that are allowed to acces this api call
        Role[] allowedRoles;
        public JwtRoleAuthorization(params Role[] roles)
        {
            this.allowedRoles = roles;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                IConfiguration config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
                string EncryptedToken = context.HttpContext.Request.Headers.First(x => x.Key == "Authorization").Value!;
                EncryptedToken = EncryptedToken.Replace("Bearer ", string.Empty);
                EncryptedToken = EncryptedToken.Replace("\"", string.Empty);
                if (Encrypter.Decrypt(Convert.FromBase64String(EncryptedToken), out byte[] cipherbytes, config!))
                {
                    var token = Encoding.UTF8.GetString(cipherbytes);
                    JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                    TokenValidationParameters parameters = new TokenValidationParameters
                    {
                        ValidIssuer = config!["JwtSettings:Issuer"]!,
                        ValidAudience = config!["JwtSettings:Audience"]!,
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
                    //checks if token is valid
                    var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
                    //gets role from validated token
                    var role = result.Claims.Where(i => i.Type == JwtRegisteredClaimNames.Aud).First().Value;
                    //var Localtime = validatedToken.ValidTo.ToLocalTime();
                    //var difference = Localtime - DateTime.Now;
                    //TimeSpan min = new TimeSpan(0, 5, 0);
                    //if (difference.CompareTo(min) < 0 || true){
                    //    Encrypter.Encrypt(JwtAuthorization.RenewToken(result, config), out byte[] bytes, config);
                    //    context.HttpContext.Response.Headers.Add("renew", Convert.ToBase64String(bytes));
                    //}
                    if (!allowedRoles.Contains(Enum.Parse<Role>(role)))
                    {
                        context.Result = new UnauthorizedResult();
                        return;
                    }
                    return;
                }
                context.Result = new UnauthorizedResult();
                return;
            }
            catch
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }
    }
}
