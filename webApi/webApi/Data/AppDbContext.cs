using Microsoft.EntityFrameworkCore;
using webApi.Models;

namespace webApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            try
            {
                if (Database.GetPendingMigrations().Any())
                {
                    Database.Migrate();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }


        public DbSet<PersonModel> Persons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Add unique constraints for Cin and Email
            modelBuilder.Entity<PersonModel>()
                .HasIndex(p => p.Cin)
                .IsUnique();
            modelBuilder.Entity<PersonModel>()
                .HasIndex(p => p.Email)
                .IsUnique();

            // Set maximum length for Gender property
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.Gender)
                .HasMaxLength(1)
                .HasColumnType("char(1)");

            // Set default value for RegistrationDate using getdate()
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.RegistrationDate)
                .HasDefaultValueSql("getdate()");

            // Set default value for IsNeedy, IsEmployee, IsActive property
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsNeedy)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsEmployee)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsActive)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsCompany)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsCustomer)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsResponsable)
                .HasDefaultValue(false);
            modelBuilder.Entity<PersonModel>()
                .Property(p => p.IsDeath)
                .HasDefaultValue(false);



            


        }


    }
}
