using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Album
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; } = 0;
        public bool Favorite { get; set; } = false;
        public DateTime DateCreate {get; set;} = DateTime.Now;
        public int Views { get; set; } = 0;
        public ICollection<AlbumImages> AlbumImages { get; set; } = new List<AlbumImages>();
    }
}