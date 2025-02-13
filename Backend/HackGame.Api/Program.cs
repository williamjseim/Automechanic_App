
using Mechanic.Api.Controllers;
using Mechanic.Api.Data;
using Mechanic.Api.Middleware;
using Mechanic.Api.TokenAuthorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Web.Http;

namespace Mechanic.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthorization();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddSignalR();

            //builder.Services.AddDbContext<HackerGameDbContext>(options =>
            //options.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

#if DEBUG
            builder.Services.AddDbContext<MechanicDatabase>(options =>
            options.UseMySql(builder.Configuration.GetConnectionString("Default"),ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("Default"))));
#else
            builder.Services.AddDbContext<MechanicDatabase>(options =>
            options.UseMySql(builder.Configuration.GetConnectionString("Prod"),ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("Prod"))));
#endif
            var app = builder.Build();

            app.UseMiddleware<RenewMiddleWare>();

            app.UseCors(policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin()
            .WithExposedHeaders("permission", "refreshtoken", "renewedtoken"));

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.MapControllers();


            app.Run();
        }
    }
}