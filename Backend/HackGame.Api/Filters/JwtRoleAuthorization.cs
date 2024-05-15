using HackGame.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace HackGame.Api.Filters
{
    public class JwtRoleAuthorization : Attribute, IAuthorizationFilter
    {
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
                if(Encrypter.Decrypt(Convert.FromBase64String(EncryptedToken), out byte[] cipherbytes, config!))
                {
                    var token = Encoding.UTF8.GetString(cipherbytes);
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
                    var role = result.Claims.Where(i => i.Type == "Role").First().Value;
                    if (!allowedRoles.Contains(Enum.Parse<Role>(role)))
                    {
                        context.Result = new UnauthorizedResult();
                        this.OnAuthorization(context);
                        return;
                    }
                    context.Result = new OkResult();
                }
            }
            catch
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }
    }
}
