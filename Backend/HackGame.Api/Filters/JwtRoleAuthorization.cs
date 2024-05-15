using HackGame.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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
                string token = context.HttpContext.Request.Headers.First(x => x.Key == "Authorization").Value!;
                token = token.Replace("Bearer ", string.Empty);
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
                context.Result = new UnauthorizedResult();
                var result = handler.ValidateToken(token, parameters, out SecurityToken validatedToken);
                if (validatedToken.ValidFrom > DateTime.Now && validatedToken.SigningKey == new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)))
                {
                    var role = result.Claims.Where(i => i.Type == "Role").First().Value;
                    if (!allowedRoles.Contains(Enum.Parse<Role>(role)))
                    {
                        context.Result = new UnauthorizedResult();
                    }
                    context.Result = new OkResult();
                }
                OnAuthorization(context);
                return;
            }
            catch
            {
                context.Result = new UnauthorizedResult();
                OnAuthorization(context);
                return;
            }
        }
    }
}
