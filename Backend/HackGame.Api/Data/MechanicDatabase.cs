using Mechanic.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Mechanic.Api.Data
{
    public class MechanicDatabase : DbContext
    {
        public MechanicDatabase(DbContextOptions options) : base(options)
        {
            //modelBuilder.Entity<project>().HasMany(i => i.feature).WithMany();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CarIssue>().HasMany(i => i.CoAuthors).WithMany();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CarIssue> CarIssues { get; set; }
        public DbSet<Video> Videos { get; set; }
        public DbSet<CarCategory> CarCategories { get; set; }


    }
}
