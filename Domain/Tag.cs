using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Tag
    {
        [Key]
        public long Id { get; set; }
        public string Name {get; set;}
        public string Description {get; set;}
        public ICollection<TagImageData> TagImageData { get; set; } = new List<TagImageData>();
    }
}