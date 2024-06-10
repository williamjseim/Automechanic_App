using Mechanic.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Mechanic.Api.Data
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
        public DbSet<CarCategory> CarCategories { get; set; }


    }
}
