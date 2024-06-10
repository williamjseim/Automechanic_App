using System.ComponentModel.DataAnnotations.Schema;

namespace Mechanic.Api.Models
{
    [Table("C3r_Category")]
    public partial class CarCategory
    {
        public CarCategory()
        {

        }
        public CarCategory(string tag)
        {
            this.Id = Guid.NewGuid();
            this.tag = tag;
        }
        public Guid Id { get; set; }
        public string tag { get; set; }
    }
}