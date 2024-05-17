using Mechanic.Api.TokenAuthorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Text;
using System.Web.Http.Controllers;

namespace Mechanic.Api.Filters
{
    public class JwtTokenAuthorization : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                IConfiguration config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
                //string EncryptedToken = context.HttpContext.Request.Headers.FirstOrDefault(x => x.Key == "Authorization").Value;
                string base64Token = context.HttpContext.Request.Headers.Authorization;
                base64Token = base64Token.Replace("Bearer", string.Empty);
                base64Token = base64Token.Replace("\"", string.Empty);
                byte[] cipher = Convert.FromBase64String(base64Token);
                if (Encrypter.Decrypt(cipher, out byte[] cipherbytes, config!))
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
