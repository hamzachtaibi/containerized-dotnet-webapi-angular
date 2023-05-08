using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace webApi.Data
{
    public class AppIdentityDbContext : IdentityDbContext
    {
        //Add this DbContext as service in [Program.cs] File and Configure it.
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options ) : base(options)
        {

            try
            {
                if (Database.GetPendingMigrations().Any())
                {
                    Database.Migrate();
                }
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // insert default data for app init

            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "1",
                Name = "superAdmin",
                NormalizedName = "SUPERADMIN"
            });

            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "2",
                Name = "admin",
                NormalizedName = "ADMIN"
            });
            modelBuilder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "3",
                Name = "editor",
                NormalizedName = "EDITOR"
            });
        }


        


    }
}
