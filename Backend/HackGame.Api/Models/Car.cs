using System.Buffers.Text;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Mechanic.Api.Models
{
    [Table("C3r_Data")]
    public partial class Car
    {
        public Car()
        {
            
        }
        public Car(User creator, string vinNumber, string plate, string make, string model, string carImageBase64 = "")
        {
            this.Creator = creator;
            this.Id = Guid.NewGuid();
            CreationTime = DateTime.Now;
            this.VinNumber = vinNumber;
            this.Plate = plate;
            this.Make = make;
            this.Model = model;
            CarImageBase64 = carImageBase64;
        }
        public Guid Id { get; set; }
        public User Creator { get; set; }
        public string CarImageBase64 {  get; set; }
        public string VinNumber { get; set; }
        public string Plate { get; set; }
        public DateTime CreationTime { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
