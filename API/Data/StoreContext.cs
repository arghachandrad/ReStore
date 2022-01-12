using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
  public class StoreContext : DbContext
  {
    public StoreContext(DbContextOptions options) : base(options)
    {
    }

    // for each of our entities we need a DBSet
    // Products in the name of the table
    public DbSet<Product> Products { get; set; }
  }
}