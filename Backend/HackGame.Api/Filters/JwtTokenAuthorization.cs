using HackGame.Api.TokenAuthorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Web.Http.Controllers;

namespace HackGame.Api.Filters
{
    public class JwtTokenAuthorization : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                IConfiguration config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
                string token = context.HttpContext.Request.Cookies["JwtToken"];
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
                if(validatedToken.ValidFrom > DateTime.Now && validatedToken.SigningKey == new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtSettings:Key"]!)))
                {
                    context.Result = new OkResult();
                    return;
                }
                context.Result = new UnauthorizedResult();
                OnAuthorization(context);
            }
            catch
            {
                context.Result = new UnauthorizedResult();
                return;
            }
        }
    }
}
