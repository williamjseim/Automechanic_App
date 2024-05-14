using Microsoft.EntityFrameworkCore;

namespace HackGame.Api.Data
{
    public class HackerGameDbContext : DbContext
    {
        public HackerGameDbContext(DbContextOptions options) : base(options)
        {
        }

    }
}
