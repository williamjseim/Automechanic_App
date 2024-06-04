using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Mechanic.Api.Models
{
    [Table("Car_Issu3")]
    public partial class CarIssue
    {
        public CarIssue()
        {
            
        }
        public CarIssue(Car car, User creator, string description, decimal price)
        {
            this.Id = Guid.NewGuid();
            this.CreationTime = DateTime.Now;
            this.Description = description;
            this.Price = price;
            this.Creator = creator;
            this.Car = car;
        }
        public Guid Id { get; set; }
        public Car Car { get; set; }
        public User Creator { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public DateTime CreationTime { get; set; }

    }
}
