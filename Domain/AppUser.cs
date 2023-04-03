using System.ComponentModel;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public long SpaceUsed { get; set; } = 0;
        [DefaultValue(0)]
        public long SpaceAllowed {get; set;} = 0;
        public ICollection<Tag> Tags {get; set;}
        public ICollection<ImageData> ImagesData { get; set; }
        public ICollection<Album> Albums { get; set; }
    }
}