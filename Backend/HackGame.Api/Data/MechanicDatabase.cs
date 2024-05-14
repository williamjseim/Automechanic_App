using HackGame.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HackGame.Api.Data
{
    public class MechanicDatabase : DbContext
    {
        public MechanicDatabase(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarIssue> CarIssues { get; set; }
        public DbSet<Video> Videos { get; set; }

    }
}
