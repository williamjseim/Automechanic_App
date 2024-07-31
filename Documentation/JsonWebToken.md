# Json Web Token

#### [Filtering http calls with jwt token](#filtering-http-call-with-jwttokens)
#### [Filtering JWT token based on user roles](#filtering-http-call-with-jwttokens)
#### [Token Renewal](#jwt-token-renewal)
#### [Token encryption](./Encryption.md)

### creating a jwt
```cs
public static class JwtAuthorization
{
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
```

### Filtering Http call with jwtTokens

##### Attribute use
```cs
[JwtTokenAuthorization]
[HttpGet("RoleCall")]
public async Task<IActionResult> HttpRoleCall()
{

}
```
JwtTokenAuthorization attribute blocks any call made without an appropriate Authorization bearer token


##### Attribute class
```cs
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
#if DEBUG
                        ValidateLifetime = false,
#else
                        ValidateLifetime = true,
#endif
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
```

### Filtering jwt tokens based on role

##### Attribute use
```cs
[JwtRoleAuthorization(Role.Admin, Role.User)]
[HttpGet("RoleCall")]
public async Task<IActionResult> HttpRoleCall()
{

}
```
JwtRoleAuthorization attribute blocks any call where the appropriate role attached to the Attribute constructor isnt used.
Multiple Roles can be put in the constructor

##### Attribute class

```cs
    public enum Role
    {
        User = 0,
        Admin = 1,
    }
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
```

### Jwt token renewal

Jwt tokens should not last for long since they can get compromised with a man in the middle attack so you use a renewal token that gets sent with the jwt token so the backend gets told if its allowed to renew the token

#### Renewal Middleware use

the middleware checks if the jwt token's life span is less than half and if the renewal token is valid, if both are true it sends a header with a new token

#### Renewal Middleware class

```cs
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
```