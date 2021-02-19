using Microsoft.EntityFrameworkCore;
 
namespace back_end
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public ApplicationContext()
        {
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=194.87.146.250;Port=5432;Database=study_proj;Username=postgres;Password=ser241199");
     }
    }
}