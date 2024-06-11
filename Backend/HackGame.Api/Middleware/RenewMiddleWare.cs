using Mechanic.Api.TokenAuthorization;
using System.IdentityModel.Tokens.Jwt;

namespace Mechanic.Api.Middleware
{
    public class RenewMiddleWare
    {
        private readonly RequestDelegate _next;

        public RenewMiddleWare(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task InvokeAsync(HttpContext context, IConfiguration config)
        {
            try
            {

                if (context.Request.Headers.Authorization.Count > 0 && context.Request.Headers["refreshtoken"].Count > 0)
                {
                    Guid id = JwtAuthorization.GetUserId(context.Request.Headers.Authorization, config);
                    if (JwtAuthorization.ValidateRefreshToken(context.Request.Headers["refreshtoken"], id, config))
                    {
                        if (JwtAuthorization.CanRenewToken(context.Request.Headers.Authorization, config, out string refreshedToken))
                        {
                            context.Response.Headers.Add("renewedtoken", refreshedToken);
                            Console.WriteLine("new token");
                        }
                    }
                }
                await Console.Out.WriteLineAsync("Token renewal successful");
                await _next(context);
            }
            catch
            {
                Console.WriteLine("error during renewal of tokens");
                await _next(context);
            }
        }
    }
}
