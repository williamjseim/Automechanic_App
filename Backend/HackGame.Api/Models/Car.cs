using System.Buffers.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanic.Api.Models
{
    [Table("C3r_Data")]
    public partial class Car
    {
        public Car()
        {
            
        }
        public Car(string vinNumber, string plate, string make, string model)
        {
            this.Id = Guid.NewGuid();
            CreationTime = DateTime.Now;
            this.VinNumber = vinNumber;
            this.Plate = plate;
            this.Make = make;
            this.Model = model;
        }
        public Guid Id { get; set; }
        //public string CarImageBase64 {  get; set; }
        public string VinNumber { get; set; }
        public string Plate { get; set; }
        public DateTime CreationTime { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
