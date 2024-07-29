# Entity Framework

We used a code first approach to the database with entityframework that way it would be easier to maintain the database and change it need be

### Entity Models

```cs
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

public class Car{
    public Guid Id { get; set; }
    public User Creator { get; set; }
    public string? CarImageBase64 {  get; set; }
    public string VinNumber { get; set; }
    public string Plate { get; set; }
    public DateTime CreationTime { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
}

public partial class CarCategory
{
    public Guid Id { get; set; }
    public string tag { get; set; }
}

public partial class CarIssue
{
    public Guid Id { get; set; }
    public Car Car { get; set; }
    public User Creator { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public DateTime CreationTime { get; set; }
    public CarCategory? Category { get; set; }
    public ICollection<User> CoAuthors { get; set; }
}

public partial class User
{
    public Guid Id { get; set; }
    public Role Role { get; set; }
    public string Username { get; set; }
    [JsonIgnore]
    public string Password { get; set; }
    [JsonIgnore]
    public string Email { get; set; }
    public DateTime CreationDate { get; set; }
    [NotMapped]
    public string Rolename { get { return Role.ToString(); } }
    public bool WantsNotification { get; set; }
}

public partial class Video
{
    public Guid Id { get; set; }
    public CarIssue Issue { get; set; }
    public string VideoPath { get; set; }
    public float FileSize { get; set; }
    public DateTime UploadTime { get; set; }
}
```